import React from 'react';
import { Database, Workflow, Layout, Settings, Layers, Code, DatabaseZap } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

interface SidebarProps {
  currentView: 'architect' | 'logic' | 'builder';
  setCurrentView: (view: 'architect' | 'logic' | 'builder') => void;
  onOpenSchema: () => void;
}

export function Sidebar({ currentView, setCurrentView, onOpenSchema }: SidebarProps) {
  const menuItems = [
    { id: 'architect', label: 'Data Architect', icon: Database, color: 'text-green-400' },
    { id: 'logic', label: 'Logic Canvas', icon: Workflow, color: 'text-blue-400' },
    { id: 'builder', label: 'Page Builder', icon: Layout, color: 'text-purple-400' },
  ];

  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-xl">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-blue-500/20 to-purple-500/20"
          />
          <DatabaseZap className="w-6 h-6 text-white relative z-10" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-white">NexusAI</h1>
          <p className="text-xs text-slate-400">v1.0.0-beta</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Platform</div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as any)}
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
              currentView === item.id 
                ? "bg-slate-800 text-white shadow-lg shadow-black/20" 
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            )}
          >
            {currentView === item.id && (
              <motion.div
                layoutId="activeTab"
                className={clsx("absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b rounded-r", 
                  item.id === 'architect' ? "from-green-400 to-green-600" :
                  item.id === 'logic' ? "from-blue-400 to-blue-600" :
                  "from-purple-400 to-purple-600"
                )}
              />
            )}
            <item.icon className={clsx("w-5 h-5 transition-colors", currentView === item.id ? item.color : "text-slate-500 group-hover:text-slate-300")} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}

        <div className="mt-8 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Tools</div>
        <button
           onClick={onOpenSchema}
           className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all"
        >
          <Code className="w-5 h-5 text-slate-500" />
          <span className="font-medium">Schema View</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
          <Settings className="w-5 h-5 text-slate-500" />
          <span className="font-medium">Settings</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-medium text-slate-200 truncate">John Doe</div>
            <div className="text-xs text-slate-500 truncate">john@nexus.ai</div>
          </div>
        </div>
      </div>
    </div>
  );
}
