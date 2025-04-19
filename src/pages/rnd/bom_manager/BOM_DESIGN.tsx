import React, { useCallback, useRef, useState, useEffect, createContext, useContext } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Node,
  Edge,
  Connection,
  ReactFlowInstance,
  Handle,
  Position,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './BOM_DESIGN.scss';

interface Machine {
  id: string;
  name: string;
}
interface Material {
  id: string;
  name: string;
  isMain: 1 | 0; // 1: liệu chính, 0: liệu phụ
}
interface CustomNodeData {
  label: string;
  isMain?: 1 | 0;
}
type CustomNode = Node<CustomNodeData>;
type CustomEdge = Edge;

interface BOMDesignProps {
  initialNodes?: CustomNode[];
  initialEdges?: CustomEdge[];
}

interface BOMDesignContextProps {
  setEdges: React.Dispatch<React.SetStateAction<CustomEdge[]>>;
  isDraggingMaterial: boolean;
  edges: CustomEdge[];
}
const BOMDesignContext = createContext<BOMDesignContextProps>({
  setEdges: () => {},
  isDraggingMaterial: false,
  edges: [],
});

const machines = [
  { id: 'machine1', name: 'FR' },
  { id: 'machine2', name: 'ED' },
  { id: 'machine3', name: 'SR' },
  { id: 'machine4', name: 'DC' },
  { id: 'machine5', name: 'LAMI' },
  { id: 'machine6', name: 'SHEET CUTTER' },
  { id: 'machine7', name: 'SLITTER' },
];
const materials: Material[] = [
  { id: 'mat1', name: 'SJ-203020HC', isMain: 1 },
  { id: 'mat2', name: 'ST-8555', isMain: 0 },
  { id: 'mat3', name: 'SJ-093GD', isMain: 0 },
];

const nodeTypes = {
  machine: ({ data }: { data: CustomNodeData }) => (
    <div className="node-machine" style={{ position: 'relative', padding: 16, background: '#e0e7ff', borderRadius: 6, minWidth: 100 }}>
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Right} style={{ background: '#6366f1' }} />
    </div>
  ),
  material: ({ data }: { data: CustomNodeData & { isMain?: 1 | 0 } }) => {
    const isMain = data.isMain === 1;
    return (
      <div
        className="node-material"
        style={{
          position: 'relative',
          padding: 12,
          background: isMain ? '#d1fae5' : '#fef9c3',
          borderRadius: 6,
          minWidth: 80,
          border: isMain ? '2px solid #059669' : '1px solid #b45309',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {/* Badge icon */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: isMain ? '#059669' : '#b45309',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            marginRight: 4,
          }}
          title={isMain ? 'Liệu chính' : 'Liệu phụ'}
        >
          {isMain ? '⭐' : '⚪'}
        </span>
        <span
          style={{
            color: isMain ? '#047857' : '#92400e',
            fontWeight: isMain ? 700 : 400,
          }}
        >
          {data.label}
        </span>
        <Handle type="source" position={Position.Right} style={{ background: isMain ? '#059669' : '#b45309' }} />
      </div>
    );
  },
  output: ({ data, id }: { data: CustomNodeData; id: string }) => {
    const { isDraggingMaterial, setEdges, edges } = useContext(BOMDesignContext);
    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation(); // Ngăn không cho onDrop của canvas chạy, tránh tạo node vật liệu thừa
      const dataTransfer = e.dataTransfer.getData('application/reactflow');
      if (dataTransfer) {
        const { nodeType, nodeName } = JSON.parse(dataTransfer);
        if (nodeType === 'material') {
          setEdges((eds: CustomEdge[]) =>
            eds.map((ed: CustomEdge) =>
              ed.target === id && ed.type === 'customLabel'
                ? { ...ed, label: nodeName }
                : ed
            )
          );
        }
      }
    };
    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    return (
      <div
        className="node-output"
        onDrop={onDrop}
        onDragOver={onDragOver}
        style={{
          position: 'relative',
          padding: 12,
          background: isDraggingMaterial ? '#fca5a5' : '#fca5a5',
          borderRadius: 6,
          minWidth: 80,
          border: isDraggingMaterial ? '3px solid #ef4444' : '2px solid #b91c1c',
          boxShadow: isDraggingMaterial ? '0 0 16px #ef4444' : undefined,
          transition: 'border 0.2s, box-shadow 0.2s',
        }}
        title="Kéo vật liệu vào đây để chọn vật liệu ra ngoài"
      >
        <span>{data.label}</span>
        <Handle type="target" position={Position.Left} style={{ background: '#b91c1c' }} />
      </div>
    );
  },
  product: ({ data }: { data: CustomNodeData }) => (
    <div className="node-product" style={{ position: 'relative', padding: 16, background: '#bbf7d0', borderRadius: 6, minWidth: 120, border: '2px solid #22c55e' }}>
      <Handle type="target" position={Position.Left} style={{ background: '#22c55e' }} />
      <strong>{data.label}</strong>
    </div>
  ),
};

