import { Info } from "lucide-react";
import { useState } from "react";

export default function InfoButton({ showHelp }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative flex items-center justify-end p-4"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={showHelp}
        className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 bg-white hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
      >
        <Info className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors duration-200" />
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-5 -translate-x-1/2 bg-gray-800 text-white text-sm rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
           Info
          <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
        </div>
      )}
    </div>
  );
}
