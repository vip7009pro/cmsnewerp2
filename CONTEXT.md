# ERP Chat & Semantic Engine - Task Context & Status

**Date**: March 30, 2026  
**Objective**: Implement ERPChat feature with database synchronization, semantic query engine, and real-time AI chat interface.

---

## 📋 Task Overview

Build a complete ERP Chat system that enables:
1. **AI-powered natural language queries** against ERP database
2. **Database metadata synchronization** (tables, columns, relationships)
3. **Visual metadata management** UI (add/edit tables, columns, relationships, business rules)
4. **Training data collection** for semantic query engine
5. **Session-based chat** with SQL generation and explanation

### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (React + TypeScript + Redux + MUI v7)              │
│  ├─ ERPChat.tsx (Main chat interface)                        │
│  ├─ SemanticEngineManager.tsx (Metadata management UI)       │
│  ├─ SemanticEngineManagerEnhanced.tsx (Enhanced version)     │
│  ├─ V2Api.ts (API client for /ai endpoints)                  │
│  └─ Api.ts (General API client)                              │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────▼──────────────────────────────────────┐
│  Backend (Node.js Express + SQL Server)                      │
│  ├─ routes/ai.js (V2 API endpoints)                          │
│  │  ├─ POST /ai/query (semantic query execution)             │
│  │  ├─ GET /ai/v2/metadata/sync (sync DB schema)             │
│  │  ├─ GET /ai/v2/metrics (list metrics)                     │
│  │  └─ More metadata endpoints                               │
│  ├─ semantic-query-engine/ (TypeScript)                      │
│  │  ├─ services/dbSyncService.ts|.js (DB metadata sync)      │
│  │  ├─ utils/logger.ts|.js (logging)                         │
│  │  ├─ core/ (query rewriting, retrieval, etc)               │
│  │  ├─ handlers/ (business metrics handlers)                 │
│  │  └─ metadata/ (JSON metadata storage)                     │
│  ├─ config/database.js (DB connection pooling)               │
│  ├─ middleware/auth.js (JWT token validation)                │
│  └─ services/ (shared business logic)                        │
└─────────────────────────────────────────────────────────────┘
         │
         │ MSSQL (SQL Server)
         ▼
    ERP Database
```

---

## 📁 Files Modified/Created (This Session)

### Backend Changes

#### 1. **practice1/middleware/auth.js**
**Status**: ✅ Modified  
**Purpose**: Token validation middleware for API requests  
**Changes**:
- Added support for token from:
  - `req.cookies.token` (cookie)
  - `req.body.DATA?.token_string` or `req.body.token_string` (POST body)
  - `req.query.token_string` or `req.query.token` (query params) **[NEW]**
  - `Authorization: Bearer <token>` header **[NEW]**
- Uses soft-fail approach: only logs error, still allows request to proceed to check `req.coloiko`

**Code Location**:
```javascript
// Line 19-36 in auth.js
const authHeader = req.headers['authorization'] || req.headers['Authorization'];
const queryToken = req.query?.token_string || req.query?.token;
let token = req.cookies.token || req.body.DATA?.token_string || req.body.token_string || queryToken;

if (!token && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
  token = authHeader.slice('Bearer '.length);
}
```

---

#### 2. **practice1/routes/ai.js**
**Status**: ⚠️ Partial (Module loading issue)  
**Purpose**: V2 API endpoint routing for semantic query engine  
**Key Endpoints**:
- `POST /ai/query` - Execute semantic or manual SQL query
- `GET /ai/v2/metadata/sync` - Sync database schema to metadata files
- `GET /ai/v2/metrics` - List available business metrics
- Other metadata management endpoints (tables, columns, relationships)

**DbSyncService Loading (Lines 676-710)**:
```javascript
const dbSyncPath = path.join(__dirname, '..', 'semantic-query-engine', 'services', 'dbSyncService');

