import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DataArchitect } from './components/DataArchitect';
import { LogicCanvas } from './components/LogicCanvas';
import { PageBuilder } from './components/PageBuilder';
import { SchemaModal } from './components/SchemaModal';
import { Toaster } from 'sonner';

export default function App() {
  const [currentView, setCurrentView] = useState<'architect' | 'logic' | 'builder'>('architect');
  const [showSchema, setShowSchema] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-green-500/30 selection:text-green-200">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onOpenSchema={() => setShowSchema(true)} />
      
      <main className="flex-1 h-full relative overflow-hidden">
        {currentView === 'architect' && <DataArchitect />}
        {currentView === 'logic' && <LogicCanvas />}
        {currentView === 'builder' && <PageBuilder />}
      </main>

      <SchemaModal open={showSchema} onOpenChange={setShowSchema} />
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}
