import express from 'express';
import { processChatRequest } from '../services/openaiService.js';
import { executeTransformations } from '../services/transformationEngine.js';
import { validateLayout, validateChatRequest } from '../utils/validators.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, current_layout, history } = req.body;
    
    validateChatRequest(req.body);
    validateLayout(current_layout);

    const llmResponse = await processChatRequest(message, history, current_layout);

    let updated_layout = current_layout;

    if (llmResponse.actions && llmResponse.actions.length > 0) {
      updated_layout = executeTransformations(current_layout, llmResponse.actions);
    }

    res.json({
      updated_layout,
      assistant_message: llmResponse.assistant_message
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;