import React, { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  Handle,
  Position,
  NodeChange,
  useReactFlow,
  Edge,
  MarkerType,
  SelectionMode,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { MdEventRepeat, MdOutlineNotStarted } from 'react-icons/md';
import { FaExpandArrowsAlt, FaRegStopCircle, FaRunning, FaUndo, FaRedo } from 'react-icons/fa';
import { FcProcess } from 'react-icons/fc';
import { HiOutlineAnnotation } from 'react-icons/hi';
import { RootState } from '../../../redux/store';
import { setEdges, setNodes } from '../../../redux/slices/workflowSlice';
import { Modal, TextField, Button, Box } from '@mui/material';

/* ================== HELPERS: xoay vị trí Handle theo rotation ================== */
const normalizeRotation = (deg: number) => ((deg % 360) + 360) % 360;

const rotatePosition = (pos: Position, rotation: number): Position => {
  const r = normalizeRotation(rotation || 0);
  switch (r) {
    case 90:
      switch (pos) {
        case Position.Left: return Position.Top;
        case Position.Right: return Position.Bottom;
        case Position.Top: return Position.Right;
        case Position.Bottom: return Position.Left;
      }
      break;
    case 180:
      switch (pos) {
        case Position.Left: return Position.Right;
        case Position.Right: return Position.Left;
        case Position.Top: return Position.Bottom;
        case Position.Bottom: return Position.Top;
      }
      break;
    case 270:
      switch (pos) {
        case Position.Left: return Position.Bottom;
        case Position.Right: return Position.Top;
        case Position.Top: return Position.Left;
        case Position.Bottom: return Position.Right;
      }
      break;
  }
  return pos;
};

const styleForSide = (pos: Position, base?: React.CSSProperties): React.CSSProperties | undefined => {
  let style = { ...(base || {}) };
  if (pos === Position.Left || pos === Position.Right) {
    style = { ...style, top: '50%' };
  } else {
    style = { ...style, left: '50%' };
  }
  return style;
};

/* ================== NODE TYPES ================== */
const BaseNode = React.memo(
  ({
    baseStyle,
    getContent,
    getHandles,
    data,
    selected,
  }: {
    baseStyle: React.CSSProperties;
    getContent: (data: any) => JSX.Element;
    getHandles: (rot: number, data: any) => JSX.Element;
    data: any;
    selected: boolean;
  }) => (
    <div
      style={{
        ...baseStyle,
        boxShadow: selected ? '0 0 8px rgba(0, 128, 255, 0.8)' : 'none',
        position: 'relative',
        pointerEvents: 'auto',
        userSelect: 'none',
      }}      
      data-no-pan={true}
    >
      {getHandles(data.rotation || 0, data)}
      <div
        style={{
          transform: `rotate(${data.rotation || 0}deg)`,
          transformOrigin: 'center center',
          pointerEvents: 'auto',
        }}
      >
        {getContent(data)}
      </div>
    </div>
  )
);

const nodeTypes: NodeTypes = {
  start: (props: any) => (
    <BaseNode
      baseStyle={{
        fontSize: '0.6rem',
        padding: '4px',
        border: '1px solid #777',
        borderRadius: 5,
        background: '#4ff54f',
        maxWidth: '160px',
      }}
      getContent={(data) => (
        <>
          <strong>{data.label}</strong>
          <div
            style={{
              fontSize: '0.55rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {data.details || 'No details'}
          </div>
          <div style={{ fontSize: '0.55rem', color: '#333' }}>
            <em>{data.department || 'Chưa gán bộ phận'}</em>
          </div>
        </>
      )}
      getHandles={(rot) => {
        const srcPos = rotatePosition(Position.Bottom, rot);
        return <Handle type="source" position={srcPos} id="source" style={styleForSide(srcPos)} />;
      }}
      {...props}
    />
  ),
  end: (props: any) => (
    <BaseNode
      baseStyle={{
        fontSize: '0.6rem',
        padding: '4px',
        border: '1px solid #777',
        borderRadius: 5,
        background: '#ff6f6f',
        maxWidth: '160px',
      }}
      getContent={(data) => (
        <>
          <strong>{data.label}</strong>
          <div style={{ fontSize: '0.55rem' }}>{data.details || 'No details'}</div>
          <div style={{ fontSize: '0.55rem', color: '#333' }}>
            <em>{data.department || 'Chưa gán bộ phận'}</em>
          </div>
        </>
      )}
      getHandles={(rot) => {
        const tgtPos = rotatePosition(Position.Top, rot);
        return <Handle type="target" position={tgtPos} id="target" style={styleForSide(tgtPos)} />;
      }}
      {...props}
    />
  ),
  action: (props: any) => (
    <BaseNode
      baseStyle={{
        fontSize: '0.6rem',
        padding: '4px',
        border: '1px solid #777',
        borderRadius: 5,
        background: '#8fcdff',
        maxWidth: '160px',
      }}
      getContent={(data) => (
        <>
          <strong>{data.label}</strong>
          <div style={{ fontSize: '0.55rem' }}>{data.details || 'No details'}</div>
          <div style={{ fontSize: '0.55rem', color: '#333' }}>
            <em>{data.department || 'Chưa gán bộ phận'}</em>
          </div>
        </>
      )}
      getHandles={(rot) => {
        const tgtPos = rotatePosition(Position.Top, rot);
        const srcPos = rotatePosition(Position.Bottom, rot);
        return (
          <>
            <Handle type="target" position={tgtPos} id="target" style={styleForSide(tgtPos)} />
            <Handle type="source" position={srcPos} id="source" style={styleForSide(srcPos)} />
          </>
        );
      }}
      {...props}
    />
  ),
  condition: (props: any) => (
    <BaseNode
      baseStyle={{
        fontSize: '0.6rem',
        padding: '8px',
        border: '2px solid #ff9800',
        borderRadius: '20%',
        background: '#fff3e0',
        width: 70,
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        position: 'relative',
        flexDirection: 'column',
        textAlign: 'center',
      }}
      getContent={(data) => (
        <>
          {data.label || 'Condition'}
          <div style={{ fontSize: '0.5rem' }}>
            <em>{data.department || 'Chưa gán bộ phận'}</em>
          </div>
        </>
      )}
      getHandles={(rot) => {
        const posIn = rotatePosition(Position.Top, rot);
        const posTrue = rotatePosition(Position.Bottom, rot);
        const posFalseLeft = rotatePosition(Position.Left, rot);
        const posFalseRight = rotatePosition(Position.Right, rot);

        return (
          <>
            <Handle type="target" position={posIn} id="in" style={styleForSide(posIn)} />
            <Handle type="source" position={posTrue} id="true" style={styleForSide(posTrue, { background: 'green' })} />
            <Handle type="source" position={posFalseLeft} id="false_left" style={styleForSide(posFalseLeft, { background: 'red' })} />
            <Handle type="source" position={posFalseRight} id="false_right" style={styleForSide(posFalseRight, { background: 'red' })} />
          </>
        );
      }}
      {...props}
    />
  ),
  event: (props: any) => (
    <BaseNode
      baseStyle={{
        fontSize: '0.6rem',
        padding: '8px',
        border: '2px dashed #673ab7',
        borderRadius: '50%',
        background: '#ede7f6',
        width: 60,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
      getContent={(data) => (
        <>
          {data.label || 'Event'}
          <div style={{ fontSize: '0.45rem' }}>
            <em>{data.department || ''}</em>
          </div>
        </>
      )}
      getHandles={(rot) => {
        const tgtPos = rotatePosition(Position.Top, rot);
        const srcPos = rotatePosition(Position.Bottom, rot);
        return (
          <>
            <Handle type="target" position={tgtPos} id="target" style={styleForSide(tgtPos)} />
            <Handle type="source" position={srcPos} id="source" style={styleForSide(srcPos)} />
          </>
        );
      }}
      {...props}
    />
  ),
  subprocess: (props: any) => (
    <BaseNode
      baseStyle={{
        padding: '8px',
        border: '1px dashed #999',
        borderRadius: 5,
        background: '#f9f9f9',
        fontSize: '0.6rem',
        maxWidth: '160px',
      }}
      getContent={(data) => (
        <>
          <strong>{data.label || 'Subprocess'}</strong>
          <div style={{ fontSize: '0.55rem' }}>{data.details || ''}</div>
          <div style={{ fontSize: '0.55rem', color: '#333' }}>
            <em>{data.department || 'Chưa gán bộ phận'}</em>
          </div>
        </>
      )}
      getHandles={(rot) => {
        const tgtPos = rotatePosition(Position.Top, rot);
        const srcPos = rotatePosition(Position.Bottom, rot);
        return (
          <>
            <Handle type="target" position={tgtPos} id="target" style={styleForSide(tgtPos)} />
            <Handle type="source" position={srcPos} id="source" style={styleForSide(srcPos)} />
          </>
        );
      }}
      {...props}
    />
  ),
  annotation: (props: any) => (
    <BaseNode
      baseStyle={{
        padding: '6px',
        border: '1px dotted #666',
        borderRadius: 3,
        background: '#ffffe0',
        fontSize: '0.55rem',
        maxWidth: '140px',
      }}
      getContent={(data) => (
        <>
          {data.label || 'Note'}
          <div style={{ fontSize: '0.5rem', color: '#333' }}>
            <em>{data.department || ''}</em>
          </div>
        </>
      )}
      getHandles={() => <></>}
      {...props}
    />
  ),
};

/* ================== MAIN COMPONENT ================== */
const WorkflowEditor: React.FC = () => {
  const dispatch = useDispatch();
  const { nodes: reduxNodes, edges: reduxEdges } = useSelector((state: RootState) => state.workflowSlice);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [renderKey, setRenderKey] = useState(Date.now());
  const [openModal, setOpenModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [formData, setFormData] = useState({ label: '', details: '', department: '' });

  const savedFlow = typeof window !== 'undefined' ? localStorage.getItem('workflow-data') : null;
  const parsedFlow = savedFlow ? JSON.parse(savedFlow) : null;

  const [nodes, setNodesState, onNodesChange] = useNodesState(parsedFlow?.nodes || reduxNodes);
  const [edges, setEdgesState, onEdgesChange] = useEdgesState(parsedFlow?.edges || reduxEdges);
  const { screenToFlowPosition, fitView } = useReactFlow();

  /* Kết nối cạnh */
  const onConnect = useCallback(
    (params: Connection) => {
      setNodesState((currentNodes) => {
        const sourceNode = currentNodes.find((node) => node.id === params.source);
        const isGateway = sourceNode?.type === 'condition';
        setEdgesState((currentEdges) =>
          addEdge(
            {
              ...params,
              type: 'step',
              markerEnd: { type: MarkerType.ArrowClosed },
              label: isGateway
                ? params.sourceHandle === 'true'
                  ? 'True'
                  : params.sourceHandle!.includes('false')
                  ? 'False'
                  : 'Default'
                : undefined,
              style: { stroke: '#555', strokeWidth: 1 },
            },
            currentEdges
          )
        );
        return currentNodes;
      });
    },
    [setNodesState, setEdgesState]
  );

  /* Thay đổi node */
  const onNodesChangeHandler = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  /* Thay đổi cạnh */
  const onEdgesChangeHandler = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );

  /* Click cạnh */
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, clickedEdge: Edge) => {
      console.log('Edge clicked:', clickedEdge.id); // Debug
      setEdgesState((eds) =>
        eds.map((e) => ({
          ...e,
          selected: e.id === clickedEdge.id, // Đặt selected cho cạnh được click
          style: {
            stroke: e.id === clickedEdge.id ? '#0080ff' : '#555', // Highlight màu xanh
            strokeWidth: e.id === clickedEdge.id ? 2 : 1, // Tăng độ dày
          },
        }))
      );
    },
    [setEdgesState]
  );

  /* Double click node để mở Modal */
  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      console.log('onNodeDoubleClick triggered:', node.id);
      event.preventDefault();
      event.stopPropagation();
      setSelectedNode(node);
      setFormData({
        label: node.data.label || '',
        details: node.data.details || '',
        department: node.data.department || '',
      });
      setOpenModal(true);
    },
    []
  );

  /* Click node */
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      console.log('onNodeClick triggered:', node.id);
      event.preventDefault();
      event.stopPropagation();
      setSelectedNodeId(node.id);
    },
    []
  );

  /* Drag & drop từ sidebar */
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      if (isNaN(position.x) || isNaN(position.y)) {
        console.error('Invalid drop position:', position);
        return;
      }
      setNodesState((nds) => {
        const newNode: Node = {
          id: `${nds.length + 1}`,
          type: nodeType,
          position,
          data: {
            label: `New ${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node`,
            details: '',
            department: '',
            rotation: 0,
            ...(nodeType === 'condition' ? { conditions: ['x > 10', 'x <= 10'] } : {}),
          },
        };
        return [...nds, newNode];
      });
    },
    [setNodesState, screenToFlowPosition]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /* Save: Sync Redux và localStorage */
  const onSave = useCallback(() => {
    const data = JSON.stringify({ nodes, edges });
    localStorage.setItem('workflow-data', data);
    dispatch(setNodes(nodes));
    dispatch(setEdges(edges));
    console.log('Nodes', nodes);
    console.log('Edges', edges);
  }, [nodes, edges, dispatch]);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  /* Rotate node */
  const rotateNode = useCallback(
    (direction: 'left' | 'right') => {
      if (!selectedNodeId) return;

      setNodesState((nds) => {
        const updatedNodes = nds.map((n) => {
          if (n.id === selectedNodeId) {
            const currentRotation = n.data.rotation || 0;
            const newRotation = normalizeRotation(direction === 'left' ? currentRotation - 90 : currentRotation + 90);
            return {
              ...n,
              data: { ...n.data, rotation: newRotation },
            };
          }
          return n;
        });
        setRenderKey(Date.now()); // Re-render component
        setTimeout(() => fitView({ duration: 200 }), 0);
        return updatedNodes;
      });
    },
    [selectedNodeId, setNodesState, fitView, setRenderKey]
  );

  /* Phím tắt */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedNodeId) return;
      if (e.ctrlKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        rotateNode('left');
      } else if (e.ctrlKey && e.key === 'ArrowRight') {
        e.preventDefault();
        rotateNode('right');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedNodeId, rotateNode]);

  const nodeTypesList = useMemo(
    () => [
      { nodeType: 'start', icon: <MdOutlineNotStarted size={24} /> },
      { nodeType: 'end', icon: <FaRegStopCircle size={24} /> },
      { nodeType: 'action', icon: <FaRunning size={24} /> },
      { nodeType: 'condition', icon: <FaExpandArrowsAlt size={24} /> },
      { nodeType: 'event', icon: <MdEventRepeat size={24} /> },
      { nodeType: 'subprocess', icon: <FcProcess size={24} /> },
      { nodeType: 'annotation', icon: <HiOutlineAnnotation size={24} /> },
    ],
    []
  );

  /* Auto save localStorage khi unmount */
  useEffect(() => {
    return () => {
      const data = JSON.stringify({ nodes, edges });
      localStorage.setItem('workflow-data', data);
    };
  }, [nodes, edges]);

  /* Xử lý lưu Modal */
  const handleSaveModal = () => {
    if (selectedNode) {
      setNodesState((nds) =>
        nds.map((n) =>
          n.id === selectedNode.id
            ? {
                ...n,
                data: {
                  ...n.data,
                  label: formData.label.trim(),
                  details: formData.details.trim() || n.data.details || '',
                  department: formData.department.trim() || n.data.department || '',
                },
              }
            : n
        )
      );
    }
    setOpenModal(false);
  };

  /* Xử lý đóng Modal */
  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ label: '', details: '', department: '' });
    setSelectedNode(null);
  };

  /* Modal style */
  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div style={{ width: '100vw', height: '90vh', display: 'flex' }} key={renderKey}>
      {/* Sidebar */}
      <div
        style={{
          width: '200px',
          background: '#f0f0f0',
          padding: '10px',
          borderRight: '1px solid #ccc',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <h3>Node Types</h3>
        {nodeTypesList.map((type) => (
          <div
            key={type.nodeType}
            draggable
            onDragStart={(event) => onDragStart(event, type.nodeType)}
            style={{
              padding: '10px',
              background: '#fff',
              border: '1px solid #777',
              borderRadius: '5px',
              cursor: 'grab',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              {type.nodeType.charAt(0).toUpperCase() + type.nodeType.slice(1)}
              {type.icon}
            </div>
          </div>
        ))}

        {selectedNodeId && (
          <div style={{ marginTop: '20px' }}>
            <h4>Rotate Node</h4>
            <button
              onClick={() => rotateNode('left')}
              style={{ marginRight: '10px', padding: '6px', cursor: 'pointer' }}
              title="Ctrl + ←"
            >
              <FaUndo /> Left
            </button>
            <button
              onClick={() => rotateNode('right')}
              style={{ padding: '6px', cursor: 'pointer' }}
              title="Ctrl + →"
            >
              <FaRedo /> Right
            </button>
            <div style={{ fontSize: 12, marginTop: 6, color: '#555' }}>
              Shortcut: Ctrl + ← / Ctrl + →
            </div>
          </div>
        )}

        <button
          onClick={onSave}
          style={{
            marginTop: '20px',
            padding: '10px',
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          Save
        </button>
      </div>

      {/* React Flow Canvas */}
      <div style={{ flex: 1 }} onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeHandler}
          onEdgesChange={onEdgesChangeHandler}
          onConnect={onConnect}
          onNodeDoubleClick={onNodeDoubleClick}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
          selectionKeyCode="Shift"
          multiSelectionKeyCode="Control"
          deleteKeyCode="Delete"
          selectionMode={SelectionMode.Partial}
          selectionOnDrag={true} // Bật selection bằng drag
          panOnDrag={false} // Tắt pan khi drag để ưu tiên selection
          panOnScroll={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          onSelectionChange={(sel: any) => {
            const selNodes: Node[] = sel?.nodes || [];
            setSelectedNodeId(selNodes.length === 1 ? selNodes[0].id : null);
          }}
        >
          <Background gap={10} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Modal nhập liệu */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <h2>Edit Node</h2>
          <TextField
            label="Label"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Details"
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleSaveModal} variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Save
          </Button>
          <Button onClick={handleCloseModal} variant="outlined" style={{ marginTop: '20px', marginLeft: '10px' }}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default WorkflowEditor;