/**
 * Semantic Query Engine Management Interface
 * Frontend for managing metadata, testing pipeline, and training business logic
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  BugReport as DebugIcon,
  Assessment as MetricsIcon,
  TableChart as TableIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import Grid from '@mui/material/GridLegacy';
import { getSever } from '../api/Api';
import { getV2ApiClient } from '../api/V2Api';

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
      id={`semantic-tabpanel-${index}`}
      aria-labelledby={`semantic-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SemanticEngineManager() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Query Testing State
  const [queryText, setQueryText] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [debugMode, setDebugMode] = useState(false);

  // Metadata State
  const [metadata, setMetadata] = useState<any>({});
  const [editingMetadata, setEditingMetadata] = useState<any>({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<'table' | 'column' | 'metric' | 'relationship' | 'glossary' | null>(null);

  // Metrics State
  const [availableMetrics, setAvailableMetrics] = useState<any[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('');

  const api = getV2ApiClient();
  const serverUrl = getSever();
  const apiBaseUrl = serverUrl ? `${serverUrl.replace(/\/$/, '')}/ai` : '/ai';

  useEffect(() => {
    console.log('[FRONTEND] SemanticEngineManager serverUrl:', serverUrl);
    console.log('[FRONTEND] SemanticEngineManager apiBaseUrl:', apiBaseUrl);
    api.setBaseURL(apiBaseUrl);

    loadMetadata();
    loadMetrics();
  }, [serverUrl]);

  const loadMetadata = async () => {
    try {
      setLoading(true);
      // In a real implementation, you'd have API endpoints to fetch metadata
      // For now, we'll show placeholder data
      setMetadata({
        tables: [],
        columns: [],
        relationships: [],
        metrics: [],
        glossary: []
      });
    } catch (err) {
      setError('Failed to load metadata');
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      const response = await api.listMetrics();
      if (response.tk_status === 'OK') {
        setAvailableMetrics(response.data?.rows || []);
      }
    } catch (err) {
      console.error('Failed to load metrics:', err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleQueryTest = async () => {
    if (!queryText.trim()) {
      setError('Please enter a query');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await api.aiV2Query({
        question: queryText,
        explain: true,
        debug: debugMode,
      });

      if (response.tk_status === 'NG') {
        setError(response.error?.message || 'Query failed');
        return;
      }

      setQueryResult(response.data);
      setSuccess('Query executed successfully!');

    } catch (err: any) {
      setError(err.message || 'Query execution failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMetricTest = async () => {
    if (!selectedMetric) {
      setError('Please select a metric');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await api.aiV2Metric({
        metric_id: selectedMetric,
        debug: debugMode,
      });

      if (response.tk_status === 'NG') {
        setError(response.error?.message || 'Metric query failed');
        return;
      }

      setQueryResult(response.data);
      setSuccess('Metric query executed successfully!');

    } catch (err: any) {
      setError(err.message || 'Metric query failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEditMetadata = (type: 'table' | 'column' | 'metric' | 'relationship' | 'glossary') => {
    setEditType(type);
    setEditingMetadata({});
    setEditDialogOpen(true);
  };

  const handleSaveMetadata = () => {
    // In a real implementation, this would save to the metadata files
    // For now, just close the dialog
    setEditDialogOpen(false);
    setSuccess('Metadata updated (simulated)');
  };

  const renderQueryTesting = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Test Semantic Queries
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Natural Language Query
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Enter your question in Vietnamese or English..."
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PlayIcon />}
                  onClick={handleQueryTest}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} /> : 'Execute Query'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DebugIcon />}
                  onClick={() => setDebugMode(!debugMode)}
                  color={debugMode ? 'secondary' : 'primary'}
                >
                  {debugMode ? 'Debug ON' : 'Debug OFF'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Metric Query
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Metric</InputLabel>
                <Select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                >
                  {availableMetrics.map((metric) => (
                    <MenuItem key={metric.id} value={metric.id}>
                      {metric.name} - {metric.business_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<MetricsIcon />}
                onClick={handleMetricTest}
                disabled={loading || !selectedMetric}
                fullWidth
              >
                Execute Metric Query
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {queryResult && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Query Results
            </Typography>

            {queryResult.sql && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary">
                  Generated SQL:
                </Typography>
                <Paper sx={{ p: 1, bgcolor: 'grey.100', fontFamily: 'monospace' }}>
                  {queryResult.sql}
                </Paper>
              </Box>
            )}

            {queryResult.explanation && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="secondary">
                  Explanation:
                </Typography>
                <Typography>{queryResult.explanation}</Typography>
              </Box>
            )}

            {queryResult.rows && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  Data ({queryResult.rows.length} rows):
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {Object.keys(queryResult.rows[0] || {}).map((col) => (
                          <TableCell key={col}>{col}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {queryResult.rows.slice(0, 10).map((row: any, idx: number) => (
                        <TableRow key={idx}>
                          {Object.values(row).map((val: any, colIdx: number) => (
                            <TableCell key={colIdx}>{String(val)}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {queryResult.visualization_hints && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  Visualization Suggestion:
                </Typography>
                <Chip
                  label={`${queryResult.visualization_hints.type} chart`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}

            {debugMode && queryResult.pipeline_steps && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">Pipeline Debug Info</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {queryResult.pipeline_steps.map((step: any, idx: number) => (
                      <ListItem key={idx}>
                        <ListItemText
                          primary={`${step.step}: ${step.duration_ms}ms`}
                          secondary={step.note}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );

  const renderMetadataManagement = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Metadata Management
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                <TableIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Tables
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metadata.tables?.length || 0} tables defined
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditMetadata('table')}>
                Edit Tables
              </Button>
              <Button size="small" startIcon={<RefreshIcon />} onClick={loadMetadata}>
                Refresh
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Columns
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metadata.columns?.length || 0} columns defined
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditMetadata('column')}>
                Edit Columns
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                <MetricsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Metrics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metadata.metrics?.length || 0} metrics defined
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditMetadata('metric')}>
                Edit Metrics
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Relationships
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metadata.relationships?.length || 0} relationships defined
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditMetadata('relationship')}>
                Edit Relationships
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Glossary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metadata.glossary?.length || 0} terms defined
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditMetadata('glossary')}>
                Edit Glossary
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadMetadata}>
            Reload Metadata
          </Button>
          <Button variant="outlined" startIcon={<SaveIcon />}>
            Export Metadata
          </Button>
          <Button variant="outlined" startIcon={<SettingsIcon />}>
            Validate Metadata
          </Button>
        </Box>
      </Box>
    </Box>
  );

  const renderTrainingInterface = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Business Logic Training
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This interface allows you to train and refine the semantic understanding of your ERP system.
        Add example queries, correct misunderstandings, and improve the AI's business knowledge.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add Training Example
              </Typography>
              <TextField
                fullWidth
                label="User Question"
                placeholder="e.g., 'Doanh thu tháng này so với tháng trước?'"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Expected SQL"
                multiline
                rows={3}
                placeholder="Expected SQL query..."
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Expected Result"
                multiline
                rows={2}
                placeholder="Expected explanation..."
                sx={{ mb: 2 }}
              />
              <Button variant="contained" fullWidth>
                Add Training Example
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Training Statistics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography>Total Examples: 0</Typography>
                <Typography>Accuracy: 0%</Typography>
                <Typography>Last Trained: Never</Typography>
                <Typography>Model Version: v2.0.0</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Button variant="contained" fullWidth>
                Retrain Model
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Training Examples
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No training examples yet. Add some examples above to start training the model.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Semantic ERP Query Engine Manager
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage metadata, test queries, and train business logic for intelligent SQL generation
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Query Testing" />
            <Tab label="Metadata Management" />
            <Tab label="Business Training" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {renderQueryTesting()}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {renderMetadataManagement()}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {renderTrainingInterface()}
          </TabPanel>
        </Paper>
      </Box>

      {/* Edit Metadata Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit {editType ? `${editType.charAt(0).toUpperCase()}${editType.slice(1)}` : 'Metadata'} Metadata
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Edit the JSON metadata directly. Changes will be saved to the metadata files.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={20}
            placeholder={`Enter ${editType} metadata as JSON...`}
            value={JSON.stringify(editingMetadata, null, 2)}
            onChange={(e) => {
              try {
                setEditingMetadata(JSON.parse(e.target.value));
              } catch (err) {
                // Invalid JSON, keep as string for now
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveMetadata} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}