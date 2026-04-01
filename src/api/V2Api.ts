/**
 * V2 API Client - Semantic Query Engine API
 */

import axios, { AxiosInstance } from 'axios';
import Cookies from 'universal-cookie';
import { getSever } from './Api';

const cookies = new Cookies();

interface SemanticQueryRequest {
  question: string;
  chat_history?: Array<{ user: string; assistant: string }>;
  chat_summary?: string;
  explain?: boolean;
  debug?: boolean;
  top_k?: number;
  max_depth?: number;
}

interface SemanticQueryResponse {
  tk_status: 'OK' | 'NG';
  data?: {
    sql: string;
    data: any[];
    explanation: string;
    chat_summary: string;
    execution_time_ms: number;
    sql_generation_prompt?: string;
    debug_info?: any;
    visualization_hints?: {
      type: 'line' | 'bar' | 'pie' | 'table' | 'scatter';
      dimensions: string[];
      measures: string[];
    };
    pipeline_steps?: Array<{
      step: string;
      duration_ms: number;
      status: 'ok' | 'error';
      note?: string;
    }>;
  };
  error?: {
    code: string;
    message: string;
    http_status?: number;
    title?: string;
    description?: string;
    suggestion?: string;
    retry_after_seconds?: number;
    debug_info?: any;
    details?: any;
  };
}

interface MetricQueryRequest {
  metric_id: string;
  filters?: any[];
  group_by?: string[];
  limit?: number;
  debug?: boolean;
}

interface MetricQueryResponse {
  tk_status: 'OK' | 'NG';
  data?: {
    metric_id: string;
    metric_name: string;
    value?: number | string;
    rows?: any[];
    execution_time_ms: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

interface MetricListResponse {
  tk_status: 'OK' | 'NG';
  data?: {
    metric_id: string;
    metric_name: string;
    rows?: any[];
  };
  error?: {
    code: string;
    message: string;
  };
}

export class V2ApiClient {
  private client: AxiosInstance;
  public baseURL: string;

  constructor(baseURL: string = '') {
    if (!baseURL) {
      // Get server URL from Redux store (configured with proper server IP/port)
      try {
        const serverUrl = getSever();
        this.baseURL = serverUrl ? `${serverUrl}/ai` : 'http://localhost:3007/ai';
      } catch (err) {
        // Fallback if getSever fails
        console.warn('[V2ApiClient] Failed to get server URL from Redux, using fallback', err);
        this.baseURL = 'http://localhost:3007/ai';
      }
    } else {
      this.baseURL = baseURL;
    }
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 60000,
      withCredentials: true,
    });

    const token = cookies.get('token');
    if (token) {
      this.setAuthToken(token);
    }
  }

  /**
   * Execute a semantic query
   */
  async aiV2Query(request: SemanticQueryRequest): Promise<SemanticQueryResponse> {
    try {
      // Build request body
      const payload = {
        question: request.question,
        chat_history: request.chat_history || [],
        chat_summary: request.chat_summary || '',
        explain: request.explain !== false,
        debug: request.debug || false,
        top_k: request.top_k || 7,
        max_depth: request.max_depth || 2,
      };

      const response = await this.client.post<SemanticQueryResponse>('/v2/query', payload);
      return response.data;
    } catch (error) {
      console.error('V2 Query Error:', error);
      const message = this.formatErrorMessage(error);
      return {
        tk_status: 'NG',
        error: {
          code: 'API_ERROR',
          message,
        },
      };
    }
  }

  /**
   * Execute a metric query
   */
  async aiV2Metric(request: MetricQueryRequest): Promise<MetricQueryResponse> {
    try {
      const payload = {
        metric_id: request.metric_id,
        filters: request.filters || [],
        group_by: request.group_by || [],
      };

      const response = await this.client.post<MetricQueryResponse>('/v2/metric', payload);
      return response.data;
    } catch (error) {
      console.error('V2 Metric Error:', error);
      const message = this.formatErrorMessage(error);
      return {
        tk_status: 'NG',
        error: {
          code: 'API_ERROR',
          message,
        },
      };
    }
  }

  /**
   * List available metrics
   */
  async listMetrics(): Promise<MetricListResponse> {
    try {
      const response = await this.client.get<MetricListResponse>('/v2/metrics');
      return response.data;
    } catch (error) {
      console.error('List Metrics Error:', error);
      const message = this.formatErrorMessage(error);
      return {
        tk_status: 'NG',
        error: {
          code: 'API_ERROR',
          message,
        },
      };
    }
  }

  // ==================== METADATA MANAGEMENT ====================

