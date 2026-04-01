import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
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
  Tooltip,
  Typography,
} from '@mui/material';
import { aiExecuteSql } from '../../../api/Api';
import { getV2ApiClient } from '../../../api/V2Api';
import * as XLSX from 'xlsx';
import AGTable from '../../../components/DataTable/AGTable';

// ─── Types ───────────────────────────────────────────────────────────────────

type PipelineStep = {
  step: string;
  duration_ms: number;
  status: 'ok' | 'error' | 'pending';
  note?: any;
};

type ErrorInfo = {
  code?: string;
  message?: string;
  http_status?: number;
  title?: string;
  description?: string;
  suggestion?: string;
  retry_after_seconds?: number;
  debug_info?: any;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
  sql?: string;
  prompt?: string;
  rows?: any[];
  error?: string;
  error_info?: ErrorInfo;
  pipeline_steps?: PipelineStep[];
  debug_info?: any;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

const STEP_LABEL: Record<string, string> = {
  QueryRewriter:        '1. Query Rewriting',
  SemanticRetriever:    '2. Semantic Retrieval',
  RelationshipExpander: '3. Relationship Expansion',
  JoinPathResolver:     '4. Join Path Resolution',
  SQLGenerator:         '5. SQL Generation',
  SQLValidator:         '6. Validation',
  Executor:             '7. Execution',
  Formatter:            '8. Formatting',
};

// ─── Pipeline Debug Panel ─────────────────────────────────────────────────────

type PipelineDebugPanelProps = {
  steps: PipelineStep[];
  debugInfo?: any;
};

function PipelineStepRow({ step, debugInfo }: { step: PipelineStep; debugInfo?: any }) {
  const [expanded, setExpanded] = useState(false);

  const statusColor = step.status === 'ok' ? '#16a34a' : step.status === 'error' ? '#dc2626' : '#6b7280';
  const statusBg = step.status === 'ok' ? '#f0fdf4' : step.status === 'error' ? '#fef2f2' : '#f9fafb';
  const label = STEP_LABEL[step.step] || step.step;
  const totalDuration = step.duration_ms || 0;

  // Extract relevant debug info per step
  const getStepDetail = () => {
    if (!debugInfo) return null;
    const key = step.step;
    if (key === 'QueryRewriter') return debugInfo.rewritten_query;
    if (key === 'SemanticRetriever') return debugInfo.resolved_schema;
    if (key === 'RelationshipExpander') return debugInfo.expanded_context;
    if (key === 'SQLGenerator') return { sql_preview: String(debugInfo.generated_sql || '').slice(0, 300) };
    if (key === 'SQLValidator') return debugInfo.validation_result;
    if (key === 'Executor') return step.note;
    return step.note || null;
  };

  const detail = getStepDetail();
  const hasDetail = detail !== null && detail !== undefined;

  return (
    <Box sx={{ mb: 0.5 }}>
      <Box
        onClick={() => hasDetail && setExpanded(v => !v)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1,
          py: 0.75,
          bgcolor: statusBg,
          borderRadius: 1,
          border: '1px solid',
          borderColor: step.status === 'ok' ? '#bbf7d0' : step.status === 'error' ? '#fecaca' : '#e5e7eb',
          cursor: hasDetail ? 'pointer' : 'default',
          '&:hover': hasDetail ? { opacity: 0.85 } : {},
          transition: 'opacity 0.15s',
        }}
      >
        {/* Status dot */}
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusColor, flexShrink: 0 }} />

        {/* Step name */}
        <Typography sx={{ flex: 1, fontSize: 12, fontWeight: 600, color: '#111827' }}>
          {label}
        </Typography>

        {/* Duration */}
        {totalDuration > 0 && (
          <Chip
            label={`${totalDuration}ms`}
            size="small"
            sx={{
              height: 18,
              fontSize: 10,
              bgcolor: '#f3f4f6',
              color: '#374151',
            }}
          />
        )}

        {/* Expand indicator */}
        {hasDetail && (
          <Typography sx={{ fontSize: 10, color: '#9ca3af', ml: 0.5 }}>
            {expanded ? '▲' : '▼'}
          </Typography>
        )}
      </Box>

      {/* Expanded detail */}
      {hasDetail && (
        <Collapse in={expanded}>
          <Box
            sx={{
              mt: 0.5,
              p: 1,
              bgcolor: '#f8fafc',
              borderRadius: 1,
              border: '1px solid #e2e8f0',
              fontFamily: 'Consolas, Menlo, monospace',
              fontSize: 11,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              maxHeight: 200,
              overflow: 'auto',
              color: '#1e293b',
            }}
          >
            {JSON.stringify(detail, null, 2)}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}

function PipelineDebugPanel({ steps, debugInfo }: PipelineDebugPanelProps) {
  if (!steps || steps.length === 0) {
    return (
      <Box sx={{ p: 1.5 }}>
        <Alert severity="info" sx={{ fontSize: 12 }}>
          Chưa có pipeline. Gửi câu hỏi để xem các bước xử lý.
        </Alert>
      </Box>
    );
  }

  const totalMs = steps.reduce((s, x) => s + (x.duration_ms || 0), 0);
  const okCount = steps.filter(s => s.status === 'ok').length;
  const errCount = steps.filter(s => s.status === 'error').length;

  return (
    <Box sx={{ p: 1.5 }}>
      {/* Summary bar */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          mb: 1.5,
          p: 1,
          bgcolor: '#f8fafc',
          borderRadius: 1,
          border: '1px solid #e2e8f0',
          flexWrap: 'wrap',
        }}
      >
        <Chip label={`${steps.length} bước`} size="small" sx={{ fontSize: 11, height: 20 }} />
        <Chip label={`✓ ${okCount} OK`} size="small" color="success" sx={{ fontSize: 11, height: 20 }} />
        {errCount > 0 && <Chip label={`✗ ${errCount} lỗi`} size="small" color="error" sx={{ fontSize: 11, height: 20 }} />}
        <Chip label={`⏱ ${totalMs}ms`} size="small" variant="outlined" sx={{ fontSize: 11, height: 20 }} />
      </Box>

      {/* Step list */}
      {steps.map((step, i) => (
        <PipelineStepRow key={i} step={step} debugInfo={debugInfo} />
      ))}
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const ERPChatV2 = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [showSql, setShowSql] = useState<boolean>(true);
  const [manualSql, setManualSql] = useState<string>('');
  const [runningSql, setRunningSql] = useState<boolean>(false);
  const [chatSummary, setChatSummary] = useState<string>('');
  const [rightTab, setRightTab] = useState<'result' | 'pipeline'>('pipeline');
  const lastRequestIdRef = useRef<number>(0);
  const sessionIdRef = useRef<string>(`${Date.now()}_${Math.random().toString(16).slice(2)}`);

  const api = getV2ApiClient();

  const buildChatHistoryForRequest = useCallback(
    (userQuestion: string) => {
      const pairs: Array<{ user: string; assistant: string }> = [];
      let pendingUser: string | null = null;
      for (const m of messages) {
        if (m.role === 'user') {
          pendingUser = String(m.text || '');
        } else if (m.role === 'assistant') {
          if (pendingUser) {
            pairs.push({ user: pendingUser, assistant: String(m.text || '') });
            pendingUser = null;
          }
        }
      }
      pairs.push({ user: String(userQuestion || ''), assistant: '' });
      const windowed = pairs.slice(Math.max(0, pairs.length - 6));
      return windowed;
    },
    [messages],
  );

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: q }]);

    const chat_history = buildChatHistoryForRequest(q);
    const reqId = Date.now();
    lastRequestIdRef.current = reqId;

    setSending(true);
    // Auto switch to pipeline tab when sending
    setRightTab('pipeline');

    try {
      const resp = await api.aiV2Query({
        question: q,
        explain: true,
        chat_history,
        chat_summary: chatSummary,
        debug: true,
      });

      if (lastRequestIdRef.current !== reqId) return;

      if (resp?.tk_status?.toUpperCase() !== 'OK') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: resp.error?.title || resp.error?.message || 'Lỗi truy vấn',
            error: resp.error?.message || 'Query failed',
            error_info: resp.error,
            sql: resp.data?.sql ? String(resp.data.sql) : undefined,
            pipeline_steps: resp.data?.pipeline_steps,
          },
        ]);
        return;
      }

      const out = resp.data;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: out?.explanation ? String(out.explanation) : 'Đã truy vấn dữ liệu ERP.',
          sql: out?.sql ? String(out.sql) : '',
          prompt: out?.sql_generation_prompt ? String(out.sql_generation_prompt) : undefined,
          rows: Array.isArray(out?.data) ? out.data : [],
          pipeline_steps: Array.isArray(out?.pipeline_steps) ? out.pipeline_steps : [],
          debug_info: out?.debug_info,
        },
      ]);

      if (out?.chat_summary !== undefined) {
        setChatSummary(String(out.chat_summary || ''));
      }
    } catch (e: any) {
      if (lastRequestIdRef.current !== reqId) return;
      const errorMessage = e?.message || String(e);
      const httpStatus = e?.response?.status;
      
      // Build complete error info from response data + axios info
      const responseError = e?.response?.data?.error || {};
      const completeErrorInfo = {
        code: responseError.code || (httpStatus ? 'HTTP_ERROR' : 'NETWORK_ERROR'),
        message: errorMessage,
        http_status: responseError.http_status || httpStatus,
        title: responseError.title || (httpStatus ? `HTTP ${httpStatus} Error` : 'Network Error'),
        description: responseError.description || (httpStatus ? `Lỗi HTTP ${httpStatus} khi gửi request` : 'Không thể kết nối tới server'),
        suggestion: responseError.suggestion || 'Vui lòng kiểm tra kết nối mạng hoặc thử lại sau',
        retry_after_seconds: responseError.retry_after_seconds,
      };
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: responseError.title || 'Lỗi truy vấn',
          error: errorMessage,
          error_info: completeErrorInfo,
        },
      ]);
    } finally {
      if (lastRequestIdRef.current === reqId) setSending(false);
    }
  }, [input, buildChatHistoryForRequest, chatSummary, api]);

  const runManualSql = useCallback(async () => {
    const sql = String(manualSql || '').trim();
    if (!sql) return;

    const reqId = Date.now();
    lastRequestIdRef.current = reqId;

    setRunningSql(true);
    setRightTab('result');
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
            sql: sql,
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

  const lastAssistantMsg = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') return messages[i];
    }
    return undefined;
  }, [messages]);

  const lastResult = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role === 'assistant' && Array.isArray(m.rows)) return m;
    }
    return undefined;
  }, [messages]);

  const lastSql = useMemo(() => lastAssistantMsg?.sql || '', [lastAssistantMsg]);
  const lastError = useMemo(() => lastAssistantMsg?.error || '', [lastAssistantMsg]);
  const lastPrompt = useMemo(() => lastAssistantMsg?.prompt || '', [lastAssistantMsg]);
  const lastPipelineSteps = useMemo(() => lastAssistantMsg?.pipeline_steps || [], [lastAssistantMsg]);
  const lastDebugInfo = useMemo(() => lastAssistantMsg?.debug_info, [lastAssistantMsg]);

  const columns = useMemo(() => {
    const rows = lastResult?.rows;
    if (!rows || rows.length === 0) return [] as string[];
    return Object.keys(rows[0] || {});
  }, [lastResult?.rows]);

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* Header */}
      <Paper
        variant="outlined"
        sx={{ px: 2, py: 1.5, bgcolor: '#ffffff', borderColor: '#e5e7eb' }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 16 }}>ERP Chat</Typography>
            <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
              Hỏi tự nhiên – hệ thống tìm schema, sinh SQL an toàn và truy vấn SQL Server
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

      {/* Body */}
      <Box sx={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 440px', gap: 1.5 }}>

        {/* LEFT: Chat */}
        <Paper
          variant="outlined"
          sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', borderColor: '#e5e7eb', bgcolor: '#ffffff' }}
        >
          {sending ? <LinearProgress /> : null}

          <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', p: 2, bgcolor: '#ffffff' }}>
            {messages.length === 0 ? (
              <Box>
                <Typography sx={{ fontSize: 14, color: '#111827', fontWeight: 600 }}>Gợi ý câu hỏi</Typography>
                <Typography sx={{ fontSize: 13, color: '#6b7280', mt: 0.5 }}>Doanh thu hôm nay</Typography>
                <Typography sx={{ fontSize: 13, color: '#6b7280' }}>Top sản phẩm bán chạy tháng này</Typography>
                <Typography sx={{ fontSize: 13, color: '#6b7280' }}>Khách hàng mua nhiều nhất tuần này</Typography>
              </Box>
            ) : (
              messages.map((m, idx) => (
                <Box
                  key={idx}
                  sx={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', mb: 1.25 }}
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

                    {/* Inline data table for this message */}
                    {m.role === 'assistant' && Array.isArray(m.rows) && m.rows.length > 0 ? (
                      <Box sx={{ mt: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                          <Typography sx={{ fontSize: 12, opacity: 0.85 }}>Rows: {m.rows.length}</Typography>
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
                        <Box sx={{ mt: 1, height: 280, width: '100%', border: '1px solid #e5e7eb', borderRadius: 1, overflow: 'hidden', bgcolor: '#ffffff' }}>
                          <AGTable toolbar={<></>} data={m.rows} showFilter={true} rowHeight={22} columnWidth={140} suppressRowClickSelection={true} onSelectionChange={() => {}} />
                        </Box>
                      </Box>
                    ) : null}

                    {/* SQL inline */}
                    {showSql && m.sql ? (
                      <Typography sx={{ fontSize: 12, mt: 1, opacity: 0.9, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        SQL:{'\n'}{m.sql}
                      </Typography>
                    ) : null}

                    {/* Error display with full details */}
                    {m.error_info || m.error ? (
                      <Alert 
                        severity="error" 
                        sx={{ 
                          mt: 1, 
                          bgcolor: '#fef2f2',
                          borderColor: '#fecaca',
                          border: '1px solid',
                        }}
                      >
                        <Stack spacing={0.75}>
                          {/* Error header: HTTP status + title */}
                          <Box>
                            {m.error_info?.http_status ? (
                              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#7f1d1d' }}>
                                {m.error_info.http_status} {m.error_info.title || 'Lỗi'}
                              </Typography>
                            ) : (
                              m.error_info?.title && (
                                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#7f1d1d' }}>
                                  {m.error_info.title}
                                </Typography>
                              )
                            )}
                          </Box>
                          
                          {/* Error code */}
                          {m.error_info?.code && (
                            <Typography sx={{ fontSize: 11, color: '#991b1b', fontFamily: 'monospace' }}>
                              Code: {m.error_info.code}
                            </Typography>
                          )}
                          
                          {/* Error message */}
                          {m.error && (
                            <Typography sx={{ fontSize: 12, color: '#7f1d1d' }}>
                              {m.error}
                            </Typography>
                          )}
                          
                          {/* Description */}
                          {m.error_info?.description && (
                            <Typography sx={{ fontSize: 12, color: '#7f1d1d', mt: 0.5 }}>
                              {m.error_info.description}
                            </Typography>
                          )}
                          
                          {/* Suggestion */}
                          {m.error_info?.suggestion && (
                            <Typography sx={{ fontSize: 12, color: '#7f1d1d', fontStyle: 'italic', mt: 0.5 }}>
                              💡 {m.error_info.suggestion}
                            </Typography>
                          )}
                          
                          {/* Retry suggestion for rate limit */}
                          {m.error_info?.retry_after_seconds && (
                            <Typography sx={{ fontSize: 11, color: '#991b1b', mt: 0.5, fontWeight: 600 }}>
                              ⏱️ Chờ {m.error_info.retry_after_seconds} giây rồi thử lại
                            </Typography>
                          )}
                        </Stack>
                      </Alert>
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
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
              }}
            />
            <Button variant="contained" onClick={send} disabled={sending || !input.trim()}>Send</Button>
          </Box>
        </Paper>

        {/* RIGHT: Result + Pipeline Debug */}
        <Paper
          variant="outlined"
          sx={{ borderColor: '#e5e7eb', bgcolor: '#ffffff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          {/* Tab header */}
          <Box sx={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
            {(['pipeline', 'result'] as const).map((tab) => (
              <Button
                key={tab}
                size="small"
                onClick={() => setRightTab(tab)}
                sx={{
                  flex: 1,
                  py: 1,
                  borderRadius: 0,
                  fontSize: 12,
                  fontWeight: rightTab === tab ? 700 : 400,
                  color: rightTab === tab ? '#2563eb' : '#6b7280',
                  borderBottom: rightTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                  '&:hover': { bgcolor: '#f9fafb' },
                }}
              >
                {tab === 'pipeline' ? '🔍 Pipeline Debug' : '📊 Kết quả SQL'}
              </Button>
            ))}
          </Box>

          {/* Tab content */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>

            {/* PIPELINE TAB */}
            {rightTab === 'pipeline' && (
              <Box>
                <Box sx={{ px: 2, py: 1, bgcolor: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Pipeline Steps</Typography>
                  <Typography sx={{ fontSize: 11, color: '#6b7280' }}>
                    8 bước xử lý – click để xem input/output chi tiết
                  </Typography>
                </Box>
                <PipelineDebugPanel steps={lastPipelineSteps} debugInfo={lastDebugInfo} />

                {/* Debug info raw */}
                {lastDebugInfo && (
                  <Box sx={{ px: 1.5, pb: 1.5 }}>
                    <Divider sx={{ mb: 1 }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.5, color: '#374151' }}>
                      🔬 Debug Info (raw)
                    </Typography>
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: '#f1f5f9',
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        fontSize: 10.5,
                        whiteSpace: 'pre-wrap',
                        maxHeight: 260,
                        overflow: 'auto',
                        border: '1px solid #e2e8f0',
                        color: '#1e293b',
                      }}
                    >
                      {JSON.stringify(lastDebugInfo, null, 2)}
                    </Box>
                  </Box>
                )}

                {/* SQL Generation Prompt */}
                {lastPrompt && (
                  <Box sx={{ px: 1.5, pb: 1.5 }}>
                    <Divider sx={{ mb: 1 }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.5, color: '#374151' }}>
                      💬 SQL Generation Prompt
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: '#6b7280', mb: 0.75 }}>
                      Dùng prompt này để test với LLM bên ngoài (ChatGPT, Claude, etc.)
                    </Typography>
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: '#fef8e7',
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        fontSize: 10.5,
                        whiteSpace: 'pre-wrap',
                        maxHeight: 300,
                        overflow: 'auto',
                        border: '1px solid #fcd34d',
                        color: '#1e293b',
                        wordBreak: 'break-word',
                      }}
                    >
                      {lastPrompt}
                    </Box>
                    <Stack direction="row" spacing={0.75} sx={{ mt: 0.75 }}>
                      <Tooltip title="Copy Prompt to Clipboard">
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: 10, py: 0.25, px: 1, minWidth: 0 }}
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(lastPrompt);
                              // Optional: show a toast notification here
                            } catch (e) {
                              console.error('Failed to copy prompt:', e);
                            }
                          }}
                        >
                          📋 Copy
                        </Button>
                      </Tooltip>
                    </Stack>
                  </Box>
                )}
              </Box>
            )}

            {/* RESULT TAB */}
            {rightTab === 'result' && (
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {lastError ? <Alert severity="error">{String(lastError)}</Alert> : null}

                {lastSql ? (
                  <Paper variant="outlined" sx={{ p: 1.25, borderColor: '#e5e7eb', bgcolor: '#fafafa' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                      <Typography sx={{ fontWeight: 700, fontSize: 12 }}>SQL</Typography>
                      <Stack direction="row" spacing={0.5}>
                        <Chip
                          size="small"
                          label={showSql ? 'Hiện' : 'Ẩn'}
                          onClick={() => setShowSql((v) => !v)}
                          sx={{ cursor: 'pointer' }}
                        />
                        <Tooltip title="Copy SQL">
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: 10, py: 0.25, px: 1, minWidth: 0 }}
                            onClick={async () => {
                              try { await navigator.clipboard.writeText(lastSql); } catch { }
                            }}
                          >
                            Copy
                          </Button>
                        </Tooltip>
                      </Stack>
                    </Stack>
                    <Typography
                      sx={{ fontFamily: 'Consolas, Menlo, monospace', fontSize: 11.5, mt: 0.75, whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto' }}
                    >
                      {showSql ? lastSql : formatPreview(lastSql)}
                    </Typography>
                  </Paper>
                ) : (
                  <Alert severity="info">Chưa có kết quả. Hãy gửi một câu hỏi.</Alert>
                )}

                {/* Manual SQL */}
                <Paper variant="outlined" sx={{ p: 1.25, borderColor: '#e5e7eb', bgcolor: '#ffffff' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 12, mb: 0.75 }}>Chạy SQL thủ công</Typography>
                  <TextField
                    value={manualSql}
                    onChange={(e) => setManualSql(e.target.value)}
                    placeholder="Dán SQL SELECT vào đây..."
                    fullWidth
                    multiline
                    minRows={3}
                    size="small"
                    disabled={runningSql}
                  />
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button variant="contained" onClick={runManualSql} disabled={runningSql || !manualSql.trim()}>Execute</Button>
                    <Button variant="outlined" onClick={() => setManualSql('')} disabled={runningSql || manualSql.length === 0}>Clear</Button>
                  </Stack>
                  {runningSql ? <LinearProgress sx={{ mt: 1 }} /> : null}
                </Paper>

                {/* Data table */}
                {lastResult?.rows ? (
                  <Paper variant="outlined" sx={{ borderColor: '#e5e7eb' }}>
                    <Box sx={{ px: 1.25, py: 1 }}>
                      <Typography sx={{ fontSize: 12, color: '#374151' }}>
                        Rows: {lastResult.rows.length}
                      </Typography>
                    </Box>
                    <Divider />
                    <TableContainer sx={{ maxHeight: 360 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            {columns.map((c) => (
                              <TableCell key={c} sx={{ fontWeight: 700, fontSize: 11 }}>{c}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {lastResult.rows.slice(0, 200).map((r, i) => (
                            <TableRow key={i}>
                              {columns.map((c) => (
                                <TableCell key={c} sx={{ fontSize: 11 }}>
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
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ERPChatV2;
