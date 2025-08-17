import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Edge } from 'reactflow';
import { CustomNode, WorkflowState } from '../../pages/nocodelowcode/ProcessManager/workflowTypes';

const initialState: WorkflowState = {
  nodes: [],
  edges: [],
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<CustomNode[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    addNode: (state, action: PayloadAction<CustomNode>) => {
      state.nodes.push(action.payload);
    },
    addEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload);
    },
    removeNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter((node) => node.id !== action.payload);
    },
    removeEdge: (state, action: PayloadAction<string>) => {
      state.edges = state.edges.filter((edge) => edge.id !== action.payload);
    },
    // Có thể thêm reducer để update, delete, v.v.
  },
});

export const { setNodes, setEdges, addNode, addEdge, removeNode, removeEdge } = workflowSlice.actions;
export default workflowSlice.reducer;