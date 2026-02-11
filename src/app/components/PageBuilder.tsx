import React, { useState } from 'react';
import { 
  BarChart as BarChartIcon, 
  Table as TableIcon, 
  Search, 
  LayoutDashboard, 
  PieChart, 
  Type, 
  Image as ImageIcon, 
  Trash2, 
  GripVertical,
  Link as LinkIcon,
  Plus,
  Eye,
  Rocket,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  Settings,
  MoreVertical
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

// Widget Types
type WidgetType = 'chart' | 'table' | 'search' | 'text' | 'metric';

interface Widget {
  id: string;
  type: WidgetType;
  title: string;
}

const MOCK_CHART_DATA = [
  { name: 'Jan', sales: 4000, visits: 2400 },
  { name: 'Feb', sales: 3000, visits: 1398 },
  { name: 'Mar', sales: 2000, visits: 9800 },
  { name: 'Apr', sales: 2780, visits: 3908 },
  { name: 'May', sales: 1890, visits: 4800 },
  { name: 'Jun', sales: 2390, visits: 3800 },
];

export function PageBuilder() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [slug, setSlug] = useState('/dashboard/overview');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const addWidget = (type: WidgetType) => {
    const id = Math.random().toString(36).substr(2, 9);
    let title = 'New Widget';
    if (type === 'chart') title = 'Revenue Analytics';
    if (type === 'table') title = 'Live Transactions';
    if (type === 'search') title = 'Global Search';
    if (type === 'metric') title = 'Active Users';
    
    setWidgets([...widgets, { id, type, title }]);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  return (
    <div className="flex h-full w-full bg-slate-950 flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Bar - IDE Style */}
      <div className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 z-20 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center border border-purple-500/30">
               <LayoutDashboard className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-100 leading-none">Visual Builder</h1>
              <p className="text-[10px] text-slate-500 font-medium">v2.4.0 • Auto-saving...</p>
            </div>
          </div>
          
          <div className="h-8 w-px bg-slate-800" />
          
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-1">
            <button onClick={() => setDevice('desktop')} className={clsx("p-1.5 rounded-md transition-all", device === 'desktop' ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300")}>
              <Monitor className="w-4 h-4" />
            </button>
            <button onClick={() => setDevice('tablet')} className={clsx("p-1.5 rounded-md transition-all", device === 'tablet' ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300")}>
              <Tablet className="w-4 h-4" />
            </button>
            <button onClick={() => setDevice('mobile')} className={clsx("p-1.5 rounded-md transition-all", device === 'mobile' ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300")}>
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5">
             <span className="text-xs text-slate-500 font-mono">nexus.ai/app</span>
             <input 
               type="text" 
               value={slug}
               onChange={(e) => setSlug(e.target.value)}
               className="bg-transparent text-xs text-purple-300 font-mono focus:outline-none min-w-[140px]"
             />
           </div>
           
           <div className="flex items-center gap-2">
             <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
               <Eye className="w-4 h-4" />
             </button>
             <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-purple-900/20 transition-all flex items-center gap-2">
               <Rocket className="w-3.5 h-3.5" />
               Deploy
             </button>
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component Library */}
        <div className="w-72 border-r border-slate-800 bg-slate-900/30 backdrop-blur-sm p-0 flex flex-col z-10">
          <div className="p-4 border-b border-slate-800/50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-3.5 h-3.5" />
              Widget Library
            </h3>
          </div>
          
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            <div className="text-[10px] font-semibold text-slate-600 uppercase mb-2">Data Visualization</div>
            <DraggableItem icon={BarChartIcon} label="Bar Chart" description="Compare categorical data" onClick={() => addWidget('chart')} />
            <DraggableItem icon={LayoutDashboard} label="Metric Card" description="Key performance indicators" onClick={() => addWidget('metric')} />
            
            <div className="text-[10px] font-semibold text-slate-600 uppercase mb-2 mt-6">Tables & Lists</div>
            <DraggableItem icon={TableIcon} label="Data Table" description="Display rows of data" onClick={() => addWidget('table')} />
            
            <div className="text-[10px] font-semibold text-slate-600 uppercase mb-2 mt-6">Form Elements</div>
            <DraggableItem icon={Search} label="Search Bar" description="Filter content" onClick={() => addWidget('search')} />
            <DraggableItem icon={Type} label="Text Block" description="Static content" onClick={() => addWidget('text')} />
          </div>

          <div className="p-4 bg-slate-900/80 border-t border-slate-800">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <h4 className="text-xs font-bold text-indigo-300 mb-1 flex items-center gap-1">
                <LinkIcon className="w-3 h-3" />
                Data Binding
              </h4>
              <p className="text-[10px] text-indigo-200/60 leading-relaxed">
                Widgets are automatically linked to the active Logic Flow. Drag to connect specific endpoints.
              </p>
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 bg-slate-950 p-8 overflow-y-auto relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.03) 0%, transparent 70%)' 
               }} 
          />

          <div className={clsx(
            "mx-auto min-h-[800px] transition-all duration-500 ease-in-out border border-dashed border-slate-800 rounded-2xl bg-slate-900/20 backdrop-blur-sm relative shadow-2xl overflow-hidden",
            device === 'desktop' ? "max-w-6xl" : device === 'tablet' ? "max-w-3xl" : "max-w-sm"
          )}>
            
            {widgets.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 pointer-events-none">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800 shadow-xl">
                  <LayoutDashboard className="w-8 h-8 text-slate-500 opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-slate-400 mb-2">Start Building</h3>
                <p className="text-sm text-slate-600">Drag components from the sidebar to create your dashboard</p>
              </div>
            )}

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
              <AnimatePresence>
                {widgets.map((widget) => (
                  <motion.div
                    key={widget.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={clsx(
                      "bg-slate-900/80 backdrop-blur-md border border-slate-800/60 rounded-xl shadow-lg hover:shadow-2xl hover:border-purple-500/30 transition-all duration-300 group relative flex flex-col overflow-hidden",
                      widget.type === 'chart' ? "col-span-2 row-span-2 min-h-[360px]" : "min-h-[180px]"
                    )}
                  >
                    {/* Widget Header */}
                    <div className="h-10 bg-slate-800/30 border-b border-slate-800/50 flex items-center justify-between px-4 cursor-move opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 left-0 right-0 z-10 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                         <GripVertical className="w-3.5 h-3.5 text-slate-500" />
                         <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">{widget.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-400 hover:text-white transition-colors">
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => removeWidget(widget.id)} className="p-1.5 hover:bg-red-500/10 rounded-md text-slate-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Widget Content */}
                    <div className="flex-1 p-5 relative flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-200">{widget.title}</h3>
                        <div className="flex items-center gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
                           <span className="text-[10px] text-slate-500 font-mono">Live</span>
                        </div>
                      </div>

                      {widget.type === 'chart' && (
                        <div className="flex-1 min-h-0 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_CHART_DATA}>
                              <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px', fontSize: '12px' }}
                                itemStyle={{ color: '#a78bfa' }}
                                cursor={{ stroke: '#475569', strokeWidth: 1 }}
                              />
                              <Area type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                      
                      {widget.type === 'table' && (
                        <div className="flex-1 overflow-hidden rounded-lg border border-slate-800 bg-slate-950/50">
                           <table className="w-full text-left text-xs text-slate-400">
                             <thead className="bg-slate-900 text-slate-300 font-bold uppercase tracking-wider">
                               <tr>
                                 <th className="p-3">ID</th>
                                 <th className="p-3">Value</th>
                                 <th className="p-3 text-right">State</th>
                               </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-800">
                               {[1,2,3].map((i) => (
                                 <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                   <td className="p-3 font-mono text-slate-500">#TRX-00{i}</td>
                                   <td className="p-3 font-medium text-white">${(Math.random() * 1000).toFixed(2)}</td>
                                   <td className="p-3 text-right">
                                     <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20">Success</span>
                                   </td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                        </div>
                      )}

                      {widget.type === 'search' && (
                        <div className="relative group/search">
                          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 group-hover/search:text-purple-400 transition-colors" />
                          <input 
                            type="text" 
                            placeholder="Type to filter results..." 
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600" 
                          />
                        </div>
                      )}

                      {widget.type === 'metric' && (
                         <div className="flex flex-col justify-end h-full pb-2">
                           <div className="flex items-end justify-between">
                             <div>
                               <div className="text-4xl font-bold text-white tracking-tight">24.5k</div>
                               <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Total Active Users</div>
                             </div>
                             <div className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                               <Rocket className="w-3 h-3" />
                               <span>+12.5%</span>
                             </div>
                           </div>
                           <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                             <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full w-[70%]" />
                           </div>
                         </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DraggableItem({ icon: Icon, label, description, onClick }: { icon: any, label: string, description: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-900/80 transition-all group text-left relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 group-hover:bg-slate-800 group-hover:border-purple-500/30 transition-colors z-10">
        <Icon className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
      </div>
      <div className="flex-1 z-10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{label}</span>
          <Plus className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0 translate-x-2" />
        </div>
        <span className="text-[10px] text-slate-500 block mt-0.5">{description}</span>
      </div>
    </button>
  );
}
