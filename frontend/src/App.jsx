import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { LayoutTemplate } from 'lucide-react';
import ChatPanel from './components/ChatPanel';
import WireframePreview from './components/WireframePreview';
import JsonViewer from './components/JsonViewer';
import INITIAL_LAYOUT from './data/initialLayout.json';

export default function App() {
  const [layout, setLayout] = useState(INITIAL_LAYOUT);

  const [history, setHistory] = useState([
    {
      role: 'assistant',
      content: 'Hi! I am your AI Layout Agent. How would you like to modify this design?',
    },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSend = async (messageText) => {
    if (!messageText.trim()) return;

    const newUserMsg = {
      role: 'user',
      content: messageText,
    };

    const newHistory = [...history, newUserMsg];
    setHistory(newHistory);
    setIsProcessing(true);
    setError('');

    try {
      // Get the last 6 messages for context handling
      const recentHistory = newHistory.slice(-6);

      // ACTUAL API CALL TO YOUR NODE.JS BACKEND
      const response = await axios.post('/api/chat', {
        message: messageText,
        current_layout: layout,
        history: recentHistory
      });

      const { updated_layout, assistant_message } = response.data;

      if (updated_layout) {
        setLayout(updated_layout);
      }

      setHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: assistant_message || "Done! I've updated the layout.",
        },
      ]);
    } catch (err) {
      setHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${err.response?.data?.error || err.message}. Ensure backend is running.`,
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans p-4 md:p-6 flex flex-col gap-6">

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <LayoutTemplate size={20} className="text-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              AI Layout Agent
            </h1>
            <p className="text-xs text-gray-400">
              Hybrid Architecture: LLM Intent + Deterministic Engine
            </p>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">

        {/* Chat */}
        <div className="lg:col-span-4">
          <ChatPanel
            history={history}
            onSend={handleSend}
            isProcessing={isProcessing}
            error={error}
            chatEndRef={chatEndRef}
          />
        </div>

        {/* Preview + JSON */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="h-[60%] min-h-[400px]">
            <WireframePreview layout={layout} />
          </div>

          <div className="h-[40%] min-h-[250px]">
            <JsonViewer layout={layout} />
          </div>
        </div>
      </main>
    </div>
  );
}