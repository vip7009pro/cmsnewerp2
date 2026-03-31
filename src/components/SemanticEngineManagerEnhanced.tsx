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
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [conceptDialogOpen, setConceptDialogOpen] = useState(false);
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
  const [ruleForm, setRuleForm] = useState({ name: '', condition: '', applies_to: '' });
  const [conceptForm, setConceptForm] = useState({ business_question: '', primary_metric: '', dimension: '', time_period: '' });

  // Bulk import states
  const [bulkTableJson, setBulkTableJson] = useState('');
  const [bulkColumnJson, setBulkColumnJson] = useState('');
  const [bulkRelationshipJson, setBulkRelationshipJson] = useState('');
  const [relatedColumns, setRelatedColumns] = useState<any[]>([]);

  // Training state
  const [patterns, setPatterns] = useState<any[]>([]);
  const [trainingExamples, setTrainingExamples] = useState<any[]>([]);
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
      const [patternsRes, examplesRes] = await Promise.all([
        api.getTrainingPatterns(),
        api.getTrainingExamples(),
      ]);

      console.log('[FRONTEND] Patterns response:', patternsRes);
      console.log('[FRONTEND] Examples response:', examplesRes);

      if (patternsRes.tk_status === 'OK') {
        setPatterns(patternsRes.data?.patterns || []);
      }
      if (examplesRes.tk_status === 'OK') {
        setTrainingExamples(examplesRes.data?.examples || []);
      }
    } catch (error) {
      console.error('Failed to load training data', error);
    }
  };

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
      const res = await api.saveTableMetadata(tableForm);

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

  // ==================== BUSINESS TRAINING ====================

  const handleCreateRule = async () => {
    try {
      setLoading(true);
      const res = await api.createBusinessRule(ruleForm);

      if (res.tk_status === 'OK') {
        showMessage('success', 'Business rule created successfully');
        setRuleDialogOpen(false);
        setRuleForm({ name: '', condition: '', applies_to: '' });
        loadTrainingData();
      } else {
        showMessage('error', res.error?.message || 'Failed to create rule');
      }
    } catch (error) {
      showMessage('error', 'Error creating rule');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConcept = async () => {
    try {
      setLoading(true);
      const res = await api.mapBusinessConcept(conceptForm);

      if (res.tk_status === 'OK') {
        showMessage('success', 'Business concept mapped successfully');
        setConceptDialogOpen(false);
        setConceptForm({ business_question: '', primary_metric: '', dimension: '', time_period: '' });
        loadTrainingData();
      } else {
        showMessage('error', res.error?.message || 'Failed to map concept');
      }
    } catch (error) {
      showMessage('error', 'Error mapping concept');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExample = async (id: string) => {
    if (!window.confirm('Delete this training example?')) return;

    try {
      setLoading(true);
      const res = await api.deleteTrainingExample(id);

      if (res.tk_status === 'OK') {
        showMessage('success', 'Training example deleted');
        loadTrainingData();
      }
    } catch (error) {
      showMessage('error', 'Error deleting example');
    } finally {
      setLoading(false);
    }
  };

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
                    data={relationships.map((rel) => ({
                      id: `${rel.from_table}_${rel.from_column}_to_${rel.to_table}_${rel.to_column}`,
                      from_table: rel.from_table || rel.source_table || '',
                      from_column: rel.from_column || rel.source_column || '',
                      to_table: rel.to_table || rel.target_table || '',
                      to_column: rel.to_column || rel.target_column || '',
                      type: rel.type || 'fk',
                      cardinality: rel.cardinality || 'N:1',
                      weight: rel.weight || 1,
                    }))}
                    columns={[
                      { field: 'from_table', headerName: 'From', width: 80, minWidth: 80 },
                      { field: 'from_column', headerName: 'Column', width: 80, minWidth: 80 },
                      { field: 'to_table', headerName: 'To', width: 80, minWidth: 80 },
                      { field: 'to_column', headerName: 'Column', width: 80, minWidth: 80 },
                      { field: 'type', headerName: 'Type', width: 60, minWidth: 60 },
                      { field: 'cardinality', headerName: 'Card', width: 60, minWidth: 60 },
                      { field: 'weight', headerName: 'W', width: 45, minWidth: 45 },
                    ]}
                    columnWidth={95}
                    rowHeight={22}
                    showFilter={true}
                    onSelectionChange={() => { }}
                    onRowDoubleClick={(e: any) => {
                      const relData = relationships.find(
                        (rel) => `${rel.from_table || rel.source_table}_${rel.from_column || rel.source_column}_to_${rel.to_table || rel.target_table}_${rel.to_column || rel.target_column}` === e.data?.id
                      );
                      if (relData) {
                        setRelatedColumns([]);
                        setRelationshipForm({
                          from_table: relData.from_table || relData.source_table,
                          from_column: relData.from_column || relData.source_column,
                          to_table: relData.to_table || relData.target_table,
                          to_column: relData.to_column || relData.target_column,
                          type: relData.type || 'fk',
                          cardinality: relData.cardinality,
                          weight: relData.weight || 1,
                          description: relData.description || '',
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
              onChange={(e) => setTableForm({ ...tableForm, use_cases: e.target.value.split('\n').filter(s => s.trim()) })}
              multiline
              rows={3}
              margin="dense"
              size="small"
            />
          </DialogContent>
          <DialogActions sx={{ pt: 1, pb: 1 }}>
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
                value={columnForm.data_type}
                label="Data Type"
                onChange={(e) => setColumnForm({ ...columnForm, data_type: e.target.value })}
              >
                <MenuItem value="INT">Integer</MenuItem>
                <MenuItem value="VARCHAR">Varchar</MenuItem>
                <MenuItem value="NVARCHAR">NVarchar</MenuItem>
                <MenuItem value="DECIMAL">Decimal</MenuItem>
                <MenuItem value="DATETIME">DateTime</MenuItem>
                <MenuItem value="BIT">Boolean</MenuItem>
                <MenuItem value="FLOAT">Float</MenuItem>
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
          {/* Common Patterns */}
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  📊 Common Query Patterns (Learn by Example)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  These are common patterns in Vietnamese ERP systems. Use these as templates for training.
                </Typography>

                {patterns.map((pattern) => (
                  <Accordion key={pattern.pattern_name} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {pattern.pattern_name}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {pattern.keywords.slice(0, 3).map((kw: string) => (
                            <Chip key={kw} label={kw} size="small" />
                          ))}
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Example Questions (tự động tạo변종):</Typography>
                        <Box sx={{ pl: 2, mb: 2 }}>
                          {pattern.example_questions.map((q: string, i: number) => (
                            <Typography key={i} variant="body2" sx={{ mb: 0.5, color: '#1976d2' }}>
                              • {q}
                            </Typography>
                          ))}
                        </Box>
                        <Typography variant="caption" sx={{ display: 'block', mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1, fontFamily: 'monospace' }}>
                          {pattern.sql_template.slice(0, 200)}...
                        </Typography>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          </Box>

          {/* Business Rule Creation */}
          <Box sx={{ gridColumn: { md: '1' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  ⚙️ Business Rules (No SQL needed!)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Define business logic by describing conditions in plain language.
                </Typography>

                <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 1, mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Example: VIP Customer Definition</Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">Rule Name: <strong>VIP Customer</strong></Typography>
                    <Typography variant="body2">Applies To: <strong>Customers table</strong></Typography>
                    <Typography variant="body2">Condition: <strong>Total purchases {'>'}  1,000,000 VND</strong></Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setRuleDialogOpen(true)}
                >
                  + Create Business Rule
                </Button>
              </CardContent>
            </Card>
          </Box>

          {/* Business Concept Mapping */}
          <Box sx={{ gridColumn: { md: '1' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  🎯 Business Concept Mapping
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Describe what you want in business terms, system generates variations.
                </Typography>

                <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 1, mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Example: Monthly Revenue Analysis</Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">Business Question: <strong>"Monthly revenue by product"</strong></Typography>
                    <Typography variant="body2">Primary Metric: <strong>Revenue</strong></Typography>
                    <Typography variant="body2">Group By: <strong>Product Category</strong></Typography>
                    <Typography variant="body2">Time: <strong>Monthly</strong></Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setConceptDialogOpen(true)}
                >
                  + Map Business Concept
                </Button>
              </CardContent>
            </Card>
          </Box>

          {/* Training Examples Created */}
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  📚 Training Examples ({trainingExamples.length})
                </Typography>

                {trainingExamples.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No training examples yet. Create some using the options above!
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                          <TableCell>Type</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Confidence</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {trainingExamples.map((ex) => (
                          <TableRow key={ex.id}>
                            <TableCell>
                              <Chip
                                label={ex.source_type}
                                size="small"
                                variant={ex.source_type === 'pattern' ? 'filled' : 'outlined'}
                              />
                            </TableCell>
                            <TableCell>{ex.business_concept}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinearProgress variant="determinate" value={ex.confidence * 100} sx={{ flex: 1, minWidth: 100 }} />
                                <Typography variant="caption">{(ex.confidence * 100).toFixed(0)}%</Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteExample(ex.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Rule Dialog */}
        <Dialog open={ruleDialogOpen} onClose={() => setRuleDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create Business Rule</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Rule Name (e.g., VIP Customer)"
              value={ruleForm.name}
              onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Applies To Table</InputLabel>
              <Select
                value={ruleForm.applies_to}
                label="Applies To Table"
                onChange={(e) => setRuleForm({ ...ruleForm, applies_to: e.target.value })}
              >
                {tables.map((t) => (
                  <MenuItem key={t.table_name} value={t.table_name}>
                    {t.business_name} ({t.table_name})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Condition (plain language, e.g., 'Total purchases > 1,000,000')"
              value={ruleForm.condition}
              onChange={(e) => setRuleForm({ ...ruleForm, condition: e.target.value })}
              multiline
              rows={3}
              margin="normal"
            />
            <Alert severity="info" sx={{ mt: 2 }}>
              💡 Write your condition in natural language. The system will generate SQL variations automatically.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRuleDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreateRule}
              variant="contained"
              disabled={loading || !ruleForm.name || !ruleForm.condition || !ruleForm.applies_to}
            >
              Create Rule
            </Button>
          </DialogActions>
        </Dialog>

        {/* Concept Dialog */}
        <Dialog open={conceptDialogOpen} onClose={() => setConceptDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Map Business Concept to SQL</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Business Question (e.g., 'Monthly revenue by product')"
              value={conceptForm.business_question}
              onChange={(e) => setConceptForm({ ...conceptForm, business_question: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Primary Metric (What to measure)</InputLabel>
              <Select
                value={conceptForm.primary_metric}
                label="Primary Metric"
                onChange={(e) => setConceptForm({ ...conceptForm, primary_metric: e.target.value })}
              >
                <MenuItem value="Revenue">Revenue</MenuItem>
                <MenuItem value="Quantity">Quantity</MenuItem>
                <MenuItem value="Count">Count</MenuItem>
                <MenuItem value="Average">Average</MenuItem>
                <MenuItem value="Total">Total</MenuItem>
                <MenuItem value="Profit">Profit</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Dimension (Group by)</InputLabel>
              <Select
                value={conceptForm.dimension}
                label="Dimension"
                onChange={(e) => setConceptForm({ ...conceptForm, dimension: e.target.value })}
              >
                <MenuItem value="Product">Product</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
                <MenuItem value="Region">Region</MenuItem>
                <MenuItem value="Time">Time</MenuItem>
                <MenuItem value="Category">Category</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Time Period</InputLabel>
              <Select
                value={conceptForm.time_period}
                label="Time Period"
                onChange={(e) => setConceptForm({ ...conceptForm, time_period: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Quarterly">Quarterly</MenuItem>
                <MenuItem value="Yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
            <Alert severity="info" sx={{ mt: 2 }}>
              💡 System will auto-generate question variations and map to SQL patterns.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConceptDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreateConcept}
              variant="contained"
              disabled={loading || !conceptForm.business_question || !conceptForm.primary_metric || !conceptForm.dimension}
            >
              Map Concept
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
            placeholder={`[{"table_name": "customers", "schema": "dbo", "business_name": "Khách hàng"}]`}
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
            placeholder={`[{"table_name": "customers", "column_name": "customer_id", "business_name": "Mã khách"}]`}
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
            placeholder={`[{"from_table": "orders", "from_column": "cust_id", "to_table": "customers", "to_column": "id"}]`}
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
                <Typography variant="body2">Training Examples: {trainingExamples.length}</Typography>
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
