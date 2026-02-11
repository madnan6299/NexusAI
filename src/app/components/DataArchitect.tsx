import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Database, Plus, RefreshCw, CheckCircle2, Server, Globe, Search, BrainCircuit, Share2 } from 'lucide-react';
import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

// Mock Data for "Scanned" Tables
const SCANNED_TABLES = [
  { id: 'users', label: 'Users', fields: ['id', 'email', 'password_hash', 'created_at'] },
  { id: 'orders', label: 'Orders', fields: ['id', 'user_id', 'total_amount', 'status'] },
  { id: 'products', label: 'Products', fields: ['id', 'name', 'sku', 'inventory_count'] },
  { id: 'analytics', label: 'Analytics', fields: ['id', 'event_type', 'metadata', 'timestamp'] },
];

export function DataArchitect() {
  const [scanning, setScanning] = useState(false);
  const [connected, setConnected] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const startScan = () => {
    setScanning(true);
    setNodes([]);
    setEdges([]);
    
    // Simulate Scanning Process
    setTimeout(() => {
      const newNodes: Node[] = SCANNED_TABLES.map((table, index) => ({
        id: table.id,
        type: 'default',
        position: { x: 250 + (index % 2) * 400, y: 100 + Math.floor(index / 2) * 250 },
        data: { 
          label: (
            <div className="text-left min-w-[200px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="font-bold text-green-400 flex items-center gap-2">
                   <Database className="w-3 h-3" />
                   {table.label}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)] animate-pulse" />
              </div>
              <div className="space-y-1.5">
                {table.fields.map(f => (
                  <div key={f} className="text-[10px] text-slate-400 font-mono flex items-center justify-between group/field hover:text-green-300 transition-colors">
                    <span className="flex items-center gap-2">
                       <span className="w-1 h-1 rounded-full bg-slate-600 group-hover/field:bg-green-500 transition-colors"></span>
                       {f}
                    </span>
                    <span className="text-[9px] text-slate-600 uppercase">VARCHAR</span>
                  </div>
                ))}
              </div>
            </div>
          )
        },
        style: { 
          background: 'rgba(15, 23, 42, 0.9)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(34, 197, 94, 0.3)', 
          color: 'white', 
          boxShadow: '0 0 40px -10px rgba(34, 197, 94, 0.2)',
          borderRadius: '12px',
          padding: '16px',
        },
      }));

      // Add Central AI Core Node
      newNodes.push({
        id: 'ai-core',
        type: 'input',
        position: { x: 450, y: 250 },
        data: { label: 'AI Model Core' },
        style: {
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(34,197,94,0.2), rgba(15,23,42,1))',
          border: '2px solid #22c55e',
          boxShadow: '0 0 50px rgba(34,197,94,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4ade80',
          fontSize: '10px',
          fontWeight: 'bold'
        }
      });

      // Create connections from AI Core to Tables
      const newEdges: Edge[] = SCANNED_TABLES.map(t => ({
        id: `e-core-${t.id}`,
        source: 'ai-core',
        target: t.id,
        animated: true,
        style: { stroke: '#22c55e', strokeWidth: 1, opacity: 0.6 }
      }));

      // Inter-table connections
      newEdges.push(
        { id: 'e1-2', source: 'users', target: 'orders', animated: true, style: { stroke: '#3b82f6', opacity: 0.5 } },
        { id: 'e2-3', source: 'orders', target: 'products', animated: true, style: { stroke: '#3b82f6', opacity: 0.5 } }
      );

      setNodes(newNodes);
      setEdges(newEdges);
      setScanning(false);
      setConnected(true);
    }, 3000);
  };

  return (
    <div className="flex h-full w-full bg-slate-950">
      {/* Left Sidebar for Data Sources */}
      <div className="w-80 border-r border-slate-800 bg-slate-900/50 flex flex-col z-10 backdrop-blur-sm">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Share2 className="w-3 h-3" />
            Data Sources
          </h2>
        </div>
        
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          <div className="p-4 rounded-xl border border-green-500/30 bg-gradient-to-br from-green-500/5 to-slate-900 group cursor-pointer hover:border-green-500/50 transition-all relative overflow-hidden">
            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-3 relative">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-slate-900 border border-slate-700">
                   <Database className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="font-bold text-green-100 text-sm">PostgreSQL PROD</div>
                  <div className="text-[10px] text-green-400/60 font-mono">192.168.1.42:5432</div>
                </div>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
            </div>
            
            {connected ? (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="w-full py-2 rounded-lg bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20 flex items-center justify-center gap-2 cursor-default"
               >
                 <CheckCircle2 className="w-3.5 h-3.5" />
                 AI Model Generated
               </motion.div>
            ) : (
              <button 
                onClick={startScan}
                disabled={scanning}
                className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
              >
                {scanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <BrainCircuit className="w-3.5 h-3.5" />}
                {scanning ? 'Analyzing Schema...' : 'Generate AI Model'}
              </button>
            )}
          </div>

          {/* Other Sources */}
          {[
            { name: 'MongoDB Logs', icon: Globe, color: 'blue', status: 'offline' },
            { name: 'Redis Cache', icon: Server, color: 'red', status: 'offline' }
          ].map((source) => (
            <div key={source.name} className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 opacity-60 hover:opacity-100 transition-all cursor-not-allowed">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded bg-slate-900 border border-slate-800">
                     <source.icon className={`w-4 h-4 text-${source.color}-400`} />
                   </div>
                  <span className="font-medium text-slate-300 text-sm">{source.name}</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-slate-800" />
              </div>
            </div>
          ))}

          <button className="w-full py-3 border border-dashed border-slate-700 rounded-xl text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider mt-4">
            <Plus className="w-4 h-4" />
            Connect New Source
          </button>
        </div>
      </div>

      {/* Main Graph Area */}
      <div className="flex-1 relative h-full bg-slate-950 overflow-hidden min-h-[500px]">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)' 
             }} 
        />

        {scanning && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md">
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Pulsing Rings */}
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute border border-green-500/30 rounded-full"
                  initial={{ width: 100, height: 100, opacity: 0 }}
                  animate={{ 
                    width: [100, 300], 
                    height: [100, 300], 
                    opacity: [0.5, 0],
                    borderWidth: [1, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.6,
                    ease: "easeOut" 
                  }}
                />
              ))}
              
              {/* Central Brain */}
              <motion.div 
                 animate={{ scale: [1, 1.1, 1] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                 className="relative z-10"
              >
                <BrainCircuit className="w-24 h-24 text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
              </motion.div>
            </div>
            
            <div className="mt-8 flex flex-col items-center gap-2">
               <h3 className="text-xl font-bold text-white tracking-tight">analyzing schema structure</h3>
               <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
            </div>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          className="bg-slate-950"
          style={{ width: '100%', height: '100%' }}
        >
          <Background color="#1e293b" gap={30} size={1} />
          <Controls className="bg-slate-800 border-slate-700 fill-slate-400 rounded-lg overflow-hidden border" />
        </ReactFlow>
        
        {!connected && !scanning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
               <div className="relative inline-flex mb-6">
                 <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                 <BrainCircuit className="w-20 h-20 text-slate-600 relative z-10" />
               </div>
               <h3 className="text-2xl font-bold text-slate-200 mb-2 tracking-tight">AI Data Architect</h3>
               <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                 Connect a data source to begin. The AI will scan your schema and generate an interactive relationship model.
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
