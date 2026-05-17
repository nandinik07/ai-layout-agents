export const validateLayout = (layout) => {
  if (!layout || typeof layout !== 'object') {
    throw new Error("Invalid layout object");
  }
  if (!Array.isArray(layout.rootNodes)) {
    throw new Error("Layout must contain 'rootNodes' array");
  }
  if (!layout.nodes || typeof layout.nodes !== 'object') {
    throw new Error("Layout must contain 'nodes' object");
  }
};

export const validateChatRequest = (body) => {
  if (!body.message || typeof body.message !== 'string') {
    throw new Error("Message string is required");
  }
  if (!Array.isArray(body.history)) {
    throw new Error("History must be an array");
  }
};