try {
  // Try to load .js version directly
  DbSyncService = require(dbSyncPath).DbSyncService;
} catch (e) {
  // Fallback: use ts-node to load .ts version
  try {
    require('ts-node/register/transpile-only');
    DbSyncService = require(`${dbSyncPath}.ts`).DbSyncService;
  } catch (err) {
    return res.status(500).json({
      tk_status: 'NG',
      error: { code: 'SYNC_SERVICE_LOAD_FAILED', ... }
    });
  }
}
```

**Debug Logs Added**: Path resolution logs for troubleshooting module loading

---

#### 3. **practice1/semantic-query-engine/services/dbSyncService.js** ✨ NEW
**Status**: ✅ Created  
**Purpose**: Synchronize database schema with metadata JSON files  
**Main Methods**:
- `loadTablesFromDB()` - Query INFORMATION_SCHEMA for tables
- `loadColumnsFromDB(tableName)` - Get columns for specific table
- `loadAllColumnsFromDB()` - Load all table columns
- `detectRelationshipsFromDB()` - Extract foreign key relationships
- `syncMetadataFromDB()` - Main sync logic (merge DB schema with existing metadata)
- `saveMetadata(tables, columns, relationships)` - Persist to JSON files
- `guessFormat(dataType)` - Infer data format from SQL type
- `getRelationshipKey(rel)` - Create unique key for relationships

**Import Path**:
```javascript
const { openConnection } = require('../../config/database');
const { createLogger } = require('../utils/logger');
```

**Output**: Generates sync report with stats + returns merged metadata arrays

---

#### 4. **practice1/semantic-query-engine/utils/logger.js** ✨ NEW
**Status**: ✅ Created  
**Purpose**: Structured logging for semantic query engine  
**Main Methods**:
- `createLogger(component)` - Factory to create logger instance
- `debug(message, data)` - Debug level logs
- `info(message, data)` - Info level logs
- `warn(message, data)` - Warning level logs
- `error(message, error, data)` - Error level logs
- `profile(message, duration_ms, data)` - Performance profiling logs

**Log Levels**: DEBUG (0) < INFO (1) < WARN (2) < ERROR (3)  
**Environment**: Uses `LOG_LEVEL` env var and `NODE_ENV` to control verbosity

---

#### 5. **practice1/package.json**
**Status**: ✅ Modified  
**Changes**:
- Added `ts-node: ^10.9.1` to devDependencies for TypeScript runtime execution

---

### Frontend Changes

#### 1. **cmsnewerp2/src/api/V2Api.ts**
**Status**: ✅ Modified  
**Purpose**: V2 API client for `/ai` endpoints with semantic query support  
**Key Changes**:
- Added import: `import Cookies from 'universal-cookie';`
- Constructor now auto-sets auth token from cookie:
  ```typescript
  const token = cookies.get('token');
  if (token) {
    this.setAuthToken(token);
  }
  ```
- Updated `syncMetadataFromDB()` to pass token in query params:
  ```typescript
  async syncMetadataFromDB(): Promise<any> {
    const token = cookies.get('token');
    const response = await this.client.get('/v2/metadata/sync', {
      params: { token_string: token || undefined }
    });
  }
  ```

**All Methods**:
- `aiV2Query(request)` - Execute semantic query
- `aiV2Metric(request)` - Query specific metric
- `listMetrics()` - Get all available metrics
- `syncMetadataFromDB()` - Trigger DB sync
- `getAllTables()`, `getTableColumns()`, `getRelationships()` - Metadata retrieval
- `saveTableMetadata()`, `saveColumnMetadata()`, `saveRelationship()` - Metadata updates
- `createBusinessRule()`, `mapBusinessConcept()` - Training data
- `getTrainingPatterns()`, `getTrainingExamples()`, `deleteTrainingExample()` - Training management

---

#### 2. **cmsnewerp2/src/components/SemanticEngineManagerEnhanced.tsx**
**Status**: ✅ Modified  
**Purpose**: Enhanced metadata management UI with tabs for visual schema editing  
**Key Changes**:
- Added import: `import Cookies from 'universal-cookie';`
- URL resolution logic:
  ```typescript
  const totalState = useSelector((state: any) => state.totalSlice || {});
  const serverUrlFromRedux = totalState?.server_ip || '';
  const serverUrlFromApi = getSever() || '';
  const serverUrl = serverUrlFromRedux || serverUrlFromApi || '';
  const apiBaseUrl = serverUrl ? `${serverUrl.replace(/\/$/, '')}/ai` : '/ai';
  ```
- useEffect now:
  1. Sets API base URL
  2. Auto-sets Authorization token from cookie
  3. Logs debugging info

**Tabs**:
- **Metadata Management**: Tables, columns, relationships (CRUD operations)
- **Business Training**: Rules, concepts, patterns, examples
- **Debug Info**: Displays current configuration and state

**Key Functions**:
- `loadMetadata()` - Fetch tables & relationships
- `loadTrainingData()` - Fetch patterns & examples
- `handleSyncFromDB()` - Trigger sync endpoint
- `handleLoadTableColumns()` - Load columns for selected table
- `handleSaveTable()`, `handleSaveColumn()`, `handleSaveRelationship()` - Save metadata
- `handleCreateRule()`, `handleCreateConcept()` - Train semantic engine
- `handleDeleteExample()` - Remove training example

---

#### 3. **cmsnewerp2/src/components/SemanticEngineManager.tsx**
**Status**: ✅ Referenced  
**Purpose**: Original semantic manager (Enhanced version used instead)  
**Note**: Enhanced version contains same logic with better organization

---

#### 4. **cmsnewerp2/src/api/Api.ts**
**Status**: ✅ Verified (No changes this session)  
**Purpose**: General API client for `/api` endpoints  
**Helper Functions Used**:
- `getSever()` - Get backend URL from Redux `totalSlice.server_ip`
- `aiQuery()` - Send query to `/ai/query` endpoint
- `aiExecuteSql()` - Execute manual SQL via `/ai/query`

---

## 🔄 Request Flow

### Scenario: User clicks "Sync from Database"

```
Frontend (SemanticEngineManagerEnhanced.tsx)
    ↓
