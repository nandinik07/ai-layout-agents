import React from 'react';
import { LayoutTemplate } from 'lucide-react';

const WireframePreview = ({ layout }) => {
  const canvasId = layout.rootNodes[0];
  const canvas = layout.nodes[canvasId];
  const canvasStyle = {
    aspectRatio: `${canvas.width} / ${canvas.height}`,
    backgroundColor: canvas.style?.backgroundColor || '#ffffff',
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-xl border border-gray-800 p-4 overflow-hidden relative">
      <div className="absolute top-2 left-4 text-xs font-mono text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-2">
        <LayoutTemplate size={14} /> Wireframe Preview
      </div>
      
      <div className="relative max-w-full max-h-full flex items-center justify-center w-full h-full mt-6">
         <div 
           className="relative shadow-2xl transition-all duration-500 ease-in-out border border-gray-200 overflow-hidden" 
           style={{ ...canvasStyle, maxHeight: '100%', maxWidth: '100%', height: 'auto' }}
         >
           {Object.keys(layout.nodes).map(key => {
             if (key === canvasId) return null;
             const node = layout.nodes[key];
             
             const nodeStyle = {
               position: 'absolute',
               left: `${node.nx * 100}%`,
               top: `${node.ny * 100}%`,
               width: `${node.nw * 100}%`,
               height: `${node.nh * 100}%`,
               transform: 'translate(-50%, -50%)',
               transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               textAlign: node.style?.textAlign || 'center',
               ...node.style,
               fontSize: node.style?.fontSize ? `${node.style.fontSize / 16}cqw` : undefined,
             };

             if (node.type === 'shape' && node.shapeType === 'circle') {
               nodeStyle.borderRadius = '50%';
             }

             return (
               <div key={node.id} style={nodeStyle} className="container-type-inline-size">
                 {node.type === 'image' && (
                   <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2 border-2 border-dashed border-gray-400 rounded-xl bg-gray-100">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Image</span>
                   </div>
                 )}
                 {node.type === 'text' && (
                   <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.1 }}>{node.text}</span>
                 )}
               </div>
             );
           })}
         </div>
      </div>
    </div>
  );
};

export default WireframePreview;