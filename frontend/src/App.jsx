export default function App() {
  const [layout, setLayout] = useState(INITIAL_LAYOUT);

  const [history, setHistory] = useState([
    {
      role: 'assistant',
      content:
        'Hi! I am your AI Layout Agent. How would you like to modify this design?',
    },
  ]);

  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSend = async (messageText) => {
    const text = messageText || input;

    if (!text.trim()) return;

    if (!apiKey) {
      setError(
        'Please enter your OpenAI API key in the top right to continue.'
      );

      setTimeout(() => setError(''), 5000);

      return;
    }

    const newUserMsg = {
      role: 'user',
      content: text,
    };

    const newHistory = [...history, newUserMsg];

    setHistory(newHistory);
    setInput('');
    setIsProcessing(true);
    setError('');

    try {
      const recentHistory = newHistory.slice(-6);

      const llmResponse = await fetchOpenAIResponse(
        text,
        recentHistory,
        apiKey
      );

      if (llmResponse.actions && llmResponse.actions.length > 0) {
        const updatedLayout = executeTransformations(
          layout,
          llmResponse.actions
        );

        setLayout(updatedLayout);
      }

      setHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            llmResponse.assistant_message ||
            "Done! I've updated the layout.",
        },
      ]);
    } catch (err) {
      setHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${err.message}. Please check your API key and try again.`,
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

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Settings size={16} className="text-gray-500" />

          <input
            type="password"
            placeholder="Enter OpenAI API Key (sk-...)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1 md:w-64 bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-600 transition-all"
          />
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">

        {/* Chat */}
        <div className="lg:col-span-4">
          <ChatPanel
            history={history}
            input={input}
            setInput={setInput}
            handleSend={handleSend}
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