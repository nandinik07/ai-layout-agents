import React from 'react';

const PromptButtons = ({ onSend }) => {
  const SUGGESTIONS = [
    "Convert this design to 9:16",
    "Move headline to top",
    "Center the product",
    "Make discount badge bigger",
    "Change headline color to red",
    "Make it smaller"
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {SUGGESTIONS.map((sug, i) => (
        <button
          key={i}
          onClick={() => onSend(sug)}
          className="text-[11px] bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 hover:border-gray-500 rounded-full px-3 py-1 transition-colors whitespace-nowrap"
        >
          {sug}
        </button>
      ))}
    </div>
  );
};

export default PromptButtons;