handleSyncFromDB()
    ↓
Set apiBaseUrl from Redux/getSever()
v2Api.setBaseURL(apiBaseUrl)
v2Api.setAuthToken(cookies.get('token'))
    ↓
v2Api.syncMetadataFromDB()
    ├─ GET /v2/metadata/sync
    ├─ Query param: ?token_string=<token>
    └─ Header Authorization: Bearer <token>
    ↓
Backend (routes/ai.js - GET /v2/metadata/sync)
    ↓
checkLoginIndex middleware
    ├─ Extract token from query/cookie/header
    └─ Validate JWT
    ↓
DbSyncService.syncMetadataFromDB()
    ├─ loadTablesFromDB() → Query INFORMATION_SCHEMA
    ├─ loadAllColumnsFromDB() → Get all columns
    ├─ detectRelationshipsFromDB() → Extract FK relationships
    ├─ Merge with existing metadata JSON
    └─ Return syncReport
    ↓
Save to metadata files
    ├─ /semantic-query-engine/metadata/tables.json
    ├─ /semantic-query-engine/metadata/columns.json
    └─ /semantic-query-engine/metadata/relationships.json
    ↓
Return to Frontend
    ├─ tk_status: 'OK'
    └─ syncReport: { tables: {...}, columns: {...}, relationships: {...} }