import type { EdgeProps } from 'reactflow';
const DefaultEdge = ({ id, sourceX, sourceY, targetX, targetY, markerEnd, style = {} }: EdgeProps) => (
  <path
    id={id}
    style={style}
    className="react-flow__edge-path"
    d={`M${sourceX},${sourceY}C${sourceX},${sourceY} ${targetX},${targetY} ${targetX},${targetY}`}
    markerEnd={markerEnd}
  />
);

const BOM_DESIGN: React.FC<BOMDesignProps> = ({ initialNodes, initialEdges }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>(initialNodes as CustomNode[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>(initialEdges as CustomEdge[]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<CustomNode[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<CustomEdge[]>([]);
  const [showJson, setShowJson] = useState(false);
  const [jsonData, setJsonData] = useState('');
  const [isDraggingMaterial, setIsDraggingMaterial] = useState(false);

  const handleSave = () => {
    // nodes: chuyển về object phẳng, lấy label/isMain từ node.data
    const nodesJson = nodes.map(n => ({
      id: n.id,
      type: n.type,
      label: n.data?.label,
      isMain: n.data?.isMain ?? null,
      positionX: n.position?.x,
      positionY: n.position?.y
    }));

    // edges: chuyển về object phẳng
    const edgesJson = edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label ?? null,
      style: e.style ? JSON.stringify(e.style) : null,
    }));

    setJsonData(JSON.stringify({ nodes: nodesJson, edges: edgesJson }, null, 2));
    setShowJson(true);
  };

  useEffect(() => {
    if ((!initialNodes || initialNodes.length === 0) && (!initialEdges || initialEdges.length === 0)) {
      let nodes: CustomNode[] = [];
      let edges: CustomEdge[] = [];
      let currentMaterials = materials.map(m => m.id);

      // Node vật liệu đầu vào
      materials.forEach((mat, idx) => {
        nodes.push({
          id: mat.id,
          type: 'material',
          position: { x: 0, y: 100 + idx * 100 },
          data: { label: mat.name, isMain: mat.isMain },
        });
      });

      // Qua từng máy
      machines.forEach((machine, idx) => {
        nodes.push({
          id: machine.id,
          type: 'machine',
          position: { x: 300 + idx * 300, y: 200 },
          data: { label: machine.name },
        });

        // Edge vật liệu vào máy này
        currentMaterials.forEach(matId => {
          if (idx === 0) {
            edges.push({ id: `e-in-${matId}`, source: matId, target: machine.id, style: { stroke: '#2563eb', strokeWidth: 2 } });
          } else {
            edges.push({ id: `e-${machines[idx-1].id}-${machine.id}-${matId}`, source: machines[idx-1].id, target: machine.id, style: { stroke: '#2563eb', strokeWidth: 2 } });
          }
        });

        // Nếu không phải máy cuối cùng thì chọn vật liệu đi ra ngoài
        if (idx < machines.length - 1) {
          // Tạo node output nếu chưa có
          if (!nodes.find(n => n.id === `output-${machine.id}`)) {
            nodes.push({
              id: `output-${machine.id}`,
              type: 'output',
              position: { x: 300 + idx * 300, y: 400 },
              data: { label: 'Ra ngoài' },
            });
          }
          // Edge ra ngoài, label để trống
          edges.push({
            id: `e-out-${machine.id}`,
            source: machine.id,
            target: `output-${machine.id}`,
            label: '', // label ban đầu trống
            style: { stroke: '#ef4444', strokeWidth: 3 },
            type: 'customLabel',
          });
        }
      });

      // Sau máy cuối cùng, các vật liệu còn lại nối đến node Hàng thành phẩm
      if (currentMaterials.length > 0) {
        if (!nodes.find(n => n.id === 'product')) {
          nodes.push({
            id: 'product',
            type: 'product',
            position: { x: 300 + machines.length * 300, y: 200 },
            data: { label: 'Hàng thành phẩm' },
          });
        }
        const label = currentMaterials.map(id => materials.find(m => m.id === id)?.name).filter(Boolean).join(', ');
        edges.push({
          id: `e-to-product`,
          source: machines[machines.length-1].id,
          target: 'product',
          label,
          style: { stroke: '#22c55e', strokeWidth: 3 },
        });
      }

      setNodes(nodes);
      setEdges(edges);
    }
  }, [initialNodes, initialEdges]);

  // --- BẮT ĐẦU CHỈNH SỬA LẠI: Tự động cập nhật label vật liệu còn lại trên cạnh nối tới Hàng thành phẩm ---
  useEffect(() => {
    if (!edges || !materials) return;
    // Lấy danh sách id vật liệu đã ra ngoài từ các edge customLabel nối tới output
    const outMaterialNames = edges
      .filter(e => e.type === 'customLabel' && e.target && e.target.startsWith('output-') && e.label)
      .map(e => e.label);
    // Lấy danh sách vật liệu còn lại dựa trên name (nếu label là name)
    const remainingMaterials = materials
      .filter(m => !outMaterialNames.includes(m.name))
      .map(m => m.name);
    // Tìm edge nối tới Hàng thành phẩm (tìm theo target là 'product' thay vì id cố định)
    setEdges(eds => eds.map(e =>
      e.target === 'product'
        ? { ...e, label: remainingMaterials.join(', ') }
        : e
    ));
  }, [edges, materials]);
  // --- KẾT THÚC CHỈNH SỬA LẠI ---

  // Xử lý kéo thả từ sidebar vào canvas
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, nodeName: string, nodeId?: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, nodeName, nodeId }));
    event.dataTransfer.effectAllowed = 'move';
    if (nodeType === 'material') setIsDraggingMaterial(true);
  };
  const onDragEnd = () => setIsDraggingMaterial(false);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !reactFlowInstance) return;
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const data = JSON.parse(event.dataTransfer.getData('application/reactflow')) as { nodeType: string; nodeName: string; nodeId?: string };
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode: CustomNode = {
        id: `${data.nodeType}_${+new Date()}`,
        type: data.nodeType,
        position,
        data: { label: data.nodeName },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  // Xóa node hoặc edge khi người dùng nhấn Delete/Backspace
  const onNodesDelete = useCallback((deleted: CustomNode[]) => {
    setNodes((nds) => nds.filter((n) => !deleted.some((d) => d.id === n.id)));
    setEdges((eds) => eds.filter((e) => !deleted.some((d) => e.source === d.id || e.target === d.id)));
  }, [setNodes, setEdges]);

  const onEdgesDelete = useCallback((deleted: CustomEdge[]) => {
    setEdges((eds) => eds.filter((e) => !deleted.some((d) => d.id === e.id)));
  }, [setEdges]);

  // Lắng nghe cả phím Delete (46) và Backspace (8)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'Delete' || event.key === 'Backspace') && (selectedNodes.length > 0 || selectedEdges.length > 0)) {
        if (selectedNodes.length > 0) {
          onNodesDelete(selectedNodes);
        }
        if (selectedEdges.length > 0) {
          onEdgesDelete(selectedEdges);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodes, selectedEdges, onNodesDelete, onEdgesDelete]);

  return (
    <div className="bomdesign-container" style={{ display: 'flex', height: '100vh', position: 'relative' }}>
      {/* Nút Save ở góc phải */}
      <div style={{ position: 'absolute', top: 16, right: 32, zIndex: 10 }}>
        <button
          onClick={handleSave}
          style={{
            padding: '8px 18px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
          }}
        >
          Save
        </button>
      </div>
      {/* Sidebar */}
      <div
        className="bomdesign-sidebar"
        style={{
          width: 240,
          padding: 16,
          background: '#f4f4f4',
          height: '85vh', // Chiều cao cố định theo màn hình
          overflowY: 'auto', // Cho phép scroll dọc khi tràn
          boxSizing: 'border-box'
        }}
      >
        <h4>Danh sách Máy</h4>
        {machines.map((m) => (
          <div
            key={m.id}
            className="sidebar-item machine"
            draggable
            onDragStart={(e) => onDragStart(e, 'machine', m.name)}
            style={{ marginBottom: 8, padding: 8, background: '#e0e7ff', borderRadius: 4, cursor: 'grab' }}
          >
            {m.name}
          </div>
        ))}
        <h4>Danh sách Vật liệu</h4>
        {materials.map((mat) => (
          <div
            key={mat.id}
            className="sidebar-item material"
            draggable
            onDragStart={(e) => onDragStart(e, 'material', mat.name, mat.id)}
            onDragEnd={onDragEnd}
            style={{
              marginBottom: 8,
              padding: 8,
              background: mat.isMain ? '#d1fae5' : '#fef9c3',
              borderRadius: 4,
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: mat.isMain ? '#059669' : '#b45309',
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                marginRight: 4,
              }}
              title={mat.isMain ? 'Liệu chính' : 'Liệu phụ'}
            >
              {mat.isMain ? '⭐' : '⚪'}
            </span>
            {mat.name}
          </div>
        ))}
        {/* Thêm đối tượng kéo thả "Ra ngoài" và "Hàng thành phẩm" */}
        <div style={{ marginTop: 16 }}>
          <h4>Đối tượng đặc biệt</h4>
          <div
            className="sidebar-item output"
            draggable
            onDragStart={(e) => onDragStart(e, 'output', 'Ra ngoài')}
            style={{ marginBottom: 8, padding: 8, background: '#fca5a5', borderRadius: 4, cursor: 'grab' }}
          >
            Ra ngoài
          </div>
          <div
            className="sidebar-item product"
            draggable
            onDragStart={(e) => onDragStart(e, 'product', 'Hàng thành phẩm')}
            style={{ marginBottom: 8, padding: 8, background: '#bbf7d0', borderRadius: 4, cursor: 'grab', border: '2px solid #22c55e' }}
          >
            Hàng thành phẩm
          </div>
        </div>
      </div>
      {/* Main Canvas */}
      <BOMDesignContext.Provider value={{ setEdges, isDraggingMaterial, edges }}>
        <div className="bomdesign-canvas" ref={reactFlowWrapper} style={{ flex: 1, height: '100%' }}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={(params) => setEdges((eds) => addEdge({ ...params, type: params.target?.startsWith('output') ? 'customLabel' : 'default' }, eds))}
              nodeTypes={nodeTypes}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              elementsSelectable={true}
              selectNodesOnDrag={true}
              multiSelectionKeyCode={['Shift','Meta','Control']}
              selectionOnDrag={false}
              panOnDrag={true}
              panOnScroll={false}
              zoomOnScroll={true}
              zoomOnPinch={true}
              zoomOnDoubleClick={true}
              minZoom={0.2}
              maxZoom={2}              
              snapToGrid={true}
              snapGrid={[10, 10]}
              onlyRenderVisibleElements={false}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              attributionPosition="bottom-right"
              onNodesDelete={onNodesDelete}
              onEdgesDelete={onEdgesDelete}
              onSelectionChange={(sel) => {
                setSelectedNodes(sel?.nodes ?? []);
                setSelectedEdges(sel?.edges ?? []);
              }}
              edgeTypes={{
                default: DefaultEdge,
                customLabel: (edgeProps) => (
                  <>
                    <DefaultEdge {...edgeProps} />
                    {edgeProps.label && (
                      <foreignObject
                        width={160}
                        height={40}
                        x={((edgeProps.sourceX + edgeProps.targetX) / 2) - 80}
                        y={((edgeProps.sourceY + edgeProps.targetY) / 2) - 20}
                        requiredExtensions="http://www.w3.org/1999/xhtml"
                        style={{ pointerEvents: 'none' }} // Đảm bảo click xuyên qua label
                      >
                        <div
                          style={{
                            background: '#fff',
                            border: '1.5px solid #ef4444',
                            borderRadius: 8,
                            padding: '4px 10px',
                            color: '#b91c1c',
                            fontWeight: 700,
                            fontSize: 15,
                            boxShadow: '0 2px 8px #fecaca',
                            textAlign: 'center',
                            pointerEvents: 'none', // Đảm bảo click xuyên qua label
                          }}
                        >
                          {edgeProps.label}
                        </div>
                      </foreignObject>
                    )}
                  </>
                ),
              }}
            >
              <MiniMap />
              <Controls />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </BOMDesignContext.Provider>
      {/* Hiển thị JSON khi bấm Save */}
      {showJson && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#fff', borderRadius: 8, padding: 24, minWidth: 400, maxWidth: 700, maxHeight: '80vh', overflow: 'auto', boxShadow: '0 4px 24px rgba(0,0,0,0.13)'
          }}>
            <h3>Nodes (copy để lưu bảng Node)</h3>
            <pre style={{ fontSize: 13, background: '#f3f4f6', padding: 12, borderRadius: 6, maxHeight: 200, overflow: 'auto' }}>{JSON.stringify(JSON.parse(jsonData).nodes, null, 2)}</pre>
            <h3>Edges (copy để lưu bảng Edge)</h3>
            <pre style={{ fontSize: 13, background: '#f3f4f6', padding: 12, borderRadius: 6, maxHeight: 200, overflow: 'auto' }}>{JSON.stringify(JSON.parse(jsonData).edges, null, 2)}</pre>
            <button onClick={() => setShowJson(false)} style={{ marginTop: 10, padding: '6px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BOM_DESIGN;