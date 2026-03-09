import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
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
import Swal from 'sweetalert2';
import { generalQuery } from '../../../api/Api';

type ColumnItem = {
  schema: string;
  table: string;
  column_id: number;
  column: string;
  type: string;
  nullable: boolean;
  identity: boolean;
  description: string;
};

const ColumnComments = () => {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(200);
  const [total, setTotal] = useState<number>(0);
  const [items, setItems] = useState<ColumnItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [savingKey, setSavingKey] = useState<string>('');
  const [rebuilding, setRebuilding] = useState<boolean>(false);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await generalQuery('get_column_comments', {
        page,
        pageSize,
        search,
      });

      const data = resp?.data;
      if (data?.tk_status?.toUpperCase() !== 'OK') {
        Swal.fire('Thông báo', data?.message ? String(data.message) : 'Load failed', 'error');
        setItems([]);
        setTotal(0);
        return;
      }

      const out = data?.data;
      setItems(Array.isArray(out?.items) ? out.items : []);
      setTotal(Number(out?.total || 0));
    } catch (e: any) {
      Swal.fire('Thông báo', e?.message ? String(e.message) : String(e), 'error');
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateDescLocal = useCallback((key: string, v: string) => {
    setItems((prev) =>
      prev.map((it) => {
        const k = `${it.schema}.${it.table}.${it.column}`;
        if (k !== key) return it;
        return { ...it, description: v };
      }),
    );
  }, []);

  const saveOne = useCallback(
    async (it: ColumnItem) => {
      const key = `${it.schema}.${it.table}.${it.column}`;
      setSavingKey(key);
      try {
        const resp = await generalQuery('update_column_comment', {
          schema: it.schema,
          table: it.table,
          column: it.column,
          description: it.description ?? '',
        });

        const data = resp?.data;
        if (data?.tk_status?.toUpperCase() !== 'OK') {
          Swal.fire('Thông báo', data?.message ? String(data.message) : 'Save failed', 'error');
          return;
        }

        Swal.fire('Thông báo', 'Đã lưu comment', 'success');
      } catch (e: any) {
        Swal.fire('Thông báo', e?.message ? String(e.message) : String(e), 'error');
      } finally {
        setSavingKey('');
      }
    },
    [],
  );

  const rebuildSchemaIndex = useCallback(async () => {
    setRebuilding(true);
    try {
      const resp = await generalQuery('rebuild_schema_index', {});
      const data = resp?.data;
      if (data?.tk_status?.toUpperCase() !== 'OK') {
        Swal.fire('Thông báo', data?.message ? String(data.message) : 'Rebuild failed', 'error');
        return;
      }

      const ms = data?.data?.ms;
      const tables = data?.data?.tables;
      Swal.fire('Thông báo', `Đã học lại schema/index. Tables=${tables ?? ''} (${ms ?? ''}ms)`, 'success');
    } catch (e: any) {
      Swal.fire('Thông báo', e?.message ? String(e.message) : String(e), 'error');
    } finally {
      setRebuilding(false);
    }
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Paper variant="outlined" sx={{ p: 2, borderColor: '#e5e7eb', bgcolor: '#ffffff' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 16 }}>DB Column Comments</Typography>
            <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
              Cập nhật MS_Description cho từng cột (AI dùng để hiểu schema)
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.25} alignItems="center">
            <Button variant="contained" onClick={rebuildSchemaIndex} disabled={loading || rebuilding}>
              Rebuild schema/index
            </Button>
            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search table/column/comment..."
              size="small"
              sx={{ width: 320 }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                setPage(1);
                fetchData();
              }}
              disabled={loading}
            >
              Search
            </Button>
          </Stack>
        </Stack>

        {loading ? <LinearProgress sx={{ mt: 1.5 }} /> : null}

        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} alignItems="center">
          <Button variant="outlined" disabled={loading || page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Prev
          </Button>
          <Typography sx={{ fontSize: 12, color: '#374151' }}>
            Page {page}/{totalPages} - Total {total}
          </Typography>
          <Button
            variant="outlined"
            disabled={loading || page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>

          <TextField
            label="Page size"
            value={pageSize}
            onChange={(e) => {
              const v = Number(e.target.value || 200);
              if (!Number.isFinite(v) || v <= 0) return;
              setPageSize(Math.min(500, Math.max(1, v)));
              setPage(1);
            }}
            size="small"
            sx={{ width: 120 }}
          />
        </Stack>

        <Box sx={{ mt: 1.5 }}>
          {items.length === 0 && !loading ? <Alert severity="info">Không có dữ liệu</Alert> : null}

          <TableContainer sx={{ maxHeight: 'calc(100vh - 360px)', border: '1px solid #e5e7eb', borderRadius: 1 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Schema</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Table</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Column</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Comment (MS_Description)</TableCell>
                  <TableCell sx={{ fontWeight: 800, width: 120 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((it) => {
                  const key = `${it.schema}.${it.table}.${it.column}`;
                  return (
                    <TableRow key={key} hover>
                      <TableCell>{it.schema}</TableCell>
                      <TableCell>{it.table}</TableCell>
                      <TableCell>{it.column}</TableCell>
                      <TableCell>{it.type}</TableCell>
                      <TableCell>
                        <TextField
                          value={it.description || ''}
                          onChange={(e) => updateDescLocal(key, e.target.value)}
                          fullWidth
                          size="small"
                          multiline
                          minRows={1}
                          maxRows={3}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => saveOne(it)}
                          disabled={savingKey === key || loading}
                        >
                          Save
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default ColumnComments;
