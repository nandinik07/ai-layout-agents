import { SEMANTIC_MAP } from './semanticMap.js';

export const executeTransformations = (layout, actions) => {
  const newLayout = JSON.parse(JSON.stringify(layout));
  
  actions.forEach(action => {
    const { action: actionType, target, direction, ratio, style } = action;
    const nodeIds = SEMANTIC_MAP[target] || [];

    switch (actionType) {
      case 'MOVE_ELEMENT':
        moveNodes(nodeIds, direction, newLayout);
        break;
      case 'SCALE_ELEMENT':
        const scaleType = action.size || action.direction || action.scale || direction; 
        scaleNodes(nodeIds, scaleType, newLayout);
        break;
      case 'CONVERT_ASPECT_RATIO':
        convertAspectRatio(action.ratio || ratio, newLayout);
        break;
      case 'CHANGE_STYLE':
        changeStyle(nodeIds, style, newLayout);
        break;
      default:
        console.warn(`Unknown action type: ${actionType}`);
    }
  });

  return newLayout;
};

const moveNodes = (nodeIds, direction, layout) => {
  if (!nodeIds.length) return;

  nodeIds.forEach(id => {
    const node = layout.nodes[id];
    if (!node) return;

    const paddingX = node.nw / 2 + 0.05;
    const paddingY = node.nh / 2 + 0.05;

    switch (direction) {
      case 'top': node.ny = paddingY; break;
      case 'bottom': node.ny = 1 - paddingY; break;
      case 'left': node.nx = paddingX; break;
      case 'right': node.nx = 1 - paddingX; break;
      case 'center': 
        node.nx = 0.5; 
        node.ny = 0.5; 
        break;
      case 'higher':
      case 'up': node.ny = Math.max(paddingY, node.ny - 0.1); break;
      case 'lower':
      case 'down': node.ny = Math.min(1 - paddingY, node.ny + 0.1); break;
    }
    
    updateRawCoordinates(node, layout.nodes[layout.rootNodes[0]]);
  });
};

const scaleNodes = (nodeIds, scaleType, layout) => {
  if (!nodeIds.length) return;
  
  let factor = 1;
  if (['larger', 'bigger', 'increase'].includes(scaleType)) factor = 1.2;
  if (['smaller', 'decrease'].includes(scaleType)) factor = 0.8;

  nodeIds.forEach(id => {
    const node = layout.nodes[id];
    if (!node) return;

    node.nw = Math.min(1, node.nw * factor);
    node.nh = Math.min(1, node.nh * factor);
    
    updateRawCoordinates(node, layout.nodes[layout.rootNodes[0]]);
  });
};

const convertAspectRatio = (ratio, layout) => {
  const canvasId = layout.rootNodes[0];
  const canvas = layout.nodes[canvasId];
  
  const RATIO_MAP = {
    '1:1': { w: 1080, h: 1080 },
    '9:16': { w: 1080, h: 1920 },
    '16:9': { w: 1920, h: 1080 },
    '4:5': { w: 1080, h: 1350 }
  };

  const newDims = RATIO_MAP[ratio];
  if (!newDims) return;

  canvas.width = newDims.w;
  canvas.height = newDims.h;

  Object.keys(layout.nodes).forEach(key => {
    if (key !== canvasId) {
      updateRawCoordinates(layout.nodes[key], canvas);
    }
  });
};

const changeStyle = (nodeIds, styleUpdates, layout) => {
  if (!nodeIds.length || !styleUpdates) return;
  nodeIds.forEach(id => {
    const node = layout.nodes[id];
    if (node && node.style) {
      node.style = { ...node.style, ...styleUpdates };
    }
  });
};

const updateRawCoordinates = (node, canvas) => {
  node.width = node.nw * canvas.width;
  node.height = node.nh * canvas.height;
  node.x = node.nx * canvas.width;
  node.y = node.ny * canvas.height;
};