```

---

## ⚠️ Current Issues & Status

### Issue 1: Module Resolution in DbSyncService Loading
**Status**: 🔴 BLOCKING  
**Description**:
- Route `/ai/v2/metadata/sync` attempts to load `DbSyncService`
- First try (JS): `require('../semantic-query-engine/services/dbSyncService')` → NOT FOUND
- Fallback (TS): `require('ts-node/register/transpile-only')` + require .ts → TYPESCRIPT COMPILE ERROR
- Error: `TS7016: Could not find a declaration file for module '../../config/database'`

**Root Cause**:
- `dbSyncService.ts` imports from JS file (`config/database.js`) without type declarations
- ts-node type-checking (even with transpileOnly) fails on missing @types
- Solution: Use `.js` version created OR fix TS imports

**Files Created as Workaround**:
- ✅ `practice1/semantic-query-engine/services/dbSyncService.js` - Pure JS version (works manually)
- ✅ `practice1/semantic-query-engine/utils/logger.js` - Pure JS version (works manually)

**Manual Verification**:
```bash
node -e "const p=require('path'); const f=p.join(process.cwd(),'semantic-query-engine','services','dbSyncService'); const m=require(f); console.log('loaded', typeof m.DbSyncService);"
# Output: loaded function ✓
```

---

### Issue 2: Token Not Reaching Endpoint
**Status**: ⚠️ IN PROGRESS  
**Description**:
- Frontend sends token via query param: `?token_string=...`
- Backend middleware `checkLoginIndex` checks:
  - `req.cookies.token` (cookie)
  - `req.body.token_string` (POST body)
  - `req.query.token_string` (query param) **[ADDED]**
  - `Authorization: Bearer ...` header **[ADDED]**
- But route still fails before reaching sync logic due to module load error

**Next Step**: Once module issue fixed, verify token flows correctly to endpoint

---

### Issue 3: Geo-Blocking in index.js
**Status**: 🟡 KNOWN  
**Description**:
- `index.js` has geo-IP filter that blocks non-Vietnam IPs
- Error: `Access denied: country not allowed`
- Must login from VN IP or disable geo block for testing

**Location**: `practice1/index.js` lines ~28-38

---

## 📊 Database Schema Info

**Target**: SQL Server  
**Tables Available**: 266 tables detected  
**Columns**: 4,556 columns loaded  
**Relationships**: 182 foreign key relationships discovered

**Sample Tables**:
- `dbo.AMAZONE_DATA` (16 cols, 0 relationships)
- `dbo.ANHNV` (2 cols, employee photos)
- Many more ERP tables (products, inventory, HR, etc.)

---

## 🎯 Next Steps (Priority Order)

### Immediate (Blocking)
1. **Fix Module Resolution**:
   - Ensure `dbSyncService.js` loads successfully from route
   - Option A: Use JS version (already created) and verify route picks it up
   - Option B: Fix TS compilation in ts-node by adding tsconfig compiler options
   - Recommended: Add compile step to build `.js` output explicitly

2. **Test Sync Endpoint**:
   - Call `GET /ai/v2/metadata/sync` with valid token
   - Verify sync report returns with tables/columns/relationships
   - Check metadata JSON files are created

3. **Verify Token Flow**:
   - Ensure token reaches endpoint successfully
   - Confirm `req.coloiko` is not 'coloi' (access denied)

### Short-term (Next Session)
4. **Query Execution**:
   - Test `POST /ai/query` with semantic questions
   - Verify SQL generation and execution
   - Confirm results return to frontend

5. **Frontend Integration**:
   - Test "Sync from Database" button in UI
   - Verify metadata loads into Redux/component state
   - Test CRUD operations for tables/columns

6. **Error Handling**:
   - Add comprehensive error messages
   - Implement retry logic for failed sync
   - Add progress indicators

### Medium-term
7. **Training Data Collection**:
   - Implement business rule creation UI
   - Implement concept mapping UI
   - Test training data persistence

8. **Chat History**:
   - Persist chat messages to database
   - Implement session management
   - Add chat summary generation

---

## 🔑 Important Configuration

### Environment Variables
```bash
# Backend (.env or outbinary/.ENV)
API_PORT=3007                    # Express HTTP port
SOCKET_PORT=3006                 # Socket.IO HTTPS port
AI_SQL_DEBUG=0|1                 # Enable SQL debug logs
LOG_LEVEL=DEBUG|INFO|WARN|ERROR  # Logger verbosity
NODE_ENV=development|production
```

### Redux Store Structure
```typescript
totalSlice: {
  server_ip: string;             // Backend base URL (e.g., http://127.0.0.1:3001)
  userData: UserData;
  globalSocket: Socket;
  // ... other state
}
```

### Frontend Cookie
```javascript
// Token stored in cookie 'token'
cookies.get('token')  // Used by V2Api and middleware
```

---

## 📚 Key Dependencies

### Backend
- **express**: HTTP server
- **mssql**: SQL Server driver
- **jsonwebtoken**: JWT token auth
- **ts-node**: TypeScript runtime (fallback)
- **axios**: HTTP client for internal calls

### Frontend
- **react**: UI framework
- **typescript**: Type safety
- **redux**: State management
- **@mui/material**: MUI v7 component library
- **axios**: HTTP client
- **universal-cookie**: Cookie management
- **xlsx**: Excel export

---

## 📞 Debugging Tips

### Module Loading Issues
```bash
# Test direct require
node -e "require('./semantic-query-engine/services/dbSyncService')"

