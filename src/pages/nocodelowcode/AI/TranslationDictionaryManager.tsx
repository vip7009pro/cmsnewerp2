import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
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
import {
  TranslationDictionaryEntry,
  TranslationDictionaryFormValue,
  createDictionaryEntryFromForm,
  createEmptyTranslationDictionaryEntry,
  createFormFromDictionaryEntry,
  deleteTranslationDictionaryEntry,
  loadTranslationDictionary,
  replaceTranslationDictionaryEntries,
  upsertTranslationDictionaryEntry,
} from './translationDictionary';

const emptyJson = `{
  "vi": "Diecut sâu",
  "ko": "과타발",
  "en": "Deep Diecut",
  "cn": "深模切"
}`;

const toFormValue = (raw: any): TranslationDictionaryFormValue => {
  const terms = raw?.terms && typeof raw.terms === 'object' ? raw.terms : raw || {};
  const aliases = Array.isArray(raw?.aliases)
    ? raw.aliases.join(', ')
    : typeof raw?.aliases === 'string'
      ? raw.aliases
      : Array.isArray(raw?.user_terms)
        ? raw.user_terms.join(', ')
        : '';

  return {
    id: String(raw?.id || raw?._id || raw?.key || '').trim(),
    vi: String(terms?.vi ?? raw?.vi ?? '').trim(),
    ko: String(terms?.ko ?? raw?.ko ?? '').trim(),
    en: String(terms?.en ?? raw?.en ?? '').trim(),
    cn: String(terms?.cn ?? raw?.cn ?? '').trim(),
    aliases: String(aliases || '').trim(),
    note: String(raw?.note || raw?.description || raw?.desc || '').trim(),
    enabled: raw?.enabled === undefined ? true : Boolean(raw.enabled),
  };
};

const normalizeRawJsonToEntries = (value: any) => {
  const rows = Array.isArray(value)
    ? value
    : Array.isArray(value?.entries)
      ? value.entries
      : Array.isArray(value?.items)
        ? value.items
        : Array.isArray(value?.dictionary)
          ? value.dictionary
          : value && typeof value === 'object'
            ? [value]
            : [];

  return rows.map((row: any) => createDictionaryEntryFromForm(toFormValue(row)));
};

