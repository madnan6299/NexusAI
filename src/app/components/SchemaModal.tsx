import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // Assuming standard Shadcn-like structure if available, or I'll implement a custom modal if not.
// Wait, I don't have shadcn installed. I should implement a custom modal or simple overlay.
// I see @radix-ui/react-dialog in package.json, so I can use that or just a simple generic modal.
// I'll stick to a simple custom modal for speed and fewer dependency issues, using the standard pattern.

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export function SchemaModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-800 bg-slate-900 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-xl">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight text-white">Suggested Database Schema</DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm text-slate-400">
              To support the dynamic node architecture of NexusAI, we recommend the following Supabase (PostgreSQL) schema.
            </DialogPrimitive.Description>
          </div>

          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-sm text-slate-300 font-mono">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <h3 className="text-green-400 font-bold mb-2">1. Workflows & Nodes</h3>
              <pre className="whitespace-pre-wrap opacity-80">
{`TABLE workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

TABLE nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES workflows(id),
  type TEXT NOT NULL, -- 'api_trigger', 'filter', 'db_query'
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  config JSONB DEFAULT '{}'::JSONB -- Stores node specific settings
);

TABLE edges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES workflows(id),
  source_node_id UUID REFERENCES nodes(id),
  target_node_id UUID REFERENCES nodes(id),
  source_handle TEXT,
  target_handle TEXT
);`}
              </pre>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <h3 className="text-blue-400 font-bold mb-2">2. Data Mapping</h3>
              <pre className="whitespace-pre-wrap opacity-80">
{`TABLE data_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES workflows(id),
  type TEXT NOT NULL, -- 'postgres', 'mongo', 'rest_api'
  connection_string TEXT, -- Encrypted
  schema_cache JSONB -- Cached structure of external DB
);

TABLE mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id UUID REFERENCES nodes(id),
  external_field TEXT,
  internal_variable TEXT,
  transform_rule TEXT
);`}
              </pre>
            </div>
          </div>

          <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <DialogPrimitive.Close className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
