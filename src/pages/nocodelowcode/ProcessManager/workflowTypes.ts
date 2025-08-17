import { Node, Edge } from 'reactflow';

export interface CustomNodeData {
  label: string;
  type: 'form' | 'page' | 'component' | 'decision' | 'start' | 'end';  // Có thể extend với types từ hệ thống hiện tại
  description?: string;
  // Thêm props như formId, pageId nếu tích hợp
}

export type CustomNode = Node<CustomNodeData>;

export type WorkflowState = {
  nodes: CustomNode[];
  edges: Edge[];
};