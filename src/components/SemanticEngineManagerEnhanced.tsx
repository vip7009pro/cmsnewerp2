/**
 * Semantic Query Engine Manager - Enhanced Version
 * Visual metadata management, DB sync, and alternative training approaches
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Cookies from 'universal-cookie';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Badge,
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Storage as StorageIcon,
  School as SchoolIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import Grid from '@mui/material/GridLegacy';
import { useSelector } from 'react-redux';
import { getSever } from '../api/Api';
import { getV2ApiClient } from '../api/V2Api';
import AGTable from './DataTable/AGTable';

const api = getV2ApiClient();

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function SemanticEngineManager() {
  // Get backend URL from Redux store safely (totalSlice.server_ip) or from API helper
  const totalState = useSelector((state: any) => state.totalSlice || {});
  const serverUrlFromRedux = totalState?.server_ip || '';
  const serverUrlFromApi = getSever() || '';
  const serverUrl = serverUrlFromRedux || serverUrlFromApi || '';
  const apiBaseUrl = serverUrl ? `${serverUrl.replace(/\/$/, '')}/ai` : '/ai';

  const api = getV2ApiClient();

  useEffect(() => {
    console.log('[FRONTEND] Redux totalSlice.server_ip:', serverUrlFromRedux);
    console.log('[FRONTEND] getSever():', serverUrlFromApi);
    console.log('[FRONTEND] computed serverUrl:', serverUrl);
    console.log('[FRONTEND] computed apiBaseUrl:', apiBaseUrl);

    api.setBaseURL(apiBaseUrl);

    const cookies = new Cookies();
    const token = cookies.get('token');
    if (token) {
      api.setAuthToken(token);
      console.log('[FRONTEND] setAuthorization token on V2 API client');
    } else {
      console.warn('[FRONTEND] no token found in cookies for V2 API client');
    }
  }, [serverUrlFromRedux, serverUrlFromApi, apiBaseUrl, api]);

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Metadata state
  const [tables, setTables] = useState<any[]>([]);
  const [relationships, setRelationships] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  // Separate column states for relationship dialog (Bug 3 fix)
  const [fromTableColumns, setFromTableColumns] = useState<any[]>([]);
  const [toTableColumns, setToTableColumns] = useState<any[]>([]);
  const [relColumnsLoading, setRelColumnsLoading] = useState(false);

  // Dialog states
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [columnDialogOpen, setColumnDialogOpen] = useState(false);
  const [relationshipDialogOpen, setRelationshipDialogOpen] = useState(false);
  const [metricDialogOpen, setMetricDialogOpen] = useState(false);
  const [glossaryDialogOpen, setGlossaryDialogOpen] = useState(false);
  const [bulkTableDialogOpen, setBulkTableDialogOpen] = useState(false);
  const [bulkColumnDialogOpen, setBulkColumnDialogOpen] = useState(false);
  const [bulkRelationshipDialogOpen, setBulkRelationshipDialogOpen] = useState(false);

  // Form states - Updated with all metadata fields
  const [tableForm, setTableForm] = useState({
    table_name: '',
    schema: 'dbo',
    business_name: '',
    description: '',
    use_cases: [] as string[],
    synonyms: [] as string[]
  });
  const [columnForm, setColumnForm] = useState({
    table_name: '',
    column_name: '',
    business_name: '',
    description: '',
    data_type: 'VARCHAR',
    example_value: '',
    is_key: false,
    is_searchable: false,
    is_filterable: false,
    synonyms: [] as string[]
  });
  const [relationshipForm, setRelationshipForm] = useState({
    from_table: '',
    from_column: '',
    to_table: '',
    to_column: '',
    type: 'fk',
    cardinality: 'N:1',
    weight: 1,
    description: ''
  });
  const [metricForm, setMetricForm] = useState({
    id: '',
    name: '',
    business_name: '',
    description: '',
    formula: '',
    tables: [] as string[],
    data_type: 'count',
    unit: '',
    related_dimensions: [] as string[],
    conditions: [] as string[],
  });
  const [glossaryForm, setGlossaryForm] = useState({
    id: '',
    user_terms: [] as string[],
    canonical_term: '',
    metric_ids: [] as string[],
    table_names: [] as string[],
    column_names: [] as string[],
    time_filter: '',
    operation: '',
    description: '',
  });
  const [metricTablesInput, setMetricTablesInput] = useState('');
  const [metricRelatedDimensionsInput, setMetricRelatedDimensionsInput] = useState('');
  const [metricConditionsInput, setMetricConditionsInput] = useState('');
  const [glossaryUserTermsInput, setGlossaryUserTermsInput] = useState('');
  const [glossaryMetricIdsInput, setGlossaryMetricIdsInput] = useState('');
  const [glossaryTableNamesInput, setGlossaryTableNamesInput] = useState('');
  const [glossaryColumnNamesInput, setGlossaryColumnNamesInput] = useState('');

  // Bulk import states
  const [bulkTableJson, setBulkTableJson] = useState('');
  const [bulkColumnJson, setBulkColumnJson] = useState('');
  const [bulkRelationshipJson, setBulkRelationshipJson] = useState('');
  const [relatedColumns, setRelatedColumns] = useState<any[]>([]);

  // Training state
  const [metricsMetadata, setMetricsMetadata] = useState<any[]>([]);
  const [glossaryMetadata, setGlossaryMetadata] = useState<any[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const [selectedGlossary, setSelectedGlossary] = useState<any>(null);
  const [syncReport, setSyncReport] = useState<any>(null);
  const [forceSyncOverwrite, setForceSyncOverwrite] = useState(false);

  // Load initial data
  useEffect(() => {
    loadMetadata();
    loadTrainingData();
  }, []);

  const loadMetadata = async () => {
    try {
      setLoading(true);
      console.log('[FRONTEND] Loading metadata...');
      console.log('[FRONTEND] API baseURL:', api.baseURL);

      const [tablesRes, relationshipsRes] = await Promise.all([
        api.getAllTables(),
        api.getRelationships(),
      ]);

      console.log('[FRONTEND] Tables response:', tablesRes);
      console.log('[FRONTEND] Relationships response:', relationshipsRes);

      if (tablesRes.tk_status === 'OK') {
        setTables(tablesRes.data?.tables || []);
      }
      if (relationshipsRes.tk_status === 'OK') {
        setRelationships(relationshipsRes.data?.relationships || []);
      }
    } catch (error) {
      console.error('[FRONTEND] Failed to load metadata:', error);
      showMessage('error', 'Failed to load metadata');
    } finally {
      setLoading(false);
    }
  };

  const loadTrainingData = async () => {
    try {
      console.log('[FRONTEND] Loading training data...');
      const [metricsRes, glossaryRes] = await Promise.all([
        api.getMetricsMetadata(),
        api.getGlossaryMetadata(),
      ]);
      if (metricsRes.tk_status === 'OK') {
        setMetricsMetadata(metricsRes.data?.metrics || []);
      }
      if (glossaryRes.tk_status === 'OK') {
        setGlossaryMetadata(glossaryRes.data?.glossary || []);
      }
    } catch (error) {
      console.error('Failed to load training data', error);
    }
  };

  const parseCsv = (value: string): string[] =>
    value.split(',').map((s) => s.trim()).filter(Boolean);

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // ==================== METADATA MANAGEMENT ====================

  const handleSyncFromDB = async () => {
    try {
      setLoading(true);
      console.log('[FRONTEND] Calling syncMetadataFromDB... (forceSync:', forceSyncOverwrite, ')');
      console.log('[FRONTEND] API baseURL:', api.baseURL);
      console.log('[FRONTEND] Full sync URL:', `${api.baseURL}/v2/metadata/sync?forceSync=${forceSyncOverwrite}`);

      const res = await api.syncMetadataFromDB(forceSyncOverwrite);

      console.log('[FRONTEND] Sync response:', res);

      if (res.tk_status === 'OK') {
        setSyncReport(res.data?.syncReport);
        loadMetadata();
        showMessage('success', forceSyncOverwrite ? 'Metadata overwritten from database' : 'Metadata synced successfully from database');
        console.log('[FRONTEND] Sync successful:', res.data?.syncReport);
      } else {
        console.error('[FRONTEND] Sync failed:', res.error);
        showMessage('error', res.error?.message || 'Sync failed');
      }
    } catch (error) {
      console.error('[FRONTEND] Sync error:', error);
      showMessage('error', 'Error syncing from database');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear embedding cache to invalidate cached embeddings
   * Called after metadata changes to ensure semantic search uses updated embeddings
   */
  const handleClearEmbeddingCache = async () => {
    try {
      setLoading(true);
      console.log('[FRONTEND] Clearing embedding cache...');

      const res = await api.clearEmbeddingCache();

      console.log('[FRONTEND] Clear cache response:', res);

      if (res.tk_status === 'OK') {
        showMessage('success', 'Embedding cache cleared successfully');
        console.log('[FRONTEND] Cache cleared:', res.data);
      } else {
        console.error('[FRONTEND] Clear cache failed:', res.error);
        showMessage('error', res.error?.message || 'Failed to clear cache');
      }
    } catch (error) {
      console.error('[FRONTEND] Clear cache error:', error);
      showMessage('error', 'Error clearing embedding cache');
    } finally {
      setLoading(false);
    }
  };

  // Effect: Load columns when selectedTable changes (avoiding flickering)
  // AbortController prevents duplicate calls in React 18 StrictMode (double-invoke)
  useEffect(() => {
    if (!selectedTable) return;
    let cancelled = false;
    loadTableColumnsData(selectedTable, () => cancelled);
    return () => { cancelled = true; };
  }, [selectedTable]);

  const loadTableColumnsData = async (tableName: string, isCancelled?: () => boolean) => {
    try {
      const res = await api.getTableColumns(tableName);
      if (isCancelled && isCancelled()) return; // StrictMode double-invoke guard
      if (res.tk_status === 'OK') {
        const rawCols: any[] = res.data?.columns || [];
        // Dedup guard: ensure no duplicate column_name rows from server
        const seen = new Set<string>();
        const uniqueCols = rawCols.filter(c => {
          const key = String(c.column_name || '').toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setTableColumns(uniqueCols);
      }
    } catch (error) {
      if (isCancelled && isCancelled()) return;
      showMessage('error', 'Failed to load columns');
    }
  };

  // Load columns for the "from table" picker in the Relationship dialog (Bug 3)
  const loadFromTableColumns = useCallback(async (tableName: string) => {
    if (!tableName) { setFromTableColumns([]); return; }
    try {
      setRelColumnsLoading(true);
      const res = await api.getTableColumns(tableName);
      if (res.tk_status === 'OK') setFromTableColumns(res.data?.columns || []);
    } catch { setFromTableColumns([]); } finally { setRelColumnsLoading(false); }
  }, [api]);

  // Load columns for the "to table" picker in the Relationship dialog (Bug 3)
  const loadToTableColumns = useCallback(async (tableName: string) => {
    if (!tableName) { setToTableColumns([]); return; }
    try {
      setRelColumnsLoading(true);
      const res = await api.getTableColumns(tableName);
      if (res.tk_status === 'OK') setToTableColumns(res.data?.columns || []);
    } catch { setToTableColumns([]); } finally { setRelColumnsLoading(false); }
  }, [api]);

  const handleLoadTableColumns = useCallback((tableName: string) => {
    setSelectedTable(tableName);
  }, []);

  const handleSaveTable = async () => {
    try {
      setLoading(true);
      // Clean up use_cases and synonyms before saving
      const cleanedTableForm = {
        ...tableForm,
        use_cases: (tableForm.use_cases || []).filter(s => s.trim()),
        synonyms: (tableForm.synonyms || []).filter(s => s.trim()),
      };
      
      const res = await api.saveTableMetadata(cleanedTableForm);

      if (res.tk_status === 'OK') {
        showMessage('success', 'Table metadata saved successfully');
        setTableDialogOpen(false);
        setTableForm({
          table_name: '',
          schema: 'dbo',
          business_name: '',
          description: '',
          use_cases: [],
          synonyms: []
        });
        loadMetadata();
      } else {
        showMessage('error', res.error?.message || 'Failed to save table');
      }
    } catch (error) {
      showMessage('error', 'Error saving table');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveColumn = async () => {
    try {
      setLoading(true);
      const res = await api.saveColumnMetadata(columnForm);

      if (res.tk_status === 'OK') {
        showMessage('success', 'Column metadata saved successfully');
        setColumnDialogOpen(false);
        setColumnForm({
          table_name: '',
          column_name: '',
          business_name: '',
          description: '',
          data_type: 'VARCHAR',
          example_value: '',
          is_key: false,
          is_searchable: false,
          is_filterable: false,
          synonyms: []
        });
        if (selectedTable) {
          handleLoadTableColumns(selectedTable);
        }
      } else {
        showMessage('error', res.error?.message || 'Failed to save column');
      }
    } catch (error) {
      showMessage('error', 'Error saving column');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRelationship = async () => {
    try {
      setLoading(true);
      const res = await api.saveRelationship(relationshipForm);

      if (res.tk_status === 'OK') {
        showMessage('success', 'Relationship saved successfully');
        setRelationshipDialogOpen(false);
        setRelationshipForm({
          from_table: '',
          from_column: '',
          to_table: '',
          to_column: '',
          type: 'fk',
          cardinality: 'N:1',
          weight: 1,
          description: ''
        });
        loadMetadata();
      } else {
        showMessage('error', res.error?.message || 'Failed to save relationship');
      }
    } catch (error) {
      showMessage('error', 'Error saving relationship');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTable = async () => {
    const tableName = (tableForm.table_name || '').trim();
    if (!tableName) return;
    if (!window.confirm(`Delete table metadata "${tableName}"? This also removes related columns and relationships.`)) {
      return;
    }

    try {
      setLoading(true);
      const res = await api.deleteTableMetadata(tableName);
      if (res.tk_status === 'OK') {
        showMessage('success', 'Table metadata deleted successfully. Embedding cache regenerated.');
        setTableDialogOpen(false);
        if (selectedTable === tableName) {
          setSelectedTable('');
          setTableColumns([]);
        }
        setTableForm({
          table_name: '',
          schema: 'dbo',
          business_name: '',
          description: '',
          use_cases: [],
          synonyms: []
        });
        await loadMetadata();
      } else {
        showMessage('error', res.error?.message || 'Failed to delete table metadata');
      }
    } catch (error) {
      showMessage('error', 'Error deleting table metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteColumn = async () => {
    const tableName = (columnForm.table_name || selectedTable || '').trim();
    const columnName = (columnForm.column_name || '').trim();
    if (!tableName || !columnName) return;
    if (!window.confirm(`Delete column metadata "${tableName}.${columnName}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const res = await api.deleteColumnMetadata(tableName, columnName);
      if (res.tk_status === 'OK') {
        showMessage('success', 'Column metadata deleted successfully. Embedding cache regenerated.');
        setColumnDialogOpen(false);
        setColumnForm({
          table_name: '',
          column_name: '',
          business_name: '',
          description: '',
          data_type: 'VARCHAR',
          example_value: '',
          is_key: false,
          is_searchable: false,
          is_filterable: false,
          synonyms: []
        });
        if (selectedTable) {
          await loadTableColumnsData(selectedTable);
        }
      } else {
        showMessage('error', res.error?.message || 'Failed to delete column metadata');
      }
    } catch (error) {
      showMessage('error', 'Error deleting column metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRelationship = async () => {
    const fromTable = (relationshipForm.from_table || '').trim();
    const fromColumn = (relationshipForm.from_column || '').trim();
    const toTable = (relationshipForm.to_table || '').trim();
    const toColumn = (relationshipForm.to_column || '').trim();

    if (!fromTable || !fromColumn || !toTable || !toColumn) return;
    if (!window.confirm(`Delete relationship "${fromTable}.${fromColumn} -> ${toTable}.${toColumn}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const res = await api.deleteRelationshipMetadata(fromTable, fromColumn, toTable, toColumn);
      if (res.tk_status === 'OK') {
        showMessage('success', 'Relationship metadata deleted successfully. Embedding cache regenerated.');
        setRelationshipDialogOpen(false);
        setRelationshipForm({
          from_table: '',
          from_column: '',
          to_table: '',
          to_column: '',
          type: 'fk',
          cardinality: 'N:1',
          weight: 1,
          description: ''
        });
        await loadMetadata();
      } else {
        showMessage('error', res.error?.message || 'Failed to delete relationship metadata');
      }
    } catch (error) {
      showMessage('error', 'Error deleting relationship metadata');
    } finally {
      setLoading(false);
    }
  };

  // ==================== BUSINESS TRAINING ====================

  const handleSaveMetric = async () => {
    try {
      setLoading(true);
      const payload = {
        ...metricForm,
        tables: parseCsv(metricTablesInput),
        related_dimensions: parseCsv(metricRelatedDimensionsInput),
        conditions: parseCsv(metricConditionsInput),
      };
      const res = await api.saveMetricMetadata(payload);
      if (res.tk_status === 'OK') {
        showMessage('success', 'Metric metadata saved. Embedding cache regenerated.');
        setMetricDialogOpen(false);
        setMetricForm({
          id: '',
          name: '',
          business_name: '',
          description: '',
          formula: '',
          tables: [],
          data_type: 'count',
          unit: '',
          related_dimensions: [],
          conditions: [],
        });
        setMetricTablesInput('');
        setMetricRelatedDimensionsInput('');
        setMetricConditionsInput('');
        setSelectedMetric(null);
        await loadTrainingData();
      } else {
        showMessage('error', res.error?.message || 'Failed to save metric metadata');
      }
    } catch (error) {
      showMessage('error', 'Error saving metric metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMetric = async (metricId?: string) => {
    const id = (metricId || metricForm.id || '').trim();
    if (!id) return;
    if (!window.confirm(`Delete metric metadata "${id}"?`)) return;

    try {
      setLoading(true);
      const res = await api.deleteMetricMetadata(id);
      if (res.tk_status === 'OK') {
        showMessage('success', 'Metric metadata deleted. Embedding cache regenerated.');
        setMetricDialogOpen(false);
        setMetricForm({
          id: '',
          name: '',
          business_name: '',
          description: '',
          formula: '',
          tables: [],
          data_type: 'count',
          unit: '',
          related_dimensions: [],
          conditions: [],
        });
        setMetricTablesInput('');
        setMetricRelatedDimensionsInput('');
        setMetricConditionsInput('');
        setSelectedMetric(null);
        await loadTrainingData();
      } else {
        showMessage('error', res.error?.message || 'Failed to delete metric metadata');
      }
    } catch (error) {
      showMessage('error', 'Error deleting metric metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGlossary = async () => {
    try {
      setLoading(true);
      const payload = {
        ...glossaryForm,
        user_terms: parseCsv(glossaryUserTermsInput),
        metric_ids: parseCsv(glossaryMetricIdsInput),
        table_names: parseCsv(glossaryTableNamesInput),
        column_names: parseCsv(glossaryColumnNamesInput),
      };
      const res = await api.saveGlossaryEntry(payload);
      if (res.tk_status === 'OK') {
        showMessage('success', 'Glossary entry saved. Cache refreshed.');
        setGlossaryDialogOpen(false);
        setGlossaryForm({
          id: '',
          user_terms: [],
          canonical_term: '',
          metric_ids: [],
          table_names: [],
          column_names: [],
          time_filter: '',
          operation: '',
          description: '',
        });
        setGlossaryUserTermsInput('');
        setGlossaryMetricIdsInput('');
        setGlossaryTableNamesInput('');
        setGlossaryColumnNamesInput('');
        setSelectedGlossary(null);
        await loadTrainingData();
      } else {
        showMessage('error', res.error?.message || 'Failed to save glossary metadata');
      }
    } catch (error) {
      showMessage('error', 'Error saving glossary metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGlossary = async (entryId?: string) => {
    const id = (entryId || glossaryForm.id || '').trim();
    if (!id) return;
    if (!window.confirm(`Delete glossary entry "${id}"?`)) return;

    try {
      setLoading(true);
      const res = await api.deleteGlossaryEntry(id);
      if (res.tk_status === 'OK') {
        showMessage('success', 'Glossary entry deleted. Cache refreshed.');
        setGlossaryDialogOpen(false);
        setGlossaryForm({
          id: '',
          user_terms: [],
          canonical_term: '',
          metric_ids: [],
          table_names: [],
          column_names: [],
          time_filter: '',
          operation: '',
          description: '',
        });
        setGlossaryUserTermsInput('');
        setGlossaryMetricIdsInput('');
        setGlossaryTableNamesInput('');
        setGlossaryColumnNamesInput('');
        setSelectedGlossary(null);
        await loadTrainingData();
      } else {
        showMessage('error', res.error?.message || 'Failed to delete glossary metadata');
      }
    } catch (error) {
      showMessage('error', 'Error deleting glossary metadata');
    } finally {
      setLoading(false);
    }
  };

  const isEditingTable = !!tableForm.table_name && tables.some(
    (t) => String(t.table_name || '').toLowerCase() === String(tableForm.table_name || '').toLowerCase(),
  );

  const isEditingColumn = !!columnForm.table_name && !!columnForm.column_name && tableColumns.some(
    (c) => String(c.column_name || '').toLowerCase() === String(columnForm.column_name || '').toLowerCase(),
  );

  const isEditingRelationship = !!relationshipForm.from_table && !!relationshipForm.from_column
    && !!relationshipForm.to_table && !!relationshipForm.to_column;

  const isEditingMetric = !!metricForm.id && metricsMetadata.some(
    (m) => String(m.id || '').toLowerCase() === String(metricForm.id || '').toLowerCase(),
  );

  const isEditingGlossary = !!glossaryForm.id && glossaryMetadata.some(
    (g) => String(g.id || '').toLowerCase() === String(glossaryForm.id || '').toLowerCase(),
  );

  // ==================== BULK IMPORT HANDLERS ====================

  const handleBulkImportTables = async () => {
    try {
      setLoading(true);
      const jsonData = JSON.parse(bulkTableJson);
      const tablesToImport = Array.isArray(jsonData) ? jsonData : (jsonData.tables || []);

      // Call API for each table
      for (const table of tablesToImport) {
        await api.saveTableMetadata(table);
      }

      showMessage('success', `Successfully imported ${tablesToImport.length} tables`);
      setBulkTableDialogOpen(false);
      setBulkTableJson('');
      loadMetadata();
    } catch (error: any) {
      console.error('Bulk import error:', error);
      showMessage('error', `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImportColumns = async () => {
    try {
      setLoading(true);
      const jsonData = JSON.parse(bulkColumnJson);
      const columnsToImport = Array.isArray(jsonData) ? jsonData : (jsonData.columns || []);

      for (const col of columnsToImport) {
        await api.saveColumnMetadata(col);
      }

      showMessage('success', `Successfully imported ${columnsToImport.length} columns`);
      setBulkColumnDialogOpen(false);
      setBulkColumnJson('');
      if (selectedTable) {
        await loadTableColumnsData(selectedTable);
      }
    } catch (error: any) {
      console.error('Bulk import error:', error);
      showMessage('error', `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImportRelationships = async () => {
    try {
      setLoading(true);
      const jsonData = JSON.parse(bulkRelationshipJson);
      const relationshipsToImport = Array.isArray(jsonData) ? jsonData : (jsonData.relationships || []);

      for (const rel of relationshipsToImport) {
        await api.saveRelationship(rel);
      }

      showMessage('success', `Successfully imported ${relationshipsToImport.length} relationships`);
      setBulkRelationshipDialogOpen(false);
      setBulkRelationshipJson('');
      loadMetadata();
    } catch (error: any) {
      console.error('Bulk import error:', error);
      showMessage('error', `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Memoized stable props for Tables AGTable to prevent column-width reset
  // Bug 1: if we pass inline data/columns (new refs each render) AG-Grid resets
  // ─────────────────────────────────────────────────────────────────────────
  const tablesAGData = useMemo(
    () =>
      tables.map((table) => ({
        id: table.table_name,
        table_name: table.table_name,
        schema: table.schema || 'dbo',
        business_name: table.business_name || '',
        description: (table.description || '').substring(0, 35) + '...',
        use_cases: table.use_cases?.length || 0,
      })),
    [tables],
  );

  const tablesAGColumns = useMemo(
    () => [
      { field: 'table_name', headerName: 'Table', width: 110, minWidth: 110 },
      { field: 'schema', headerName: 'Schema', width: 75, minWidth: 75 },
      { field: 'business_name', headerName: 'Business Name', width: 120, minWidth: 120 },
      { field: 'description', headerName: 'Description', width: 130, minWidth: 130 },
      { field: 'use_cases', headerName: 'Uses', width: 50, minWidth: 50 },
    ],
    [],
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Memoized stable props for Columns AGTable to prevent column-width reset
  // ─────────────────────────────────────────────────────────────────────────
  const columnsAGData = useMemo(
    () =>
      tableColumns.map((col) => ({
        id: `${selectedTable}_${col.column_name}`,
        table_name: selectedTable,
        column_name: col.column_name,
        business_name: col.business_name || col.column_name,
        data_type: col.data_type,
        example_value: col.example_value || '',
        is_key: col.is_key ? 'Yes' : 'No',
        is_searchable: col.is_searchable ? 'Yes' : 'No',
        is_filterable: col.is_filterable ? 'Yes' : 'No',
      })),
    [tableColumns, selectedTable],
  );

  const columnsAGColumns = useMemo(
    () => [
      { field: 'table_name', headerName: 'Table', width: 90, minWidth: 90 },
      { field: 'column_name', headerName: 'Column', width: 100, minWidth: 100 },
      { field: 'business_name', headerName: 'Business Name', width: 120, minWidth: 120 },
      { field: 'data_type', headerName: 'Type', width: 75, minWidth: 75 },
      { field: 'example_value', headerName: 'Example', width: 90, minWidth: 90 },
      { field: 'is_key', headerName: 'Key', width: 50, minWidth: 50 },
      { field: 'is_searchable', headerName: 'Search', width: 65, minWidth: 65 },
      { field: 'is_filterable', headerName: 'Filter', width: 65, minWidth: 65 },
    ],
    [],
  );
  // ─────────────────────────────────────────────────────────────────────────
  // Memoized stable props for Relationships AGTable.
  // Normalizes BOTH schema variants (from_table vs source_table) so IDs are
  // always valid, and adds an index fallback to guarantee uniqueness even if
  // table/column names are empty.
  // ─────────────────────────────────────────────────────────────────────────
  const relationshipsAGData = useMemo(
    () =>
      relationships.map((rel, idx) => {
        const fromTable  = rel.from_table  || rel.source_table  || '';
        const fromColumn = rel.from_column || rel.source_column || '';
        const toTable    = rel.to_table    || rel.target_table  || '';
        const toColumn   = rel.to_column   || rel.target_column || '';
        // Include index to guarantee uniqueness even if some fields are empty
        const id = `${fromTable}_${fromColumn}_to_${toTable}_${toColumn}_${idx}`;
        return {
          id,
          from_table:  fromTable,
          from_column: fromColumn,
          to_table:    toTable,
          to_column:   toColumn,
          type:        rel.type || (rel.created_from_db_sync ? 'fk' : 'business'),
          cardinality: rel.cardinality || 'N:1',
          weight:      rel.weight ?? 1,
        };
      }),
    [relationships],
  );

  const relationshipsAGColumns = useMemo(
    () => [
      { field: 'from_table',  headerName: 'From Table',  width: 110, minWidth: 80 },
      { field: 'from_column', headerName: 'From Column', width: 100, minWidth: 80 },
      { field: 'to_table',    headerName: 'To Table',    width: 110, minWidth: 80 },
      { field: 'to_column',   headerName: 'To Column',   width: 100, minWidth: 80 },
      { field: 'type',        headerName: 'Type',        width: 65,  minWidth: 55 },
      { field: 'cardinality', headerName: 'Card',        width: 60,  minWidth: 50 },
      { field: 'weight',      headerName: 'W',           width: 45,  minWidth: 40 },
    ],
    [],
  );

  return (
    <Container maxWidth="xl" sx={{ py: 1.5 }}>
      {message && <Alert severity={message.type} sx={{ mb: 1 }}>{message.text}</Alert>}

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Tab icon={<StorageIcon />} iconPosition="start" label="Metadata Management" sx={{ fontSize: '0.85rem' }} />
        <Tab icon={<SchoolIcon />} iconPosition="start" label="Business Training" sx={{ fontSize: '0.85rem' }} />
        <Tab icon={<InfoIcon />} iconPosition="start" label="Debug Info" sx={{ fontSize: '0.85rem' }} />
      </Tabs>

      {/* ==================== METADATA MANAGEMENT TAB ==================== */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'grid', gap: 1 }}>
          {/* DB Sync Section */}
          <Box>
            <Card sx={{ mb: 1 }}>
              <CardContent sx={{ pb: 1, pt: 1.5, px: 2, '&:last-child': { pb: 1 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">Database Synchronization</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={forceSyncOverwrite}
                          onChange={(e) => setForceSyncOverwrite(e.target.checked)}
                          color="warning"
                          size="small"
                        />
                      }
                      label={<Typography variant="caption">Force Overwrite</Typography>}
                      title="Check to overwrite existing metadata"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={handleSyncFromDB}
                      disabled={loading}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      Sync DB
                    </Button>
                  </Box>
                </Box>

                {syncReport && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 1, display: 'grid' }}>
                      <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#e3f2fd', fontSize: '0.85rem' }}>
                        <Typography variant="body2">{syncReport.tables.total}</Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Tables (+{syncReport.tables.new_added})</Typography>
                      </Paper>
                      <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#f3e5f5', fontSize: '0.85rem' }}>
                        <Typography variant="body2">{syncReport.columns.total}</Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Columns (+{syncReport.columns.new_added})</Typography>
                      </Paper>
                      <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#e8f5e9', fontSize: '0.85rem' }}>
                        <Typography variant="body2">{syncReport.relationships.total}</Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Relations (+{syncReport.relationships.new_added})</Typography>
                      </Paper>
                      <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#fff3e0', fontSize: '0.85rem' }}>
                        <Typography variant="body2">{syncReport.duration_ms}ms</Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Duration</Typography>
                      </Paper>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Embedding Cache Management */}
          <Box>
            <Card sx={{ mb: 1 }}>
              <CardContent sx={{ pb: 1, pt: 1.5, px: 2, '&:last-child': { pb: 1 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle2">Embedding Cache</Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#6b7280' }}>
                      Clear cached embeddings when metadata changes to ensure semantic search accuracy
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={handleClearEmbeddingCache}
                    disabled={loading}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Clear Cache
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Tables Management */}
          <Box>
            <Card sx={{ mb: 1 }}>
              <CardContent sx={{ pb: 1, pt: 1.5, px: 2, '&:last-child': { pb: 1 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">Tables ({tables.length})</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setBulkTableDialogOpen(true)}
                      sx={{ fontSize: '0.75rem', py: 0.5 }}
                    >
                      Bulk Import
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setTableDialogOpen(true)}
                      sx={{ fontSize: '0.75rem', py: 0.5 }}
                    >
                      Add Table
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ height: '280px', width: '100%' }}>
                  <AGTable
                    data={tablesAGData}
                    columns={tablesAGColumns}
                    columnWidth={110}
                    rowHeight={24}
                    showFilter={true}
                    onSelectionChange={() => { }}
                    onRowClick={(e: any) => {
                      handleLoadTableColumns(e.data?.table_name);
                    }}
                    onRowDoubleClick={(e: any) => {
                      const table = tables.find(t => t.table_name === e.data?.table_name);
                      if (table) {
                        setTableForm({
                          table_name: table.table_name,
                          schema: table.schema || 'dbo',
                          business_name: table.business_name || '',
                          description: table.description || '',
                          use_cases: table.use_cases || [],
                          synonyms: table.synonyms || []
                        });
                        setTableDialogOpen(true);
                      }
                    }}
                    suppressRowClickSelection={true}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Columns for Selected Table */}
          {selectedTable && (
            <Box>
              <Card sx={{ mb: 1 }}>
                <CardContent sx={{ pb: 1, pt: 1.5, px: 2, '&:last-child': { pb: 1 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">
                      Columns in <strong>{selectedTable}</strong> ({tableColumns.length})
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setBulkColumnDialogOpen(true)}
                        sx={{ fontSize: '0.75rem', py: 0.5 }}
                      >
                        Bulk Import
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setColumnForm({ ...columnForm, table_name: selectedTable });
                          setColumnDialogOpen(true);
                        }}
                        sx={{ fontSize: '0.75rem', py: 0.5 }}
                      >
                        Add Column
                      </Button>
                    </Box>
                  </Box>

                  <Box sx={{ height: '280px', width: '100%' }}>
                    <AGTable
                      data={columnsAGData}
                      columns={columnsAGColumns}
                      columnWidth={95}
                      rowHeight={24}
                      showFilter={true}
                      onSelectionChange={() => { }}
                      onRowDoubleClick={(e: any) => {
                        const colData = tableColumns.find(
                          (col) => col.column_name === e.data?.column_name
                        );
                        if (colData) {
                          setColumnForm(colData);
                          setColumnDialogOpen(true);
                        }
                      }}
                      suppressRowClickSelection={true}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Relationships */}
          <Box>
            <Card sx={{ mb: 1 }}>
              <CardContent sx={{ pb: 1, pt: 1.5, px: 2, '&:last-child': { pb: 1 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">Relationships ({relationships.length})</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setBulkRelationshipDialogOpen(true)}
                      sx={{ fontSize: '0.75rem', py: 0.5 }}
                    >
                      Bulk Import
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setRelationshipDialogOpen(true)}
                      sx={{ fontSize: '0.75rem', py: 0.5 }}
                    >
                      Add Relationship
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ height: '300px', width: '100%' }}>
                  <AGTable
                    data={relationshipsAGData}
                    columns={relationshipsAGColumns}
                    columnWidth={95}
                    rowHeight={22}
                    showFilter={true}
                    onSelectionChange={() => { }}
                    onRowDoubleClick={(e: any) => {
                      // Find original rel matching the normalised row id
                      const idx = Number(String(e.data?.id || '').split('_').pop());
                      const relData = relationships[idx];
                      if (relData) {
                        setRelatedColumns([]);
                        setRelationshipForm({
                          from_table:  relData.from_table  || relData.source_table  || '',
                          from_column: relData.from_column || relData.source_column || '',
                          to_table:    relData.to_table    || relData.target_table  || '',
                          to_column:   relData.to_column   || relData.target_column || '',
                          type:        relData.type || 'fk',
                          cardinality: relData.cardinality || 'N:1',
                          weight:      relData.weight || 1,
                          description: relData.description || relData.business_meaning || '',
                        });
                        setRelationshipDialogOpen(true);
                      }
                    }}
                    suppressRowClickSelection={true}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Table Dialog */}
        <Dialog open={tableDialogOpen} onClose={() => setTableDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1, fontSize: '1rem' }}>Edit Table Metadata</DialogTitle>
          <DialogContent sx={{ pt: 1, maxHeight: '400px', overflow: 'auto' }}>
            <TextField
              fullWidth
              label="Table Name"
              value={tableForm.table_name}
              onChange={(e) => setTableForm({ ...tableForm, table_name: e.target.value })}
              disabled={!!tableForm.table_name && tables.some(t => t.table_name === tableForm.table_name)}
              margin="dense"
              size="small"
            />
            <TextField
              fullWidth
              label="Schema"
              value={tableForm.schema}
              onChange={(e) => setTableForm({ ...tableForm, schema: e.target.value })}
              margin="dense"
              size="small"
              placeholder="dbo"
            />
            <TextField
              fullWidth
              label="Business Name"
              value={tableForm.business_name}
              onChange={(e) => setTableForm({ ...tableForm, business_name: e.target.value })}
              margin="dense"
              size="small"
            />
            <TextField
              fullWidth
              label="Description"
              value={tableForm.description}
              onChange={(e) => setTableForm({ ...tableForm, description: e.target.value })}
              multiline
              rows={2}
              margin="dense"
              size="small"
            />
            <TextField
              fullWidth
              label="Synonyms (comma-separated)"
              value={Array.isArray(tableForm.synonyms) ? tableForm.synonyms.join(', ') : tableForm.synonyms}
              onChange={(e) => setTableForm({ ...tableForm, synonyms: e.target.value.split(',').map(s => s.trim()) })}
              margin="dense"
              size="small"
            />
            <TextField
              fullWidth
              label="Use Cases (one per line)"
              value={Array.isArray(tableForm.use_cases) ? tableForm.use_cases.join('\n') : ''}
              onChange={(e) => setTableForm({ ...tableForm, use_cases: e.target.value.split('\n') })}
              multiline
              rows={3}
              margin="dense"
              size="small"
            />
          </DialogContent>
          <DialogActions sx={{ pt: 1, pb: 1 }}>
            {isEditingTable && (
              <Button onClick={handleDeleteTable} color="error" size="small" disabled={loading}>
                Delete
              </Button>
            )}
            <Button onClick={() => setTableDialogOpen(false)} size="small">Cancel</Button>
            <Button onClick={handleSaveTable} variant="contained" size="small" disabled={loading || !tableForm.table_name}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Column Dialog */}
        <Dialog open={columnDialogOpen} onClose={() => setColumnDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1, fontSize: '1rem' }}>Edit Column Metadata</DialogTitle>
          <DialogContent sx={{ pt: 1, maxHeight: '400px', overflow: 'auto' }}>
            <TextField fullWidth label="Table Name" value={columnForm.table_name} disabled margin="dense" size="small" />
            <TextField
              fullWidth
              label="Column Name"
              value={columnForm.column_name}
              onChange={(e) => setColumnForm({ ...columnForm, column_name: e.target.value })}
              margin="dense"
              size="small"
            />
            <TextField
              fullWidth
              label="Business Name"
              value={columnForm.business_name}
              onChange={(e) => setColumnForm({ ...columnForm, business_name: e.target.value })}
              margin="dense"
              size="small"
            />
            <TextField
              fullWidth
              label="Description"
              value={columnForm.description}
              onChange={(e) => setColumnForm({ ...columnForm, description: e.target.value })}
              multiline
              rows={2}
              margin="dense"
              size="small"
            />
            <FormControl fullWidth margin="dense" size="small">
              <InputLabel>Data Type</InputLabel>
              <Select
                value={String(columnForm.data_type || '').toUpperCase()}
                label="Data Type"
                onChange={(e) => setColumnForm({ ...columnForm, data_type: e.target.value })}
              >
                {[
                  'INT', 'BIGINT', 'SMALLINT', 'TINYINT', 'BIT', 'DECIMAL', 'NUMERIC', 
                  'FLOAT', 'REAL', 'MONEY', 'SMALLMONEY', 'DATE', 'DATETIME', 'DATETIME2', 
                  'SMALLDATETIME', 'TIME', 'VARCHAR', 'NVARCHAR', 'CHAR', 'NCHAR', 
                  'TEXT', 'NTEXT', 'BINARY', 'VARBINARY', 'UNIQUEIDENTIFIER', 'XML'
                ].map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
                {columnForm.data_type && ![
                  'INT', 'BIGINT', 'SMALLINT', 'TINYINT', 'BIT', 'DECIMAL', 'NUMERIC', 
                  'FLOAT', 'REAL', 'MONEY', 'SMALLMONEY', 'DATE', 'DATETIME', 'DATETIME2', 
                  'SMALLDATETIME', 'TIME', 'VARCHAR', 'NVARCHAR', 'CHAR', 'NCHAR', 
                  'TEXT', 'NTEXT', 'BINARY', 'VARBINARY', 'UNIQUEIDENTIFIER', 'XML'
                ].includes(columnForm.data_type.toUpperCase()) && (
                  <MenuItem value={columnForm.data_type.toUpperCase()}>{columnForm.data_type.toUpperCase()} (Custom)</MenuItem>
                )}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Example Value"
              value={columnForm.example_value}
              onChange={(e) => setColumnForm({ ...columnForm, example_value: e.target.value })}
              margin="dense"
              size="small"
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={columnForm.is_key}
                    onChange={(e) => setColumnForm({ ...columnForm, is_key: e.target.checked })}
                    size="small"
                  />
                }
                label={<Typography variant="caption">Primary Key</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={columnForm.is_searchable}
                    onChange={(e) => setColumnForm({ ...columnForm, is_searchable: e.target.checked })}
                    size="small"
                  />
                }
                label={<Typography variant="caption">Searchable</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={columnForm.is_filterable}
                    onChange={(e) => setColumnForm({ ...columnForm, is_filterable: e.target.checked })}
                    size="small"
                  />
                }
                label={<Typography variant="caption">Filterable</Typography>}
              />
            </Box>
            <TextField
              fullWidth
              label="Synonyms"
              value={Array.isArray(columnForm.synonyms) ? columnForm.synonyms.join(', ') : columnForm.synonyms}
              onChange={(e) => setColumnForm({ ...columnForm, synonyms: e.target.value.split(',').map(s => s.trim()) })}
              margin="dense"
              size="small"
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ pt: 1, pb: 1 }}>
            {isEditingColumn && (
              <Button onClick={handleDeleteColumn} color="error" size="small" disabled={loading}>
                Delete
              </Button>
            )}
            <Button onClick={() => setColumnDialogOpen(false)} size="small">Cancel</Button>
            <Button onClick={handleSaveColumn} variant="contained" size="small" disabled={loading || !columnForm.column_name}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Relationship Dialog */}
        <Dialog open={relationshipDialogOpen} onClose={() => setRelationshipDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1, fontSize: '1rem' }}>Edit Relationship</DialogTitle>
          <DialogContent sx={{ pt: 1, maxHeight: '400px', overflow: 'auto' }}>
            <Autocomplete
              fullWidth
              options={tables.map((t) => t.table_name)}
              value={relationshipForm.from_table}
              onChange={(e, value) => {
                setRelationshipForm({ ...relationshipForm, from_table: value || '', from_column: '' });
                setRelatedColumns([]);
                loadFromTableColumns(value || '');
              }}
              onInputChange={(e, value) => {
                setRelationshipForm({ ...relationshipForm, from_table: value });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="From Table"
                  margin="normal"
                  placeholder="Select or type table name"
                />
              )}
            />

            <Autocomplete
              fullWidth
              options={fromTableColumns.map((c) => c.column_name)}
              value={relationshipForm.from_column}
              onChange={(e, value) => {
                setRelationshipForm({ ...relationshipForm, from_column: value || '' });
              }}
              onInputChange={(e, value) => {
                setRelationshipForm({ ...relationshipForm, from_column: value });
              }}
              disabled={!relationshipForm.from_table || relColumnsLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="From Column"
                  margin="normal"
                  placeholder={relationshipForm.from_table ? (relColumnsLoading ? 'Loading...' : 'Select column') : 'Select from table first'}
                />
              )}
            />

            <Autocomplete
              fullWidth
              options={tables.map((t) => t.table_name)}
              value={relationshipForm.to_table}
              onChange={(e, value) => {
                setRelationshipForm({ ...relationshipForm, to_table: value || '', to_column: '' });
                setRelatedColumns([]);
                loadToTableColumns(value || '');
              }}
              onInputChange={(e, value) => {
                setRelationshipForm({ ...relationshipForm, to_table: value });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="To Table"
                  margin="normal"
                  placeholder="Select or type table name"
                />
              )}
            />

            <Autocomplete
              fullWidth
              options={toTableColumns.map((c) => c.column_name)}
              value={relationshipForm.to_column}
              onChange={(e, value) => {
                setRelationshipForm({ ...relationshipForm, to_column: value || '' });
              }}
              onInputChange={(e, value) => {
                setRelationshipForm({ ...relationshipForm, to_column: value });
              }}
              disabled={!relationshipForm.to_table || relColumnsLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="To Column"
                  margin="normal"
                  placeholder={relationshipForm.to_table ? (relColumnsLoading ? 'Loading...' : 'Select column') : 'Select to table first'}
                />
              )}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={relationshipForm.type}
                label="Type"
                onChange={(e) => setRelationshipForm({ ...relationshipForm, type: e.target.value })}
              >
                <MenuItem value="fk">Foreign Key</MenuItem>
                <MenuItem value="reference">Reference</MenuItem>
                <MenuItem value="join">Join</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Cardinality</InputLabel>
              <Select
                value={relationshipForm.cardinality}
                label="Cardinality"
                onChange={(e) => setRelationshipForm({ ...relationshipForm, cardinality: e.target.value })}
              >
                <MenuItem value="1:1">One-to-One (1:1)</MenuItem>
                <MenuItem value="1:N">One-to-Many (1:N)</MenuItem>
                <MenuItem value="N:1">Many-to-One (N:1)</MenuItem>
                <MenuItem value="N:N">Many-to-Many (N:N)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Weight"
              type="number"
              value={relationshipForm.weight}
              onChange={(e) => setRelationshipForm({ ...relationshipForm, weight: parseInt(e.target.value) || 1 })}
              margin="normal"
              inputProps={{ min: 0, max: 100 }}
              helperText="Importance weight for query optimization (0-100)"
            />
            <TextField
              fullWidth
              label="Description"
              value={relationshipForm.description}
              onChange={(e) => setRelationshipForm({ ...relationshipForm, description: e.target.value })}
              multiline
              rows={2}
              margin="normal"
              placeholder="e.g., Each order belongs to one customer"
            />
          </DialogContent>
          <DialogActions>
            {isEditingRelationship && (
              <Button onClick={handleDeleteRelationship} color="error" disabled={loading}>
                Delete
              </Button>
            )}
            <Button onClick={() => setRelationshipDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSaveRelationship}
              variant="contained"
              disabled={loading || !relationshipForm.from_table || !relationshipForm.to_table}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* ==================== BUSINESS TRAINING TAB ==================== */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'grid', gap: 2 }}>
          {/* Metrics Metadata CRUD */}
          <Box>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">📏 Metrics Metadata ({metricsMetadata.length})</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        if (!selectedMetric) return;
                        setMetricForm({
                          id: selectedMetric.id || '',
                          name: selectedMetric.name || '',
                          business_name: selectedMetric.business_name || '',
                          description: selectedMetric.description || '',
                          formula: selectedMetric.formula || '',
                          tables: selectedMetric.tables || [],
                          data_type: selectedMetric.data_type || 'count',
                          unit: selectedMetric.unit || '',
                          related_dimensions: selectedMetric.related_dimensions || [],
                          conditions: selectedMetric.conditions || [],
                        });
                        setMetricTablesInput(Array.isArray(selectedMetric.tables) ? selectedMetric.tables.join(', ') : '');
                        setMetricRelatedDimensionsInput(Array.isArray(selectedMetric.related_dimensions) ? selectedMetric.related_dimensions.join(', ') : '');
                        setMetricConditionsInput(Array.isArray(selectedMetric.conditions) ? selectedMetric.conditions.join(', ') : '');
                        setMetricDialogOpen(true);
                      }}
                      disabled={!selectedMetric}
                    >
                      Edit Selected
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteMetric(selectedMetric?.id)}
                      disabled={!selectedMetric}
                    >
                      Delete Selected
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setMetricForm({
                          id: '',
                          name: '',
                          business_name: '',
                          description: '',
                          formula: '',
                          tables: [],
                          data_type: 'count',
                          unit: '',
                          related_dimensions: [],
                          conditions: [],
                        });
                        setMetricTablesInput('');
                        setMetricRelatedDimensionsInput('');
                        setMetricConditionsInput('');
                        setMetricDialogOpen(true);
                      }}
                    >
                    Add Metric
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ height: '300px', width: '100%' }}>
                  <AGTable
                    data={metricsMetadata.map((m) => ({
                      id: m.id,
                      metric_id: m.id,
                      business_name: m.business_name || m.name,
                      tables: Array.isArray(m.tables) ? m.tables.join(', ') : '',
                      data_type: m.data_type || 'count',
                    }))}
                    columns={[
                      { field: 'metric_id', headerName: 'ID', width: 130, minWidth: 110 },
                      { field: 'business_name', headerName: 'Business Name', width: 180, minWidth: 140 },
                      { field: 'tables', headerName: 'Tables', width: 220, minWidth: 160 },
                      { field: 'data_type', headerName: 'Type', width: 100, minWidth: 80 },
                    ]}
                    columnWidth={120}
                    rowHeight={24}
                    showFilter={true}
                    onSelectionChange={() => {}}
                    onRowClick={(e: any) => {
                      const row = metricsMetadata.find((m) => m.id === e.data?.id);
                      setSelectedMetric(row || null);
                    }}
                    onRowDoubleClick={(e: any) => {
                      const row = metricsMetadata.find((m) => m.id === e.data?.id);
                      if (!row) return;
                      setMetricForm({
                        id: row.id || '',
                        name: row.name || '',
                        business_name: row.business_name || '',
                        description: row.description || '',
                        formula: row.formula || '',
                        tables: row.tables || [],
                        data_type: row.data_type || 'count',
                        unit: row.unit || '',
                        related_dimensions: row.related_dimensions || [],
                        conditions: row.conditions || [],
                      });
                      setMetricTablesInput(Array.isArray(row.tables) ? row.tables.join(', ') : '');
                      setMetricRelatedDimensionsInput(Array.isArray(row.related_dimensions) ? row.related_dimensions.join(', ') : '');
                      setMetricConditionsInput(Array.isArray(row.conditions) ? row.conditions.join(', ') : '');
                      setMetricDialogOpen(true);
                    }}
                    suppressRowClickSelection={true}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Glossary Metadata CRUD */}
          <Box>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">📖 Glossary Metadata ({glossaryMetadata.length})</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        if (!selectedGlossary) return;
                        setGlossaryForm({
                          id: selectedGlossary.id || '',
                          user_terms: selectedGlossary.user_terms || [],
                          canonical_term: selectedGlossary.canonical_term || '',
                          metric_ids: selectedGlossary.metric_ids || [],
                          table_names: selectedGlossary.table_names || [],
                          column_names: selectedGlossary.column_names || [],
                          time_filter: selectedGlossary.time_filter || '',
                          operation: selectedGlossary.operation || '',
                          description: selectedGlossary.description || '',
                        });
                        setGlossaryUserTermsInput(Array.isArray(selectedGlossary.user_terms) ? selectedGlossary.user_terms.join(', ') : '');
                        setGlossaryMetricIdsInput(Array.isArray(selectedGlossary.metric_ids) ? selectedGlossary.metric_ids.join(', ') : '');
                        setGlossaryTableNamesInput(Array.isArray(selectedGlossary.table_names) ? selectedGlossary.table_names.join(', ') : '');
                        setGlossaryColumnNamesInput(Array.isArray(selectedGlossary.column_names) ? selectedGlossary.column_names.join(', ') : '');
                        setGlossaryDialogOpen(true);
                      }}
                      disabled={!selectedGlossary}
                    >
                      Edit Selected
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteGlossary(selectedGlossary?.id)}
                      disabled={!selectedGlossary}
                    >
                      Delete Selected
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setGlossaryForm({
                          id: '',
                          user_terms: [],
                          canonical_term: '',
                          metric_ids: [],
                          table_names: [],
                          column_names: [],
                          time_filter: '',
                          operation: '',
                          description: '',
                        });
                        setGlossaryUserTermsInput('');
                        setGlossaryMetricIdsInput('');
                        setGlossaryTableNamesInput('');
                        setGlossaryColumnNamesInput('');
                        setGlossaryDialogOpen(true);
                      }}
                    >
                    Add Glossary
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ height: '300px', width: '100%' }}>
                  <AGTable
                    data={glossaryMetadata.map((g) => ({
                      id: g.id,
                      glossary_id: g.id,
                      canonical_term: g.canonical_term || '',
                      user_terms: Array.isArray(g.user_terms) ? g.user_terms.join(', ') : '',
                      binding: Array.isArray(g.metric_ids) && g.metric_ids.length
                        ? `metrics: ${g.metric_ids.length}`
                        : (Array.isArray(g.table_names) && g.table_names.length ? `tables: ${g.table_names.length}` : '-'),
                    }))}
                    columns={[
                      { field: 'glossary_id', headerName: 'ID', width: 140, minWidth: 120 },
                      { field: 'canonical_term', headerName: 'Canonical Term', width: 180, minWidth: 140 },
                      { field: 'user_terms', headerName: 'User Terms', width: 260, minWidth: 200 },
                      { field: 'binding', headerName: 'Binding', width: 120, minWidth: 100 },
                    ]}
                    columnWidth={120}
                    rowHeight={24}
                    showFilter={true}
                    onSelectionChange={() => {}}
                    onRowClick={(e: any) => {
                      const row = glossaryMetadata.find((g) => g.id === e.data?.id);
                      setSelectedGlossary(row || null);
                    }}
                    onRowDoubleClick={(e: any) => {
                      const row = glossaryMetadata.find((g) => g.id === e.data?.id);
                      if (!row) return;
                      setGlossaryForm({
                        id: row.id || '',
                        user_terms: row.user_terms || [],
                        canonical_term: row.canonical_term || '',
                        metric_ids: row.metric_ids || [],
                        table_names: row.table_names || [],
                        column_names: row.column_names || [],
                        time_filter: row.time_filter || '',
                        operation: row.operation || '',
                        description: row.description || '',
                      });
                      setGlossaryUserTermsInput(Array.isArray(row.user_terms) ? row.user_terms.join(', ') : '');
                      setGlossaryMetricIdsInput(Array.isArray(row.metric_ids) ? row.metric_ids.join(', ') : '');
                      setGlossaryTableNamesInput(Array.isArray(row.table_names) ? row.table_names.join(', ') : '');
                      setGlossaryColumnNamesInput(Array.isArray(row.column_names) ? row.column_names.join(', ') : '');
                      setGlossaryDialogOpen(true);
                    }}
                    suppressRowClickSelection={true}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Metric Dialog */}
        <Dialog open={metricDialogOpen} onClose={() => setMetricDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Metric Metadata</DialogTitle>
          <DialogContent sx={{ pt: 2, maxHeight: '520px', overflow: 'auto' }}>
            <TextField fullWidth label="Metric ID" value={metricForm.id} onChange={(e) => setMetricForm({ ...metricForm, id: e.target.value })} margin="dense" />
            <TextField fullWidth label="Name" value={metricForm.name} onChange={(e) => setMetricForm({ ...metricForm, name: e.target.value })} margin="dense" />
            <TextField fullWidth label="Business Name" value={metricForm.business_name} onChange={(e) => setMetricForm({ ...metricForm, business_name: e.target.value })} margin="dense" />
            <TextField fullWidth label="Description" value={metricForm.description} onChange={(e) => setMetricForm({ ...metricForm, description: e.target.value })} margin="dense" multiline rows={2} />
            <TextField fullWidth label="Formula" value={metricForm.formula} onChange={(e) => setMetricForm({ ...metricForm, formula: e.target.value })} margin="dense" multiline rows={2} />
            <TextField
              fullWidth
              label="Tables (comma-separated)"
              value={metricTablesInput}
              onChange={(e) => setMetricTablesInput(e.target.value)}
              margin="dense"
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Data Type</InputLabel>
              <Select value={metricForm.data_type} label="Data Type" onChange={(e) => setMetricForm({ ...metricForm, data_type: String(e.target.value) })}>
                <MenuItem value="count">count</MenuItem>
                <MenuItem value="currency">currency</MenuItem>
                <MenuItem value="percentage">percentage</MenuItem>
                <MenuItem value="number">number</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth label="Unit" value={metricForm.unit} onChange={(e) => setMetricForm({ ...metricForm, unit: e.target.value })} margin="dense" />
            <TextField
              fullWidth
              label="Related Dimensions (comma-separated)"
              value={metricRelatedDimensionsInput}
              onChange={(e) => setMetricRelatedDimensionsInput(e.target.value)}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Conditions (comma-separated)"
              value={metricConditionsInput}
              onChange={(e) => setMetricConditionsInput(e.target.value)}
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            {isEditingMetric && (
              <Button onClick={() => handleDeleteMetric()} color="error" disabled={loading}>Delete</Button>
            )}
            <Button onClick={() => setMetricDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveMetric} variant="contained" disabled={loading || !metricForm.id || !metricForm.name || !metricForm.business_name || !metricForm.formula || !parseCsv(metricTablesInput).length}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Glossary Dialog */}
        <Dialog open={glossaryDialogOpen} onClose={() => setGlossaryDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Glossary Metadata</DialogTitle>
          <DialogContent sx={{ pt: 2, maxHeight: '520px', overflow: 'auto' }}>
            <TextField fullWidth label="Entry ID" value={glossaryForm.id} onChange={(e) => setGlossaryForm({ ...glossaryForm, id: e.target.value })} margin="dense" />
            <TextField
              fullWidth
              label="User Terms (comma-separated)"
              value={glossaryUserTermsInput}
              onChange={(e) => setGlossaryUserTermsInput(e.target.value)}
              margin="dense"
            />
            <TextField fullWidth label="Canonical Term" value={glossaryForm.canonical_term} onChange={(e) => setGlossaryForm({ ...glossaryForm, canonical_term: e.target.value })} margin="dense" />
            <TextField
              fullWidth
              label="Metric IDs (comma-separated)"
              value={glossaryMetricIdsInput}
              onChange={(e) => setGlossaryMetricIdsInput(e.target.value)}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Table Names (comma-separated)"
              value={glossaryTableNamesInput}
              onChange={(e) => setGlossaryTableNamesInput(e.target.value)}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Column Names (comma-separated)"
              value={glossaryColumnNamesInput}
              onChange={(e) => setGlossaryColumnNamesInput(e.target.value)}
              margin="dense"
            />
            <TextField fullWidth label="Time Filter" value={glossaryForm.time_filter} onChange={(e) => setGlossaryForm({ ...glossaryForm, time_filter: e.target.value })} margin="dense" />
            <TextField fullWidth label="Operation" value={glossaryForm.operation} onChange={(e) => setGlossaryForm({ ...glossaryForm, operation: e.target.value })} margin="dense" />
            <TextField fullWidth label="Description" value={glossaryForm.description} onChange={(e) => setGlossaryForm({ ...glossaryForm, description: e.target.value })} margin="dense" multiline rows={2} />
          </DialogContent>
          <DialogActions>
            {isEditingGlossary && (
              <Button onClick={() => handleDeleteGlossary()} color="error" disabled={loading}>Delete</Button>
            )}
            <Button onClick={() => setGlossaryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveGlossary} variant="contained" disabled={loading || !glossaryForm.id || !glossaryForm.canonical_term || !parseCsv(glossaryUserTermsInput).length}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

      </TabPanel>

      {/* ==================== BULK IMPORT DIALOGS ==================== */}

      {/* Bulk Import Tables Dialog */}
      <Dialog open={bulkTableDialogOpen} onClose={() => setBulkTableDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Bulk Import Tables</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Paste an array of table objects or object with tables array
          </Typography>
          <TextField
            fullWidth
            label="JSON Data"
            value={bulkTableJson}
            onChange={(e) => setBulkTableJson(e.target.value)}
            multiline
            rows={8}
            placeholder={`{
  "tables": [
    {
      "table_name": "TABLE_NAME",
      "business_name": "Business Name",
      "description": "Table Description",
      "synonyms": [],
      "is_fact": true,
      "created_from_db_sync": true
    }
  ]
}`}
            sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
          />
          <Alert severity="info" sx={{ mt: 1 }}>
            💡 Copy-paste from metadata JSON file
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkTableDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBulkImportTables} variant="contained" disabled={loading || !bulkTableJson.trim()}>
            Import Tables
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Import Columns Dialog */}
      <Dialog open={bulkColumnDialogOpen} onClose={() => setBulkColumnDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Bulk Import Columns</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Paste an array of column objects or object with columns array
          </Typography>
          <TextField
            fullWidth
            label="JSON Data"
            value={bulkColumnJson}
            onChange={(e) => setBulkColumnJson(e.target.value)}
            multiline
            rows={8}
            placeholder={`{
  "columns": [
    {
      "table_name": "TABLE_NAME",
      "column_name": "COLUMN_NAME",
      "business_name": "Business Name",
      "description": "Column Description",
      "data_type": "nvarchar",
      "nullable": true,
      "synonyms": [],
      "is_measure": false,
      "format_hint": "string",
      "created_from_db_sync": true
    }
  ]
}`}
            sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
          />
          <Alert severity="info" sx={{ mt: 1 }}>
            💡 Copy-paste from metadata JSON file
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkColumnDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBulkImportColumns} variant="contained" disabled={loading || !bulkColumnJson.trim()}>
            Import Columns
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Import Relationships Dialog */}
      <Dialog open={bulkRelationshipDialogOpen} onClose={() => setBulkRelationshipDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Bulk Import Relationships</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Paste an array of relationship objects or object with relationships array
          </Typography>
          <TextField
            fullWidth
            label="JSON Data"
            value={bulkRelationshipJson}
            onChange={(e) => setBulkRelationshipJson(e.target.value)}
            multiline
            rows={8}
            placeholder={`{
  "relationships": [
    {
      "name": "RELATIONSHIP_NAME",
      "source_table": "SOURCE_TABLE",
      "source_column": "SOURCE_COLUMN",
      "target_table": "TARGET_TABLE",
      "target_column": "TARGET_COLUMN",
      "cardinality": "N:1",
      "business_meaning": "SOURCE_TABLE.SOURCE_COLUMN \u2192 TARGET_TABLE.TARGET_COLUMN",
      "is_hidden": false,
      "created_from_db_sync": true
    }
  ]
}`}
            sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
          />
          <Alert severity="info" sx={{ mt: 1 }}>
            💡 Copy-paste from metadata JSON file
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkRelationshipDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBulkImportRelationships} variant="contained" disabled={loading || !bulkRelationshipJson.trim()}>
            Import Relationships
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==================== DEBUG INFO TAB ==================== */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>🔗 API Configuration</Typography>
              <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                <Typography variant="body2"><strong>Redux server_ip:</strong> {serverUrl || 'Not set'}</Typography>
                <Typography variant="body2"><strong>V2Api baseURL:</strong> {api.baseURL}</Typography>
                <Typography variant="body2"><strong>Sync endpoint:</strong> {api.baseURL}/v2/metadata/sync</Typography>
                <Typography variant="body2"><strong>Tables endpoint:</strong> {api.baseURL}/v2/metadata/tables</Typography>
                <Typography variant="body2"><strong>Frontend port:</strong> {window.location.port || '3001'}</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>📊 System Statistics</Typography>
              <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                <Typography variant="body2">Total Tables: {tables.length}</Typography>
                <Typography variant="body2">Total Columns (selected table): {tableColumns.length}</Typography>
                <Typography variant="body2">Total Relationships: {relationships.length}</Typography>
                <Typography variant="body2">Metrics Metadata: {metricsMetadata.length}</Typography>
                <Typography variant="body2">Glossary Metadata: {glossaryMetadata.length}</Typography>
                <Typography variant="body2">Last Sync: {syncReport ? new Date(syncReport.timestamp).toLocaleString() : 'Never'}</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>🧪 Test API Connection</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    console.log('[TEST] Testing sync endpoint...');
                    handleSyncFromDB();
                  }}
                >
                  Test Sync API
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    console.log('[TEST] Testing metadata load...');
                    loadMetadata();
                  }}
                >
                  Test Metadata API
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    console.log('[TEST] Current Redux state:', useSelector((state: any) => state.global));
                  }}
                >
                  Log Redux State
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </TabPanel>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}