const TranslationDictionaryManager = () => {
  const [entries, setEntries] = useState<TranslationDictionaryEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [form, setForm] = useState<TranslationDictionaryFormValue>(createEmptyTranslationDictionaryEntry());
  const [search, setSearch] = useState<string>('');
  const [jsonText, setJsonText] = useState<string>(emptyJson);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const store = await loadTranslationDictionary({ search, includeDisabled: true });
      setEntries(store.items);
      if (selectedId) {
        const nextSelected = store.items.find((entry) => entry.id === selectedId);
        if (nextSelected) {
          setForm(createFormFromDictionaryEntry(nextSelected));
        }
      }
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, [search, selectedId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEntries();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadEntries]);

  const stats = useMemo(() => {
    const total = entries.length;
    const enabled = entries.filter((entry) => entry.enabled !== false).length;
    return { total, enabled };
  }, [entries]);

  const selectEntry = (entry: TranslationDictionaryEntry) => {
    setSelectedId(entry.id);
    setForm(createFormFromDictionaryEntry(entry));
    setMessage('');
    setError('');
  };

  const clearForm = () => {
    setSelectedId('');
    setForm(createEmptyTranslationDictionaryEntry());
    setMessage('');
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const entry = createDictionaryEntryFromForm(form);
      const result = await upsertTranslationDictionaryEntry(entry);
      setMessage(`Saved dictionary entry. Total: ${result?.count ?? ''}`.trim());
      await loadEntries();
      setSelectedId(entry.id);
      setForm(createFormFromDictionaryEntry(entry));
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const id = selectedId || form.id;
    if (!id) {
      setError('Select an entry to delete first.');
      return;
    }
    if (!window.confirm('Delete this dictionary entry?')) return;

    setSaving(true);
    setMessage('');
    setError('');
    try {
      await deleteTranslationDictionaryEntry(id);
      clearForm();
      await loadEntries();
      setMessage('Dictionary entry deleted.');
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleBulkReplace = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const parsed = JSON.parse(jsonText);
      const normalized = normalizeRawJsonToEntries(parsed);
      if (!normalized.length) {
        throw new Error('JSON does not contain any dictionary entries');
      }
      await replaceTranslationDictionaryEntries(normalized);
      await loadEntries();
      setMessage(`Replaced dictionary with ${normalized.length} entries.`);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleBulkUpsert = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const parsed = JSON.parse(jsonText);
      const normalized = normalizeRawJsonToEntries(parsed);
      if (!normalized.length) {
        throw new Error('JSON does not contain any dictionary entries');
      }
      for (const entry of normalized) {
        await upsertTranslationDictionaryEntry(entry);
      }
      await loadEntries();
      setMessage(`Upserted ${normalized.length} dictionary entries.`);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    const payload = JSON.stringify(entries, null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      setMessage('Dictionary JSON copied to clipboard.');
    } catch {
      setJsonText(payload);
      setMessage('Dictionary JSON loaded into the editor.');
    }
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, minHeight: 'calc(100vh - 190px)' }}>
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(18,24,38,0.95) 0%, rgba(38,56,84,0.95) 100%)',
          color: '#fff',
        }}
      >
        <Stack direction="row" spacing={1.5} flexWrap="wrap" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Translation Dictionary
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Manage a JSON glossary for AI translation prompts. Latest file contents are read from backend on every load.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label={`Entries: ${stats.total}`} sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: '#fff' }} />
            <Chip label={`Enabled: ${stats.enabled}`} sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: '#fff' }} />
          </Stack>
        </Stack>
      </Paper>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {message ? <Alert severity="success">{message}</Alert> : null}

      <Stack direction={{ xs: 'column', xl: 'row' }} spacing={2} sx={{ minHeight: 0 }}>
        <Paper sx={{ flex: 1, p: 2, borderRadius: 3, minWidth: 0 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Dictionary Entries
            </Typography>
            <TextField
              label="Search"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 240 }}
            />
          </Stack>

          <TableContainer sx={{ maxHeight: '58vh', borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={120}>ID</TableCell>
                  <TableCell>Terms</TableCell>
                  <TableCell width={180}>Aliases</TableCell>
                  <TableCell width={160}>Status</TableCell>
                  <TableCell width={120}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.map((entry) => {
                  const termText = ['vi', 'ko', 'en', 'cn']
                    .map((key) => `${key.toUpperCase()}: ${entry.terms?.[key] || ''}`)
                    .join(' | ');
                  return (
                    <TableRow
                      key={entry.id}
                      hover
                      selected={entry.id === selectedId}
                      onClick={() => selectEntry(entry)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                        {entry.id.slice(0, 12)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {termText}
                        </Typography>
                        {entry.note ? (
                          <Typography variant="caption" color="text.secondary">
                            {entry.note}
                          </Typography>
                        ) : null}
                      </TableCell>
                      <TableCell>{entry.aliases?.length ? entry.aliases.join(', ') : '-'}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={entry.enabled === false ? 'Disabled' : 'Enabled'}
                          color={entry.enabled === false ? 'default' : 'success'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="small" onClick={(e) => { e.stopPropagation(); selectEntry(entry); }}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!entries.length && !loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      No dictionary entries found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper sx={{ flex: 1, p: 2, borderRadius: 3, minWidth: 0 }}>
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Entry Editor
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField label="ID" size="small" value={form.id} onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))} fullWidth />
              <TextField
                label="Aliases"
                size="small"
                value={form.aliases}
                onChange={(e) => setForm((prev) => ({ ...prev, aliases: e.target.value }))}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField label="VI" size="small" value={form.vi} onChange={(e) => setForm((prev) => ({ ...prev, vi: e.target.value }))} fullWidth />
              <TextField label="KO" size="small" value={form.ko} onChange={(e) => setForm((prev) => ({ ...prev, ko: e.target.value }))} fullWidth />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField label="EN" size="small" value={form.en} onChange={(e) => setForm((prev) => ({ ...prev, en: e.target.value }))} fullWidth />
              <TextField label="CN" size="small" value={form.cn} onChange={(e) => setForm((prev) => ({ ...prev, cn: e.target.value }))} fullWidth />
            </Stack>

            <TextField
              label="Note"
              size="small"
              value={form.note}
              onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
              multiline
              minRows={3}
              fullWidth
            />

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip
                label={form.enabled ? 'Enabled' : 'Disabled'}
                color={form.enabled ? 'success' : 'default'}
                variant="outlined"
                onClick={() => setForm((prev) => ({ ...prev, enabled: !prev.enabled }))}
              />
              <Typography variant="body2" color="text.secondary">
                Click the chip to toggle active state.
              </Typography>
            </Stack>

            <Divider />

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button variant="contained" onClick={handleSave} disabled={saving}>
                Save
              </Button>
              <Button variant="outlined" onClick={handleDelete} disabled={saving || !selectedId}>
                Delete
              </Button>
              <Button variant="outlined" onClick={clearForm}>
                New Entry
              </Button>
              <Button variant="outlined" onClick={loadEntries} disabled={loading}>
                Reload
              </Button>
            </Stack>

            <Alert severity="info">
              Source/target term pairs are injected into translation prompts only when the document text actually contains one of the glossary terms or aliases.
            </Alert>
          </Stack>
        </Paper>
      </Stack>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" flexWrap="wrap">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              JSON Import / Export
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button variant="outlined" onClick={handleExport}>
                Export current JSON
              </Button>
              <Button variant="outlined" onClick={handleBulkUpsert} disabled={saving}>
                Upsert JSON
              </Button>
              <Button variant="contained" onClick={handleBulkReplace} disabled={saving}>
                Replace all from JSON
              </Button>
            </Stack>
          </Stack>

          <TextField
            label="Paste a single entry object or an array of entries"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            multiline
            minRows={10}
            fullWidth
            sx={{ fontFamily: 'monospace' }}
          />
        </Stack>
      </Paper>
    </Box>
  );
};

export default TranslationDictionaryManager;
