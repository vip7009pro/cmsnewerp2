import React, { JSX, useCallback, useEffect, useMemo, useState, useRef } from 'react';
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

const isHorizontal = (pos: Position) => pos === Position.Left || pos === Position.Right;
/** Thêm top:50% khi Handle ở trái/phải, left:50% khi trên/dưới để nằm giữa cạnh */
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
const BaseNode =
  (baseStyle: React.CSSProperties, getContent: (data: any) => JSX.Element, getHandles: (rot: number, data: any) => JSX.Element) =>
  // eslint-disable-next-line react/display-name
  ({ data, selected }: any) =>
    (
      <div
        style={{
          ...baseStyle,
          boxShadow: selected ? '0 0 8px rgba(0, 128, 255, 0.8)' : 'none',
          position: 'relative',
        }}
      >
        {getHandles(data.rotation || 0, data)}
        <div
          style={{
            transform: `rotate(${data.rotation || 0}deg)`,
            transformOrigin: 'center center',
          }}
        >
          {getContent(data)}
        </div>
      </div>
    );

const nodeTypes: NodeTypes = {
  start: BaseNode(
    {
      fontSize: '0.6rem',
      padding: '4px',
      border: '1px solid #777',
      borderRadius: 5,
      background: '#4ff54f',
      maxWidth: '160px',
    },
    (data) => (
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
    ),
    (rot) => {
      const srcPos = rotatePosition(Position.Bottom, rot);
      return <Handle type="source" position={srcPos} id="source" style={styleForSide(srcPos)} />;
    }
  ),

  end: BaseNode(
    {
      fontSize: '0.6rem',
      padding: '4px',
      border: '1px solid #777',
      borderRadius: 5,
      background: '#ff6f6f',
      maxWidth: '160px',
    },
    (data) => (
      <>
        <strong>{data.label}</strong>
        <div style={{ fontSize: '0.55rem' }}>{data.details || 'No details'}</div>
        <div style={{ fontSize: '0.55rem', color: '#333' }}>
          <em>{data.department || 'Chưa gán bộ phận'}</em>
        </div>
      </>
    ),
    (rot) => {
      const tgtPos = rotatePosition(Position.Top, rot);
      return <Handle type="target" position={tgtPos} id="target" style={styleForSide(tgtPos)} />;
    }
  ),

  action: BaseNode(
    {
      fontSize: '0.6rem',
      padding: '4px',
      border: '1px solid #777',
      borderRadius: 5,
      background: '#8fcdff',
      maxWidth: '160px',
    },
    (data) => (
      <>
        <strong>{data.label}</strong>
        <div style={{ fontSize: '0.55rem' }}>{data.details || 'No details'}</div>
        <div style={{ fontSize: '0.55rem', color: '#333' }}>
          <em>{data.department || 'Chưa gán bộ phận'}</em>
        </div>
      </>
    ),
    (rot) => {
      const tgtPos = rotatePosition(Position.Top, rot);
      const srcPos = rotatePosition(Position.Bottom, rot);
      return (
        <>
          <Handle type="target" position={tgtPos} id="target" style={styleForSide(tgtPos)} />
          <Handle type="source" position={srcPos} id="source" style={styleForSide(srcPos)} />
        </>
      );
    }
  ),

  condition: BaseNode(
    {
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
    },
    (data) => (
      <>
        {data.label || 'Condition'}
        <div style={{ fontSize: '0.5rem' }}>
          <em>{data.department || 'Chưa gán bộ phận'}</em>
        </div>
      </>
    ),
    (rot) => {
      const posIn = rotatePosition(Position.Top, rot);
      const posTrue = rotatePosition(Position.Bottom, rot);
      const posFalseLeft = rotatePosition(Position.Left, rot);
      const posFalseRight = rotatePosition(Position.Right, rot);

      return (
        <>
          {/* Input */}
          <Handle type="target" position={posIn} id="in" style={styleForSide(posIn)} />

          {/* Output True (gốc Bottom) */}
          <Handle
            type="source"
            position={posTrue}
            id="true"
            style={styleForSide(posTrue, { background: 'green' })}
          />

          {/* Output False - từ Left/Right xoay theo node */}
          <Handle
            type="source"
            position={posFalseLeft}
            id="false_left"
            style={styleForSide(posFalseLeft, { background: 'red' })}
          />
          <Handle
            type="source"
            position={posFalseRight}
            id="false_right"
            style={styleForSide(posFalseRight, { background: 'red' })}
          />
        </>
      );
    }
  ),

  event: BaseNode(
    {
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
    },
    (data) => (
      <>
        {data.label || 'Event'}
        <div style={{ fontSize: '0.45rem' }}>
          <em>{data.department || ''}</em>
        </div>
      </>
    ),
    (rot) => {
      const tgtPos = rotatePosition(Position.Top, rot);
      const srcPos = rotatePosition(Position.Bottom, rot);
      return (
        <>
          <Handle type="target" position={tgtPos} id="target" style={styleForSide(tgtPos)} />
          <Handle type="source" position={srcPos} id="source" style={styleForSide(srcPos)} />
        </>
      );
    }
  ),

  subprocess: BaseNode(
    {
      padding: '8px',
      border: '1px dashed #999',
      borderRadius: 5,
      background: '#f9f9f9',
      fontSize: '0.6rem',
      maxWidth: '160px',
    },
    (data) => (
      <>
        <strong>{data.label || 'Subprocess'}</strong>
        <div style={{ fontSize: '0.55rem' }}>{data.details || ''}</div>
        <div style={{ fontSize: '0.55rem', color: '#333' }}>
          <em>{data.department || 'Chưa gán bộ phận'}</em>
        </div>
      </>
    ),
    (rot) => {
      const tgtPos = rotatePosition(Position.Top, rot);
      const srcPos = rotatePosition(Position.Bottom, rot);
      return (
        <>
          <Handle type="target" position={tgtPos} id="target" style={styleForSide(tgtPos)} />
          <Handle type="source" position={srcPos} id="source" style={styleForSide(srcPos)} />
        </>
      );
    }
  ),

  annotation: BaseNode(
    {
      padding: '6px',
      border: '1px dotted #666',
      borderRadius: 3,
      background: '#ffffe0',
      fontSize: '0.55rem',
      maxWidth: '140px',
    },
    (data) => (
      <>
        {data.label || 'Note'}
        <div style={{ fontSize: '0.5rem', color: '#333' }}>
          <em>{data.department || ''}</em>
        </div>
      </>
    ),
    () => <></> // No handles
  ),
};

