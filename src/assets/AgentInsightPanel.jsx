import React from "react";
import { Sparkles, Search, FileText, Send } from "lucide-react"; // optional icons

const steps = [
  {
    id: 1,
    label: "Search Database",
    confidence: 0.9,
    icon: <Search size={16} />,
  },
  {
    id: 2,
    label: "Summarize Results",
    confidence: 0.75,
    icon: <FileText size={16} />,
  },
  {
    id: 3,
    label: "Generate Reply",
    confidence: 0.95,
    icon: <Send size={16} />,
  },
];

const AgentInsightPanel = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl shadow-md space-y-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="text-blue-500" size={20} />
        <h2 className="text-xl font-bold text-gray-800">
          Agent Thought Process
        </h2>
      </div>
      {steps.map((step) => (
        <div key={step.id} className="space-y-1">
          <div className="flex justify-between text-sm text-gray-700">
            <div className="flex items-center gap-2 font-medium">
              {step.icon}
              {step.label}
            </div>
            <div className="text-xs text-gray-500 font-semibold">
              {(step.confidence * 100).toFixed(0)}%
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${step.confidence * 100}%`,
                background: "linear-gradient(to right, #3b82f6, #6366f1)", // blue to indigo
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentInsightPanel;
