import React from 'react';
import { Code } from 'lucide-react';

const JsonViewer = ({ layout }) => {
  return (
    <div className="w-full h-full bg-gray-950 rounded-xl border border-gray-800 flex flex-col overflow-hidden">
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="text-xs font-mono text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-2">
          <Code size={14} /> Live JSON State
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <pre className="text-[11px] font-mono text-green-400 leading-relaxed">
          {JSON.stringify(layout, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default JsonViewer;
