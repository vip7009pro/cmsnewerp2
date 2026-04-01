# Frontend Prompt Display Feature

## Overview
Added the ability to display SQL generation prompts on the frontend UI so users can copy and test them with external LLMs (ChatGPT, Claude, etc.).

## Implementation Details

### 1. Type Definition Update
**File**: [src/pages/nocodelowcode/AI/ERPChatV2.tsx](src/pages/nocodelowcode/AI/ERPChatV2.tsx#L36)

Added `prompt?: string;` field to `ChatMessage` type:
```typescript
type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
  sql?: string;
  prompt?: string;  // ← NEW: Stores SQL generation prompt
  rows?: any[];
  error?: string;
  pipeline_steps?: PipelineStep[];
  debug_info?: any;
};
```

### 2. Backend Response Processing
**File**: [src/pages/nocodelowcode/AI/ERPChatV2.tsx](src/pages/nocodelowcode/AI/ERPChatV2.tsx#L300-L312)

Modified the `send()` function to extract `sql_generation_prompt` from the backend response:
```typescript
const out = resp.data;
setMessages((prev) => [
  ...prev,
  {
    role: 'assistant',
    text: out?.explanation ? String(out.explanation) : 'Đã truy vấn dữ liệu ERP.',
    sql: out?.sql ? String(out.sql) : '',
    prompt: out?.sql_generation_prompt ? String(out?.sql_generation_prompt) : undefined,
    // ... other fields
  },
]);
```

### 3. State Management
**File**: [src/pages/nocodelowcode/AI/ERPChatV2.tsx](src/pages/nocodelowcode/AI/ERPChatV2.tsx#L405)

Added `lastPrompt` useMemo hook to extract latest prompt from messages:
```typescript
const lastPrompt = useMemo(() => lastAssistantMsg?.prompt || '', [lastAssistantMsg]);
```

### 4. UI Component
**File**: [src/pages/nocodelowcode/AI/ERPChatV2.tsx](src/pages/nocodelowcode/AI/ERPChatV2.tsx#L595-L630)

Added a new section in the Pipeline Debug tab to display the prompt:

**Features**:
- **Visibility**: Only displays when `lastPrompt` is available (non-empty)
- **Styling**: 
  - Yellow background (`#fef8e7`) to distinguish from other debug info
  - Monospace font for code readability
  - Max height 300px with scrolling for long prompts
  - Word breaking enabled for proper text wrapping
- **Copy Button**: 
  - Uses `navigator.clipboard.writeText()` API
  - Copies entire prompt to clipboard
  - Includes error handling
  - Tooltip: "Copy Prompt to Clipboard"
- **Label**: "💬 SQL Generation Prompt"
- **Description**: "Dùng prompt này để test với LLM bên ngoài (ChatGPT, Claude, etc.)"
  - Translates to: "Use this prompt to test with external LLMs (ChatGPT, Claude, etc.)"

### 5. UI Placement
Located in the right panel under the Pipeline Debug tab:
1. Pipeline Steps visualization (8-step breakdown)
2. Raw Debug Info (JSON format)
3. **SQL Generation Prompt** ← NEW (yellow section with copy button)

## Backend Integration

The backend (Node.js) returns `sql_generation_prompt` in the AI query response:

```typescript
// Response structure from backend (routes/ai.js)
{
  tk_status: 'OK',
  data: {
    sql: string;
    sql_generation_prompt: string;  // ← Backend provides this
    data: any[];  // query results
    explanation: string;
    chat_summary: string;
    execution_time_ms: number;
    attempts: number;
  }
}
```

## User Workflow

1. User asks a question in the chat (e.g., "Top sản phẩm bán chạy tháng này")
2. System processes through 8-step pipeline and generates SQL
3. Response displays in:
   - **Left panel**: Chat message with results/SQL
   - **Right panel - Pipeline Debug tab**:
     - 8 step breakdown with timing
     - Raw debug info
     - **SQL Generation Prompt** (NEW) with Copy button
4. User can:
   - Read and understand the generated prompt
   - Click "📋 Copy" to copy entire prompt
   - Paste into ChatGPT, Claude, or other LLM for external testing
   - Refine or adjust the prompt for their needs

## Testing

### Manual Testing Steps

1. Open ERP Chat V2 interface
2. Ask a question in Vietnamese (e.g., "Lịch sử giao hàng 2026")
3. After response appears, check the "🔍 Pipeline Debug" tab (right panel)
4. Scroll down in the Pipeline Debug tab to see the new yellow section:
   - **💬 SQL Generation Prompt**
   - Contains full prompt text used to generate the SQL
   - Includes a "📋 Copy" button
5. Click "Copy" button
6. Paste elsewhere to verify it copies correctly
7. Test with external LLM (ChatGPT, Claude, etc.)

### Verification Checklist

- ✅ TypeScript compilation: No errors
- ✅ ChatMessage type includes `prompt` field
- ✅ Backend response data.sql_generation_prompt extracted correctly
- ✅ Prompt displays only when available
- ✅ Copy button functionality working
- ✅ Styling consistent with other debug sections
- ✅ Vietnamese UI text correct

## Benefits

1. **Transparency**: Users can see exactly what prompt was sent to the LLM
2. **Debugging**: Helps identify if prompt generation is correct
3. **External Testing**: Allows users to test with their own LLM instances
4. **Prompt Refinement**: Users can copy and modify prompts for different results
5. **Learning**: Helps users understand how natural language translates to SQL generation

## Notes

- Prompt display is conditional: only shows when `p.sql_generation_prompt` is available
- Copy uses modern Clipboard API with try-catch error handling
- Monospace font (via CSS classes or inline) for better code formatting
- Section appears after raw debug info in Pipeline Debug tab
- Works with all LLM-based SQL generation scenarios

## Future Enhancements

1. Add toast notification when copy succeeds
2. Add "Run in ChatGPT" button to open new ChatGPT tab with prompt pre-filled
3. Add history of generated prompts
4. Add prompt editing and regeneration capability
5. Add syntax highlighting for better readability
6. Add export prompts as text/markdown file

## Files Modified

- `src/pages/nocodelowcode/AI/ERPChatV2.tsx` (3 changes):
  1. ChatMessage type definition
  2. send() function response processing
  3. lastPrompt useMemo hook
  4. UI section for prompt display (new section in Pipeline Debug tab)

## Version

- **Date**: 2024
- **Related Features**: 
  - Hybrid semantic search (keyword + vector embeddings)
  - 8-step SQL generation pipeline
  - Real-time debugging with pipeline steps visibility