  /**
   * Sync metadata from database
   */
  async syncMetadataFromDB(forceSync?: boolean): Promise<any> {
    try {
      const token = cookies.get('token');
      const response = await this.client.get('/v2/metadata/sync', {
        params: {
          token_string: token || undefined,
          forceSync: forceSync ? 'true' : 'false',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Metadata Sync Error:', error);
      const message = this.formatErrorMessage(error);
      return {
        tk_status: 'NG',
        error: {
          code: 'API_ERROR',
          message,
        },
      };
    }
  }

  /**
   * Get all tables from metadata
   */
  async getAllTables(): Promise<any> {
    try {
      const response = await this.client.get('/v2/metadata/tables');
      return response.data;
    } catch (error) {
      console.error('Get Tables Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Get columns for a table
   */
  async getTableColumns(tableName: string): Promise<any> {
    try {
      const response = await this.client.get(`/v2/metadata/columns/${tableName}`);
      return response.data;
    } catch (error) {
      console.error('Get Columns Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Get all relationships
   */
  async getRelationships(): Promise<any> {
    try {
      const response = await this.client.get('/v2/metadata/relationships');
      return response.data;
    } catch (error) {
      console.error('Get Relationships Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Add/Update table metadata
   */
  async saveTableMetadata(table: any): Promise<any> {
    try {
      const response = await this.client.post('/v2/metadata/tables', table);
      return response.data;
    } catch (error) {
      console.error('Save Table Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Add/Update column metadata
   */
  async saveColumnMetadata(column: any): Promise<any> {
    try {
      const response = await this.client.post('/v2/metadata/columns', column);
      return response.data;
    } catch (error) {
      console.error('Save Column Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Add/Update relationship
   */
  async saveRelationship(relationship: any): Promise<any> {
    try {
      const response = await this.client.post('/v2/metadata/relationships', relationship);
      return response.data;
    } catch (error) {
      console.error('Save Relationship Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Delete table metadata
   */
  async deleteTableMetadata(tableName: string): Promise<any> {
    try {
      const response = await this.client.delete(`/v2/metadata/tables/${encodeURIComponent(tableName)}`);
      return response.data;
    } catch (error) {
      console.error('Delete Table Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Delete column metadata
   */
  async deleteColumnMetadata(tableName: string, columnName: string): Promise<any> {
    try {
      const response = await this.client.delete(
        `/v2/metadata/columns/${encodeURIComponent(tableName)}/${encodeURIComponent(columnName)}`,
      );
      return response.data;
    } catch (error) {
      console.error('Delete Column Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Delete relationship metadata
   */
  async deleteRelationshipMetadata(
    sourceTable: string,
    sourceColumn: string,
    targetTable: string,
    targetColumn: string,
  ): Promise<any> {
    try {
      const response = await this.client.delete(
        `/v2/metadata/relationships/${encodeURIComponent(sourceTable)}/${encodeURIComponent(sourceColumn)}/${encodeURIComponent(targetTable)}/${encodeURIComponent(targetColumn)}`,
      );
      return response.data;
    } catch (error) {
      console.error('Delete Relationship Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Get business metrics metadata
   */
  async getMetricsMetadata(): Promise<any> {
    try {
      const response = await this.client.get('/v2/metadata/metrics');
      return response.data;
    } catch (error) {
      console.error('Get Metrics Metadata Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Add/Update business metric metadata
   */
  async saveMetricMetadata(metric: any): Promise<any> {
    try {
      const response = await this.client.post('/v2/metadata/metrics', metric);
      return response.data;
    } catch (error) {
      console.error('Save Metric Metadata Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Delete business metric metadata
   */
  async deleteMetricMetadata(metricId: string): Promise<any> {
    try {
      const response = await this.client.delete(`/v2/metadata/metrics/${encodeURIComponent(metricId)}`);
      return response.data;
    } catch (error) {
      console.error('Delete Metric Metadata Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Get glossary metadata
   */
  async getGlossaryMetadata(): Promise<any> {
    try {
      const response = await this.client.get('/v2/metadata/glossary');
      return response.data;
    } catch (error) {
      console.error('Get Glossary Metadata Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Add/Update glossary metadata entry
   */
  async saveGlossaryEntry(entry: any): Promise<any> {
    try {
      const response = await this.client.post('/v2/metadata/glossary', entry);
      return response.data;
    } catch (error) {
      console.error('Save Glossary Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Delete glossary metadata entry
   */
  async deleteGlossaryEntry(entryId: string): Promise<any> {
    try {
      const response = await this.client.delete(`/v2/metadata/glossary/${encodeURIComponent(entryId)}`);
      return response.data;
    } catch (error) {
      console.error('Delete Glossary Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  // ==================== BUSINESS TRAINING ====================

  /**
   * Get common query patterns for training
   */
  async getTrainingPatterns(): Promise<any> {
    try {
      const response = await this.client.get('/v2/training/patterns');
      return response.data;
    } catch (error) {
      console.error('Get Patterns Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Create a business rule
   */
  async createBusinessRule(rule: {
    name: string;
    condition: string;
    applies_to: string;
    result_field?: string;
    calculation?: string;
  }): Promise<any> {
    try {
      const response = await this.client.post('/v2/training/rule', rule);
      return response.data;
    } catch (error) {
      console.error('Create Rule Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Map business concept to SQL
   */
  async mapBusinessConcept(concept: {
    business_question: string;
    primary_metric: string;
    dimension: string;
    time_period?: string;
    filters?: any[];
  }): Promise<any> {
    try {
      const response = await this.client.post('/v2/training/concept', concept);
      return response.data;
    } catch (error) {
      console.error('Map Concept Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Get training examples
   */
  async getTrainingExamples(): Promise<any> {
    try {
      const response = await this.client.get('/v2/training/examples');
      return response.data;
    } catch (error) {
      console.error('Get Examples Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Delete training example
   */
  /**
   * Delete training example
   */
  async deleteTrainingExample(id: string): Promise<any> {
    try {
      const response = await this.client.delete(`/v2/training/examples/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete Example Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Clear embedding cache (manual invalidation)
   * Called when metadata changes to force refresh embeddings
   */
  async clearEmbeddingCache(): Promise<any> {
    try {
      const response = await this.client.post('/v2/cache/clear');
      return response.data;
    } catch (error) {
      console.error('Clear Cache Error:', error);
      return { tk_status: 'NG', error: { code: 'API_ERROR' } };
    }
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Update base URL
   */
  private formatErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        return (error.response.data as any).message || error.message || 'Unknown server error';
      }
      return error.message || 'Unknown axios error';
    }
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
    this.client.defaults.baseURL = baseURL;
  }
}

// Export singleton instance
let apiClient: V2ApiClient | null = null;

export function getV2ApiClient(baseURL?: string): V2ApiClient {
  if (!apiClient) {
    apiClient = new V2ApiClient(baseURL);
  }
  return apiClient;
}

export default V2ApiClient;
