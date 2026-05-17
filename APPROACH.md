Architecture & Approach Document

Why Hybrid Architecture?

Using Large Language Models (LLMs) directly for layout generation (e.g., asking ChatGPT to output explicit X/Y coordinates) is fundamentally flawed. LLMs lack spatial awareness and frequently hallucinate overlapping coordinates, broken bounds, and incorrect math.

By using a Hybrid Architecture, we play to the strengths of both systems:

LLM Strength: Natural language understanding, contextual referencing ("make it smaller"), and intent classification.

Deterministic Code Strength: Flawless math execution, constraint enforcement, and state safety.

Normalized Coordinates (nx, ny)

Instead of calculating raw pixels, elements are positioned using normalized floating-point coordinates from 0.0 to 1.0.

nx = 0.5, ny = 0.5 is perfectly centered.

nw = 1.0 means 100% of the canvas width.

Advantage: When a user asks to "Convert this design to 9:16", the deterministic engine only needs to change the canvas width and height. Because all child nodes are mapped using nx/ny, their exact raw pixel coordinates can be instantly recalculated using standard multiplication without shifting the layout composition.

Follow-up Context Handling

Context handling is achieved by passing a sliding window of the last 6 conversation messages to the OpenAI API.

User: "Move the headline to the top"

User: "Make it smaller"

Because the system prompt sees the history, it seamlessly recognizes that "it" refers to the "headline" object and outputs the correct semantic target for the deterministic engine to process.

Grouped Compound Elements

Elements like the offer_badge are treated as grouped entities. The system maps the semantic term offer_badge to an array of IDs: ['circle_123', 'text_456']. The transformation engine iterates through this array and applies identical vector translations and scale multipliers to both objects, ensuring they never separate visually during layout adjustments.

Tradeoffs and Future Improvements

Tradeoff: The current wireframe preview uses DOM HTML scaling rather than a HTML5 <canvas>. This is simpler to implement and highly responsive, but not suitable for high-fidelity PSD/Figma export.

Future Improvement: Expanding the deterministic engine to handle flexbox-style auto-layout rows/columns and collision detection so elements do not overlap when dynamically scaled.