import { useCallback } from 'react';
import ReactFlow, { addEdge, useEdgesState, useNodesState } from 'reactflow'; 
import 'reactflow/dist/style.css';
 
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  { id: '3', position: { x: 0, y: 200 }, data: { label: '3' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
export default function FlowChart() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback(
    (params:any) => setEdges((eds:any) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '500px', height: '500px' , backgroundColor:'white'}}>
       <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesDelete={()=> {console.log('Node deleted !')}}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  );
}