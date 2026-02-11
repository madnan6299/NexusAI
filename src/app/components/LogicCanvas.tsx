import React, { useCallback, useState } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  Connection, 
  Edge, 
  Node, 
  useNodesState, 
  useEdgesState,
  Handle,
  Position,
  BackgroundVariant,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, Plus, Trash2, X, Zap, Filter, Code2, Send, Workflow, ArrowRight, Settings2, MoreHorizontal, Copy, Layers, ExternalLink, Save } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

// --- n8n Style Constants ---
const COLORS = {
  canvas: '#151515',
  panel: '#222222',
  nodeBg: '#2D2D2D',
  border: '#444444',
  text: '#E0E0E0',
  muted: '#888888',
  primary: '#FF6D5A', // n8n Orange-Red
  success: '#2CCF80', // n8n Green
  warning: '#FFB84D',
  selection: '#FF6D5A',
};

// --- Custom Node Component (n8n Style) ---
const N8nNode = ({ data, type, icon: Icon, color, selected }: any) => {
  return (
    <div className={clsx(
      "min-w-[200px] rounded-lg shadow-lg overflow-hidden transition-all duration-200 group relative",
      selected 
        ? "ring-2 ring-[#FF6D5A] shadow-[0_0_15px_rgba(255,109,90,0.3)]" 
        : "ring-1 ring-[#444444] hover:ring-[#666666]"
    )}
    style={{ backgroundColor: COLORS.nodeBg }}
    >
      {/* Node Header */}
      <div className="px-3 py-2 flex items-center gap-3 border-b border-[#333333]">
        <div 
          className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: color || COLORS.primary }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-white truncate leading-tight">{data.label}</div>
          <div className="text-[10px] text-[#888888] truncate leading-tight mt-0.5">{type}</div>
        </div>
        
        {/* Hover Actions (n8n style) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-3 -right-2 flex gap-1 z-10">
           <button className="bg-[#FF6D5A] p-1.5 rounded-full text-white shadow-md hover:scale-110 transition-transform">
             <Play className="w-3 h-3 fill-current" />
           </button>
        </div>
      </div>

      {/* Node Body (Optional stats or status) */}
      <div className="px-3 py-2 bg-[#222222]">
        <div className="flex items-center justify-between text-[10px] text-[#888888]">
          <span className="flex items-center gap-1.5">
             <span className={clsx("w-1.5 h-1.5 rounded-full", data.active ? "bg-[#2CCF80]" : "bg-[#666666]")} />
             {data.active ? "Active" : "Inactive"}
          </span>
          <span className="font-mono opacity-50">ID: {data.id}</span>
        </div>
      </div>

      {/* Handles - styled like n8n's subtle dots */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-[#666666] !border-none transition-colors hover:!bg-[#FF6D5A] -ml-1.5"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-[#666666] !border-none transition-colors hover:!bg-[#FF6D5A] -mr-1.5"
      />
    </div>
  );
};

const nodeTypes = {
  webhook: (props: any) => <N8nNode {...props} type="Webhook" icon={Zap} color="#FF6D5A" />,
  filter: (props: any) => <N8nNode {...props} type="If" icon={Filter} color="#FFB84D" />,
  function: (props: any) => <N8nNode {...props} type="Code" icon={Code2} color="#45B0F9" />,
  action: (props: any) => <N8nNode {...props} type="HTTP Request" icon={ExternalLink} color="#2CCF80" />,
};

const INITIAL_NODES: Node[] = [
  { 
    id: '1', 
    type: 'webhook', 
    position: { x: 100, y: 200 }, 
    data: { label: 'On New Lead', active: true },
    selected: false
  },
  { 
    id: '2', 
    type: 'filter', 
    position: { x: 450, y: 200 }, 
    data: { label: 'Check Email Domain', active: true },
    selected: false
  },
  { 
    id: '3', 
    type: 'function', 
    position: { x: 800, y: 100 }, 
    data: { label: 'Format Data', active: false },
    selected: false
  },
  { 
    id: '4', 
    type: 'action', 
    position: { x: 800, y: 300 }, 
    data: { label: 'POST to Slack', active: false },
    selected: false
  },
];

const INITIAL_EDGES: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    type: 'smoothstep', 
    animated: false,
    style: { stroke: '#666666', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#666666' }
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
    type: 'smoothstep', 
    label: 'True',
    style: { stroke: '#666666', strokeWidth: 2 },
    labelStyle: { fill: '#2CCF80', fontWeight: 700 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#666666' }
  },
  { 
    id: 'e2-4', 
    source: '2', 
    target: '4', 
    type: 'smoothstep', 
    label: 'False',
    style: { stroke: '#666666', strokeWidth: 2 },
    labelStyle: { fill: '#FF6D5A', fontWeight: 700 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#666666' }
  },
];

export function LogicCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({ 
    ...params, 
    type: 'smoothstep', 
    style: { stroke: '#666666', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#666666' }
  }, eds)), [setEdges]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  return (
    <div className="flex h-full w-full bg-[#151515] text-[#E0E0E0] relative overflow-hidden font-sans min-h-[500px]">
      <div className="flex-1 h-full relative">
        {/* n8n Top Toolbar */}
        <div className="absolute top-0 left-0 right-0 h-14 bg-[#222222] border-b border-[#333333] z-10 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-[#FF6D5A] rounded flex items-center justify-center">
                 <Workflow className="w-5 h-5 text-white" />
               </div>
               <div>
                 <div className="text-sm font-bold text-white flex items-center gap-2">
                   My Workflow 
                   <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#333333] text-[#888888]">Draft</span>
                 </div>
                 <div className="text-[10px] text-[#888888]">Last saved 2 min ago</div>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <div className="flex items-center bg-[#333333] rounded-md p-1">
               <span className="text-[10px] font-medium px-2 text-[#888888]">Active</span>
               <div className="w-8 h-4 bg-[#FF6D5A] rounded-full relative cursor-pointer">
                 <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
               </div>
             </div>
             <div className="h-6 w-px bg-[#444444] mx-2" />
             <button className="px-4 py-1.5 bg-[#FF6D5A] hover:bg-[#ff8f80] text-white text-xs font-bold rounded flex items-center gap-2 transition-colors">
               <Play className="w-3.5 h-3.5 fill-current" />
               Execute Workflow
             </button>
             <button className="p-2 hover:bg-[#333333] text-[#888888] hover:text-white rounded transition-colors">
               <Save className="w-4 h-4" />
             </button>
          </div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
          className="bg-[#151515] pt-14" // Add padding top for header
          minZoom={0.5}
          maxZoom={1.5}
        >
          <Background color="#333333" gap={20} size={1} variant={BackgroundVariant.Dots} />
          <Controls className="bg-[#222222] border-[#444444] fill-[#E0E0E0] rounded overflow-hidden border shadow-lg" showInteractive={false} />
        </ReactFlow>
        
        {/* Floating "Add Node" Button (n8n style) */}
        <div className="absolute top-20 right-6 z-10">
           <button className="w-12 h-12 bg-[#FF6D5A] rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform">
             <Plus className="w-6 h-6" />
           </button>
        </div>
      </div>

      {/* Inspector Panel (n8n Style) */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="absolute right-0 top-14 bottom-0 w-[400px] bg-[#222222] border-l border-[#333333] shadow-xl z-20 flex flex-col"
          >
            {/* Inspector Header */}
            <div className="h-14 px-5 border-b border-[#333333] flex items-center justify-between bg-[#222222]">
              <div className="flex items-center gap-3">
                <div 
                   className="w-7 h-7 rounded flex items-center justify-center"
                   style={{ backgroundColor: selectedNode.data.color || '#FF6D5A' }}
                >
                   {/* Icon placeholder since we don't have direct access to the specific node icon comp here easily without mapping */}
                   <Settings2 className="w-4 h-4 text-white" />
                </div>
                <div>
                   <h3 className="font-bold text-white text-sm">{selectedNode.data.label}</h3>
                   <div className="flex items-center gap-1 text-[10px] text-[#888888]">
                     <span className="uppercase">{selectedNode.type}</span>
                     <span>•</span>
                     <span className="font-mono">ID: {selectedNode.id}</span>
                   </div>
                </div>
              </div>
              <div className="flex gap-1">
                 <button className="p-2 hover:bg-[#333333] rounded text-[#888888] hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4" />
                 </button>
                 <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-[#333333] rounded text-[#888888] hover:text-white transition-colors">
                   <X className="w-4 h-4" />
                 </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Parameters Section */}
              <div className="p-5 space-y-6">
                
                {/* Section Title */}
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Parameters</h4>
                  <button className="text-[10px] text-[#FF6D5A] hover:underline">Open Editor</button>
                </div>

                <div className="space-y-4">
                  {/* Field: Label */}
                  <div className="space-y-1.5">
                     <label className="text-[11px] font-medium text-[#aaaaaa]">Name</label>
                     <input 
                       type="text" 
                       defaultValue={selectedNode.data.label} 
                       className="w-full bg-[#151515] border border-[#444444] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6D5A] transition-colors" 
                     />
                  </div>

                  {/* Field: Mock Dropdown */}
                  <div className="space-y-1.5">
                     <label className="text-[11px] font-medium text-[#aaaaaa]">Authentication</label>
                     <div className="relative">
                       <select className="w-full bg-[#151515] border border-[#444444] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6D5A] appearance-none cursor-pointer">
                         <option>Header Auth</option>
                         <option>Basic Auth</option>
                         <option>None</option>
                       </select>
                       <div className="absolute right-3 top-2.5 pointer-events-none">
                         <ArrowRight className="w-3 h-3 text-[#666666] rotate-90" />
                       </div>
                     </div>
                  </div>

                   {/* Field: Toggle */}
                   <div className="flex items-center justify-between py-2 border-t border-[#333333] mt-2">
                     <span className="text-[11px] text-[#aaaaaa]">Error on Empty</span>
                     <div className="w-8 h-4 bg-[#333333] rounded-full relative cursor-pointer">
                        <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-[#666666] rounded-full" />
                     </div>
                   </div>
                </div>

                {/* Input/Output Data Preview */}
                <div className="pt-6 border-t border-[#333333]">
                  <div className="flex items-center gap-4 mb-4 border-b border-[#333333]">
                     <button className="pb-2 text-xs font-bold text-[#FF6D5A] border-b-2 border-[#FF6D5A]">Output Data</button>
                     <button className="pb-2 text-xs font-medium text-[#888888] hover:text-white">Input Data</button>
                  </div>
                  
                  <div className="bg-[#151515] rounded border border-[#333333] overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-[#1a1a1a] border-b border-[#333333]">
                       <span className="text-[10px] text-[#888888]">JSON</span>
                       <div className="flex gap-2">
                         <Copy className="w-3 h-3 text-[#666666] cursor-pointer hover:text-white" />
                         <ExternalLink className="w-3 h-3 text-[#666666] cursor-pointer hover:text-white" />
                       </div>
                    </div>
                    <pre className="p-3 font-mono text-[10px] text-[#2CCF80] overflow-x-auto custom-scrollbar leading-relaxed">
{`[
  {
    "id": "12345",
    "status": "success",
    "data": {
       "message": "Processed successfully",
       "timestamp": 167890223
    }
  }
]`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-[#333333] bg-[#222222]">
               <button className="w-full py-2 bg-[#FF6D5A] hover:bg-[#ff8f80] text-white rounded text-xs font-bold transition-colors shadow-lg">
                 Execute Node
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
