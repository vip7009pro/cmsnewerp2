import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { aiExecuteSql, aiQuery } from '../../../api/Api';
import * as XLSX from 'xlsx';
import AGTable from '../../../components/DataTable/AGTable';

type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
  sql?: string;
  prompt?: string;
  rows?: any[];
  error?: string;
};

const formatPreview = (t: string, max = 180) => {
  const s = String(t || '').trim();
  if (s.length <= max) return s;
  return s.slice(0, max) + '...';
};

const downloadRowsAsExcel = (rows: any[], fileName: string) => {
  const safeName = String(fileName || 'erp_chat').replace(/[\\/:*?"<>|]+/g, '_');
  const ws = XLSX.utils.json_to_sheet(Array.isArray(rows) ? rows : []);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, `${safeName}.xlsx`);
};

const ERPChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [showSql, setShowSql] = useState<boolean>(true);
  const [manualSql, setManualSql] = useState<string>('');
  const [runningSql, setRunningSql] = useState<boolean>(false);
  const lastRequestIdRef = useRef<number>(0);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: q }]);

    const reqId = Date.now();
    lastRequestIdRef.current = reqId;

    setSending(true);
    try {
      const resp = await aiQuery(q, { explain: true });

      if (lastRequestIdRef.current !== reqId) return;

      const data = resp?.data;
      if (data?.tk_status?.toUpperCase() !== 'OK') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data?.message ? String(data.message) : 'Query failed',
            error: data?.message ? String(data.message) : 'Query failed',
            sql: data?.sql ? String(data.sql) : undefined,
            prompt: data?.sql_generation_prompt ? String(data.sql_generation_prompt) : '',
          },
        ]);
        return;
      }

      const out = data?.data;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: out?.explanation ? String(out.explanation) : 'Đã truy vấn dữ liệu ERP.',
          sql: out?.sql ? String(out.sql) : '',
          prompt: out?.sql_generation_prompt ? String(out.sql_generation_prompt) : data?.sql_generation_prompt ? String(data.sql_generation_prompt) : '',
          rows: Array.isArray(out?.data) ? out.data : [],
        },
      ]);
    } catch (e: any) {
      if (lastRequestIdRef.current !== reqId) return;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: e?.message ? String(e.message) : String(e),
          error: e?.message ? String(e.message) : String(e),
        },
      ]);
    } finally {
      if (lastRequestIdRef.current === reqId) setSending(false);
    }
  }, [input]);

  const runManualSql = useCallback(async () => {
    const sql = String(manualSql || '').trim();
    if (!sql) return;

    const reqId = Date.now();
    lastRequestIdRef.current = reqId;

    setRunningSql(true);
    try {
      const resp = await aiExecuteSql(sql);
      if (lastRequestIdRef.current !== reqId) return;

      const data = resp?.data;
      if (data?.tk_status?.toUpperCase() !== 'OK') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data?.message ? String(data.message) : 'Execute SQL failed',
            error: data?.message ? String(data.message) : 'Execute SQL failed',
            sql: data?.sql ? String(data.sql) : sql,
          },
        ]);
        return;
      }

      const out = data?.data;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: out?.explanation ? String(out.explanation) : 'Đã chạy SQL thủ công.',
          sql: out?.sql ? String(out.sql) : sql,
          rows: Array.isArray(out?.data) ? out.data : [],
        },
      ]);
    } catch (e: any) {
      if (lastRequestIdRef.current !== reqId) return;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: e?.message ? String(e.message) : String(e),
          error: e?.message ? String(e.message) : String(e),
        },
      ]);
    } finally {
      if (lastRequestIdRef.current === reqId) setRunningSql(false);
    }
  }, [manualSql]);

  const lastResult = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role === 'assistant' && Array.isArray(m.rows)) return m;
    }
    return undefined;
  }, [messages]);

  const lastPrompt = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role === 'assistant' && m.prompt) return m.prompt;
    }
    return '';
  }, [messages]);

  const columns = useMemo(() => {
    const rows = lastResult?.rows;
    if (!rows || rows.length === 0) return [] as string[];
    const first = rows[0];
    return Object.keys(first || {});
  }, [lastResult?.rows]);

  const lastSql = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role === 'assistant' && m.sql) return m.sql;
    }
    return '';
  }, [messages]);

  const lastError = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role === 'assistant' && m.error) return m.error;
    }
    return '';
  }, [messages]);

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Paper
        variant="outlined"
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: '#ffffff',
          borderColor: '#e5e7eb',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 16 }}>ERP Chat</Typography>
            <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
              Hỏi tự nhiên - hệ thống sẽ tìm schema, sinh SQL an toàn và truy vấn SQL Server
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              size="small"
              label={showSql ? 'SQL: ON' : 'SQL: OFF'}
              onClick={() => setShowSql((v) => !v)}
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Paper>

      <Box sx={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 420px', gap: 1.5 }}>
        <Paper
          variant="outlined"
          sx={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            borderColor: '#e5e7eb',
            bgcolor: '#ffffff',
          }}
        >
          {sending ? <LinearProgress /> : null}

          <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', p: 2, bgcolor: '#ffffff' }}>
            {messages.length === 0 ? (
              <Box>
                <Typography sx={{ fontSize: 14, color: '#111827', fontWeight: 600 }}>
                  Gợi ý câu hỏi
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#6b7280', mt: 0.5 }}>
                  Doanh thu hôm nay
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#6b7280' }}>
                  Top sản phẩm bán chạy tháng này
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#6b7280' }}>
                  Khách hàng mua nhiều nhất tuần này
                </Typography>
              </Box>
            ) : (
              messages.map((m, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                    mb: 1.25,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '82%',
                      px: 1.5,
                      py: 1.1,
                      borderRadius: 2.5,
                      whiteSpace: 'pre-wrap',
                      bgcolor: m.role === 'user' ? '#2563eb' : '#f3f4f6',
                      color: m.role === 'user' ? '#ffffff' : '#111827',
                      border: '1px solid',
                      borderColor: m.role === 'user' ? '#1d4ed8' : '#e5e7eb',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    }}
                  >
                    <Typography sx={{ fontSize: 13.5, lineHeight: 1.55 }}>{m.text}</Typography>
                    {m.role === 'assistant' && Array.isArray(m.rows) && m.rows.length > 0 ? (
                      <Box sx={{ mt: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                          <Typography sx={{ fontSize: 12, opacity: 0.85 }}>
                            Rows: {m.rows.length}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              const ts = new Date();
                              const stamp = `${ts.getFullYear()}${String(ts.getMonth() + 1).padStart(2, '0')}${String(ts.getDate()).padStart(2, '0')}_${String(ts.getHours()).padStart(2, '0')}${String(ts.getMinutes()).padStart(2, '0')}${String(ts.getSeconds()).padStart(2, '0')}`;
                              downloadRowsAsExcel(m.rows || [], `erp_chat_${stamp}`);
                            }}
                          >
                            Tải Excel
                          </Button>
                        </Stack>

                        <Box
                          sx={{
                            mt: 1,
                            height: 280,
                            width: '100%',
                            border: '1px solid #e5e7eb',
                            borderRadius: 1,
                            overflow: 'hidden',
                            bgcolor: '#ffffff',
                          }}
                        >
                          <AGTable
                            toolbar={<></>}
                            data={m.rows}
                            showFilter={true}
                            rowHeight={22}
                            columnWidth={140}
                            suppressRowClickSelection={true}
                            onSelectionChange={() => {}}
                          />
                        </Box>
                      </Box>
                    ) : null}
                    {showSql && m.sql ? (
                      <Typography sx={{ fontSize: 12, mt: 1, opacity: 0.9, whiteSpace: 'pre-wrap' }}>
                        SQL:\n{m.sql}
                      </Typography>
                    ) : null}
                    {m.error ? (
                      <Typography sx={{ fontSize: 12, mt: 1, color: '#b91c1c' }}>
                        {m.error}
                      </Typography>
                    ) : null}
                  </Box>
                </Box>
              ))
            )}
          </Box>

          <Divider />
          <Box sx={{ p: 1.25, display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi ERP..."
              fullWidth
              size="small"
              disabled={sending}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <Button variant="contained" onClick={send} disabled={sending || !input.trim()}>
              Send
            </Button>
          </Box>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            borderColor: '#e5e7eb',
            bgcolor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Kết quả truy vấn</Typography>
            <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
              Hiển thị SQL và bảng dữ liệu trả về
            </Typography>
          </Box>
          <Divider />

          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.25, overflow: 'auto' }}>
            {lastError ? <Alert severity="error">{String(lastError)}</Alert> : null}

            {lastSql ? (
              <Paper variant="outlined" sx={{ p: 1.25, borderColor: '#e5e7eb', bgcolor: '#fafafa' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Typography sx={{ fontWeight: 700, fontSize: 12 }}>SQL</Typography>
                  <Chip
                    size="small"
                    label={showSql ? 'Hiện' : 'Ẩn'}
                    onClick={() => setShowSql((v) => !v)}
                    sx={{ cursor: 'pointer' }}
                  />
                </Stack>
                <Typography sx={{ fontFamily: 'Consolas, Menlo, monospace', fontSize: 12, mt: 0.75, whiteSpace: 'pre-wrap' }}>
                  {showSql ? lastSql : formatPreview(lastSql)}
                </Typography>
              </Paper>
            ) : (
              <Alert severity="info">Chưa có kết quả. Hãy gửi một câu hỏi.</Alert>
            )}

            {lastPrompt ? (
              <Paper variant="outlined" sx={{ p: 1.25, borderColor: '#e5e7eb', bgcolor: '#ffffff' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Typography sx={{ fontWeight: 700, fontSize: 12 }}>Prompt (SQL generation)</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(String(lastPrompt));
                      } catch {
                        // ignore
                      }
                    }}
                  >
                    Copy
                  </Button>
                </Stack>
                <Typography
                  sx={{
                    fontFamily: 'Consolas, Menlo, monospace',
                    fontSize: 12,
                    mt: 0.75,
                    whiteSpace: 'pre-wrap',
                    maxHeight: 220,
                    overflow: 'auto',
                    bgcolor: '#fafafa',
                    border: '1px solid #e5e7eb',
                    borderRadius: 1,
                    p: 1,
                  }}
                >
                  {String(lastPrompt)}
                </Typography>
              </Paper>
            ) : null}

            <Paper variant="outlined" sx={{ p: 1.25, borderColor: '#e5e7eb', bgcolor: '#ffffff' }}>
              <Typography sx={{ fontWeight: 700, fontSize: 12, mb: 0.75 }}>Chạy SQL thủ công</Typography>
              <TextField
                value={manualSql}
                onChange={(e) => setManualSql(e.target.value)}
                placeholder="Dán SQL SELECT vào đây..."
                fullWidth
                multiline
                minRows={4}
                size="small"
                disabled={runningSql}
              />
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button variant="contained" onClick={runManualSql} disabled={runningSql || !manualSql.trim()}>
                  Execute
                </Button>
                <Button variant="outlined" onClick={() => setManualSql('')} disabled={runningSql || manualSql.length === 0}>
                  Clear
                </Button>
              </Stack>
              {runningSql ? <LinearProgress sx={{ mt: 1 }} /> : null}
            </Paper>

            {lastResult?.rows ? (
              <Paper variant="outlined" sx={{ borderColor: '#e5e7eb' }}>
                <Box sx={{ px: 1.25, py: 1 }}>
                  <Typography sx={{ fontSize: 12, color: '#374151' }}>
                    Rows: {lastResult.rows.length}
                  </Typography>
                </Box>
                <Divider />
                <TableContainer sx={{ maxHeight: 420 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        {columns.map((c) => (
                          <TableCell key={c} sx={{ fontWeight: 700 }}>
                            {c}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lastResult.rows.slice(0, 200).map((r, i) => (
                        <TableRow key={i}>
                          {columns.map((c) => (
                            <TableCell key={c}>
                              {r?.[c] === null || r?.[c] === undefined ? '' : String(r[c])}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            ) : null}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ERPChat;