# Check file existence
ls -la semantic-query-engine/services/dbSyncService.*
# Should show: dbSyncService.js, dbSyncService.ts
```

### Token Issues
```bash
# Check backend logs for token validation
pm2 logs index | grep "Auth Error"

# Test endpoint with token in different formats
curl "http://127.0.0.1:3007/ai/v2/metadata/sync?token_string=xxx"
curl -H "Authorization: Bearer xxx" "http://127.0.0.1:3007/ai/v2/metadata/sync"
```

### Geo-Blocking
```bash
# In production, disable geo-blocking or add VN IP to whitelist
# Edit practice1/index.js line 28: allowCountries = ['VN']
```

---

## 📌 File Manifest

### Backend Files
| File | Status | Purpose |
|------|--------|---------|
| `practice1/routes/ai.js` | ✅ Modified | V2 API endpoint routing |
| `practice1/middleware/auth.js` | ✅ Modified | Token validation (enhanced) |
| `practice1/semantic-query-engine/services/dbSyncService.js` | ✨ NEW | DB->metadata sync (JS) |
| `practice1/semantic-query-engine/services/dbSyncService.ts` | 📋 Existing | DB->metadata sync (TS source) |
| `practice1/semantic-query-engine/utils/logger.js` | ✨ NEW | Logging utility (JS) |
| `practice1/semantic-query-engine/utils/logger.ts` | 📋 Existing | Logging utility (TS source) |
| `practice1/package.json` | ✅ Modified | Added ts-node devDependency |

### Frontend Files
| File | Status | Purpose |
|------|--------|---------|
| `cmsnewerp2/src/api/V2Api.ts` | ✅ Modified | V2 API client (enhanced) |
| `cmsnewerp2/src/api/Api.ts` | ✅ Verified | General API client |
| `cmsnewerp2/src/components/SemanticEngineManagerEnhanced.tsx` | ✅ Modified | Metadata UI (enhanced) |
| `cmsnewerp2/src/components/SemanticEngineManager.tsx` | 📋 Existing | Metadata UI (original) |
| `cmsnewerp2/src/pages/nocodelowcode/AI/ERPChat.tsx` | 📋 Existing | Main chat interface |

---

## 🚀 Quick Start (Next Session)

1. **Backend Setup**:
   ```bash
   cd practice1
   npm install                    # ts-node already in devDependencies
   npm run start                  # Start with pm2
   pm2 logs index | grep V2_API   # Watch for sync endpoint logs
   ```

2. **Test Sync Endpoint**:
   ```bash
   # With valid token (get from login)
   curl -H "Authorization: Bearer <token>" \
     "http://127.0.0.1:3007/ai/v2/metadata/sync"
   ```

3. **Frontend**:
   - Open browser to ERPChat page
   - Ensure logged in (token in cookie)
   - Click "Sync from Database"
   - Watch browser console + backend logs

4. **Check Metadata**:
   ```bash
   ls -la practice1/semantic-query-engine/metadata/
   # Should show: tables.json, columns.json, relationships.json
   ```

---

**Version**: v0.2-alpha (session 2 of N)  
**Last Updated**: 2026-03-30 08:54:00  
**Status**: Module loading issue BLOCKING - needs immediate attention in next session
