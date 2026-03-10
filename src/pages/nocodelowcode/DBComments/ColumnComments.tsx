import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import * as XLSX from 'xlsx';

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

type TableItem = {
  schema: string;
  table: string;
  description: string;
};

type BulkExcelRow = {
  level: 'TABLE' | 'COLUMN';
  schema: string;
  table: string;
  column: string;
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
  const [tab, setTab] = useState<'columns' | 'tables'>('columns');
  const [tableItems, setTableItems] = useState<TableItem[]>([]);
  const [tableTotal, setTableTotal] = useState<number>(0);
  const [tablePage, setTablePage] = useState<number>(1);
  const [tablePageSize, setTablePageSize] = useState<number>(200);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [tableSavingKey, setTableSavingKey] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const fetchTableData = useCallback(async () => {
    setTableLoading(true);
    try {
      const resp = await generalQuery('get_table_comments', {
        page: tablePage,
        pageSize: tablePageSize,
        search,
      });

      const data = resp?.data;
      if (data?.tk_status?.toUpperCase() !== 'OK') {
        Swal.fire('Thông báo', data?.message ? String(data.message) : 'Load failed', 'error');
        setTableItems([]);
        setTableTotal(0);
        return;
      }

      const out = data?.data;
      setTableItems(Array.isArray(out?.items) ? out.items : []);
      setTableTotal(Number(out?.total || 0));
    } catch (e: any) {
      Swal.fire('Thông báo', e?.message ? String(e.message) : String(e), 'error');
      setTableItems([]);
      setTableTotal(0);
    } finally {
      setTableLoading(false);
    }
  }, [tablePage, tablePageSize, search]);

  useEffect(() => {
    if (tab === 'columns') fetchData();
    else fetchTableData();
  }, [fetchData, fetchTableData, tab]);

  const updateDescLocal = useCallback((key: string, v: string) => {
    setItems((prev) =>
      prev.map((it) => {
        const k = `${it.schema}.${it.table}.${it.column}`;
        if (k !== key) return it;
        return { ...it, description: v };
      }),
    );
  }, []);

  const updateTableDescLocal = useCallback((key: string, v: string) => {
    setTableItems((prev) =>
      prev.map((it) => {
        const k = `${it.schema}.${it.table}`;
        if (k !== key) return it;
        return { ...it, description: v };
      }),
    );
  }, []);

  const saveTableOne = useCallback(async (it: TableItem) => {
    const key = `${it.schema}.${it.table}`;
    setTableSavingKey(key);
    try {
      const resp = await generalQuery('update_table_comment', {
        schema: it.schema,
        table: it.table,
        description: it.description ?? '',
      });
      const data = resp?.data;
      if (data?.tk_status?.toUpperCase() !== 'OK') {
        Swal.fire('Thông báo', data?.message ? String(data.message) : 'Save failed', 'error');
        return;
      }
      Swal.fire('Thông báo', 'Đã lưu comment Table', 'success');
    } catch (e: any) {
      Swal.fire('Thông báo', e?.message ? String(e.message) : String(e), 'error');
    } finally {
      setTableSavingKey('');
    }
  }, []);

  const parseExcelToItems = useCallback(async (file: File) => {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    const wsName = wb.SheetNames?.[0];
    if (!wsName) return [];
    const ws = wb.Sheets[wsName];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' }) as any[];

    const out = [] as Array<{ level: 'TABLE' | 'COLUMN'; schema: string; table: string; column?: string; description: string }>;
    for (const r of rows) {
      const level = String(r.level || r.type || r.LEVEL || r.TYPE || '').trim().toUpperCase();
      const schema = String(r.schema || r.SCHEMA || 'dbo').trim() || 'dbo';
      const table = String(r.table || r.TABLE || '').trim();
      const column = String(r.column || r.COLUMN || '').trim();
      const description = String(r.description || r.DESCRIPTION || '').trim();

      if (!level || !table) continue;
      if (level === 'TABLE') {
        out.push({ level: 'TABLE', schema, table, description });
      } else if (level === 'COLUMN') {
        if (!column) continue;
        out.push({ level: 'COLUMN', schema, table, column, description });
      }
    }
    return out;
  }, []);

  const bulkUploadExcel = useCallback(async (file: File) => {
    try {
      const parsed = await parseExcelToItems(file);
      if (parsed.length === 0) {
        Swal.fire('Thông báo', 'File Excel không có dòng hợp lệ. Cần cột: level/schema/table/column/description', 'warning');
        return;
      }

      const resp = await generalQuery('bulk_upsert_comments', { items: parsed });
      const data = resp?.data;
      if (data?.tk_status?.toUpperCase() !== 'OK') {
        Swal.fire('Thông báo', data?.message ? String(data.message) : 'Bulk update failed', 'error');
        return;
      }

      const ok = data?.data?.ok;
      const ng = data?.data?.ng;
      const ms = data?.data?.ms;
      Swal.fire('Thông báo', `Bulk update xong. OK=${ok ?? ''}, NG=${ng ?? ''} (${ms ?? ''}ms)`, 'success');

      if (tab === 'columns') fetchData();
      else fetchTableData();
    } catch (e: any) {
      Swal.fire('Thông báo', e?.message ? String(e.message) : String(e), 'error');
    }
  }, [fetchData, fetchTableData, parseExcelToItems, tab]);

  const downloadCurrentAsExcelTemplate = useCallback(async () => {
    try {
      const allTables: TableItem[] = [];
      const allColumns: ColumnItem[] = [];

      // Fetch all tables
      let p = 1;
      const ps = 500;
      while (true) {
        const resp = await generalQuery('get_table_comments', {
          page: p,
          pageSize: ps,
          search: '',
        });
        const data = resp?.data;
        if (data?.tk_status?.toUpperCase() !== 'OK') {
          Swal.fire('Thông báo', data?.message ? String(data.message) : 'Load tables failed', 'error');
          return;
        }
        const out = data?.data;
        const items = Array.isArray(out?.items) ? (out.items as TableItem[]) : [];
        allTables.push(...items);
        const total = Number(out?.total || 0);
        if (allTables.length >= total || items.length === 0) break;
        p++;
      }

      // Fetch all columns
      p = 1;
      while (true) {
        const resp = await generalQuery('get_column_comments', {
          page: p,
          pageSize: ps,
          search: '',
        });
        const data = resp?.data;
        if (data?.tk_status?.toUpperCase() !== 'OK') {
          Swal.fire('Thông báo', data?.message ? String(data.message) : 'Load columns failed', 'error');
          return;
        }
        const out = data?.data;
        const items = Array.isArray(out?.items) ? (out.items as ColumnItem[]) : [];
        allColumns.push(...items);
        const total = Number(out?.total || 0);
        if (allColumns.length >= total || items.length === 0) break;
        p++;
      }

      const rows: BulkExcelRow[] = [
        ...allTables.map<BulkExcelRow>((t) => ({
          level: 'TABLE',
          schema: t.schema,
          table: t.table,
          column: '',
          description: t.description || '',
        })),
        ...allColumns.map<BulkExcelRow>((c) => ({
          level: 'COLUMN',
          schema: c.schema,
          table: c.table,
          column: c.column,
          description: c.description || '',
        })),
      ];

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'comments');
      const ts = new Date();
      const stamp = `${ts.getFullYear()}${String(ts.getMonth() + 1).padStart(2, '0')}${String(ts.getDate()).padStart(2, '0')}_${String(ts.getHours()).padStart(2, '0')}${String(ts.getMinutes()).padStart(2, '0')}${String(ts.getSeconds()).padStart(2, '0')}`;
      XLSX.writeFile(wb, `db_comments_template_${stamp}.xlsx`);
    } catch (e: any) {
      Swal.fire('Thông báo', e?.message ? String(e.message) : String(e), 'error');
    }
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
            <Button
              variant={tab === 'columns' ? 'contained' : 'outlined'}
              onClick={() => {
                setTab('columns');
                setPage(1);
              }}
            >
              Columns
            </Button>
            <Button
              variant={tab === 'tables' ? 'contained' : 'outlined'}
              onClick={() => {
                setTab('tables');
                setTablePage(1);
              }}
            >
              Tables
            </Button>
            <Button variant="contained" onClick={rebuildSchemaIndex} disabled={loading || rebuilding}>
              Rebuild schema/index
            </Button>
            <Button variant="outlined" onClick={downloadCurrentAsExcelTemplate}>
              Download Excel (template)
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                await bulkUploadExcel(f);
                e.target.value = '';
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              Upload Excel (bulk)
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
                if (tab === 'columns') {
                  setPage(1);
                  fetchData();
                } else {
                  setTablePage(1);
                  fetchTableData();
                }
              }}
              disabled={tab === 'columns' ? loading : tableLoading}
            >
              Search
            </Button>
          </Stack>
        </Stack>

        {(tab === 'columns' ? loading : tableLoading) ? <LinearProgress sx={{ mt: 1.5 }} /> : null}

        {tab === 'columns' ? (
          <>
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
          </>
        ) : (
          <>
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} alignItems="center">
              <Button variant="outlined" disabled={tableLoading || tablePage <= 1} onClick={() => setTablePage((p) => Math.max(1, p - 1))}>
                Prev
              </Button>
              <Typography sx={{ fontSize: 12, color: '#374151' }}>
                Page {tablePage}/{Math.max(1, Math.ceil(tableTotal / tablePageSize))} - Total {tableTotal}
              </Typography>
              <Button
                variant="outlined"
                disabled={tableLoading || tablePage >= Math.max(1, Math.ceil(tableTotal / tablePageSize))}
                onClick={() => setTablePage((p) => Math.min(Math.max(1, Math.ceil(tableTotal / tablePageSize)), p + 1))}
              >
                Next
              </Button>

              <TextField
                label="Page size"
                value={tablePageSize}
                onChange={(e) => {
                  const v = Number(e.target.value || 200);
                  if (!Number.isFinite(v) || v <= 0) return;
                  setTablePageSize(Math.min(500, Math.max(1, v)));
                  setTablePage(1);
                }}
                size="small"
                sx={{ width: 120 }}
              />
            </Stack>

            <Box sx={{ mt: 1.5 }}>
              {tableItems.length === 0 && !tableLoading ? <Alert severity="info">Không có dữ liệu</Alert> : null}

              <TableContainer sx={{ maxHeight: 'calc(100vh - 360px)', border: '1px solid #e5e7eb', borderRadius: 1 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800 }}>Schema</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Table</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Comment (MS_Description)</TableCell>
                      <TableCell sx={{ fontWeight: 800, width: 120 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableItems.map((it) => {
                      const key = `${it.schema}.${it.table}`;
                      return (
                        <TableRow key={key} hover>
                          <TableCell>{it.schema}</TableCell>
                          <TableCell>{it.table}</TableCell>
                          <TableCell>
                            <TextField
                              value={it.description || ''}
                              onChange={(e) => updateTableDescLocal(key, e.target.value)}
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
                              onClick={() => saveTableOne(it)}
                              disabled={tableSavingKey === key || tableLoading}
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
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ColumnComments;