/* ================== MAIN COMPONENT ================== */
const WorkflowEditor: React.FC = () => {
  const dispatch = useDispatch();
  const { nodes: reduxNodes, edges: reduxEdges } = useSelector((state: RootState) => state.workflowSlice);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [renderKey, setRenderKey] = useState(Date.now()); // State để trigger rerender

  const savedFlow = typeof window !== 'undefined' ? localStorage.getItem('workflow-data') : null;
  const parsedFlow = savedFlow ? JSON.parse(savedFlow) : null;

  const [nodes, setNodesState, onNodesChange] = useNodesState(parsedFlow?.nodes || reduxNodes);
  const [edges, setEdgesState, onEdgesChange] = useEdgesState(parsedFlow?.edges || reduxEdges);
  const { screenToFlowPosition, getNodes, fitView } = useReactFlow();

  /* Tự động lưu */
  useEffect(() => {
    const data = JSON.stringify({ nodes, edges });
    localStorage.setItem('workflow-data', data);
  }, [nodes, edges]);

  /* Kết nối cạnh */
  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find((node) => node.id === params.source);
      const isGateway = sourceNode?.type === 'condition';
      const newEdges = addEdge(
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
        edges
      );
      setEdgesState(newEdges);
      dispatch(setEdges(newEdges));
    },
    [nodes, edges, setEdgesState, dispatch]
  );

  /* Thay đổi node */
  const onNodesChangeHandler = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      const updatedNodes = getNodes();
      dispatch(setNodes(updatedNodes));
      // Force rerender edges
      setEdgesState([...edges]);
    },
    [onNodesChange, dispatch, getNodes, edges, setEdgesState]
  );

  /* Thay đổi cạnh */
  const onEdgesChangeHandler = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      setEdgesState((eds) =>
        eds.map((edge) => ({
          ...edge,
          style: {
            stroke: edge.selected ? '#0080ff' : '#555',
            strokeWidth: edge.selected ? 2 : 1,
          },
        }))
      );
    },
    [onEdgesChange, setEdgesState]
  );

  /* Click cạnh */
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const updatedEdges = edges.map((e) => ({
        ...e,
        selected: e.id === edge.id,
        style: {
          stroke: e.id === edge.id ? '#0080ff' : '#555',
          strokeWidth: e.id === edge.id ? 2 : 1,
        },
      }));
      setEdgesState(updatedEdges);
      dispatch(setEdges(updatedEdges));
    },
    [edges, setEdgesState, dispatch]
  );

  /* Double click node để sửa */
  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const newLabel = prompt('Enter new node label:', node.data.label);
      const newDetails = prompt('Enter task details:', node.data.details || '');
      const newDepartment = prompt('Enter department:', node.data.department || '');
      if (newLabel && newLabel.trim()) {
        const updatedNode = {
          ...node,
          data: {
            ...node.data,
            label: newLabel.trim(),
            details: newDetails ? newDetails.trim() : node.data.details || '',
            department: newDepartment ? newDepartment.trim() : node.data.department || '',
          },
        };
        setNodesState((nds) => nds.map((n) => (n.id === node.id ? updatedNode : n)));
        dispatch(setNodes(getNodes().map((n) => (n.id === node.id ? updatedNode : n))));
      }
    },
    [setNodesState, dispatch, getNodes]
  );

  /* Drag & drop từ sidebar */
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      // Validate position
      if (isNaN(position.x) || isNaN(position.y)) {
        console.error('Invalid drop position:', position);
        return;
      }
      const newNode: Node = {
        id: `${nodes.length + 1}`,
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
      setNodesState((nds) => nds.concat(newNode));
      dispatch(setNodes([...nodes, newNode]));
    },
    [nodes, setNodesState, dispatch, screenToFlowPosition]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onSave = useCallback(() => {
    console.log('Nodes:', nodes);
    console.log('Edges:', edges);
  }, [nodes, edges]);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const rotateNode = (direction: 'left' | 'right') => {
    if (!selectedNodeId) return;
    const updatedNodes = nodes.map((n) => {
      if (n.id === selectedNodeId) {
        const currentRotation = n.data.rotation || 0;
        const newRotation = direction === 'left' ? currentRotation - 90 : currentRotation + 90;
        if (isNaN(newRotation)) {
          console.error(`Invalid rotation for node ${n.id}: ${newRotation}`);
          return n;
        }
        console.log(`Rotating node ${n.id} to ${newRotation} degrees`); // Debug
        return {
          ...n,
          data: { ...n.data, rotation: newRotation },
          key: `${n.id}-${Date.now()}`, // Force rerender node
        };
      }
      return n;
    });

    const updatedEdges = edges.map((edge) => {
      if (edge.source === selectedNodeId || edge.target === selectedNodeId) {
        return {
          ...edge,
          key: `${edge.id}-${Date.now()}`, // Force rerender edge
        };
      }
      return edge;
    });

    // Update nodes, edges và trigger rerender toàn bộ flow
    setNodesState([...updatedNodes]);
    setEdgesState([...updatedEdges]);
    setRenderKey(Date.now()); // Trigger rerender toàn bộ component
    dispatch(setNodes(updatedNodes));
    dispatch(setEdges(updatedEdges));
    // Force recalculate layout
    fitView({ duration: 200 });
  };

  /* Phím tắt: Ctrl + ← / Ctrl + → */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeId, nodes]);

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

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }} key={renderKey}>
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
          onEdgeClick={onEdgeClick}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          selectionKeyCode="Shift"
          multiSelectionKeyCode="Control"
          deleteKeyCode="Delete"
          selectionMode={SelectionMode.Partial}
          selectionOnDrag={true}
          panOnDrag={false}
          panOnScroll={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          onSelectionChange={(sel: any) => {
            const selNodes: Node[] = sel?.nodes || [];
            setSelectedNodeId(selNodes.length === 1 ? selNodes[0].id : null);
          }}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};

export default WorkflowEditor;