import React, { useEffect, useState } from "react";

interface WidgetProps {
  isEditorFocused: boolean;
}

const Widget: React.FC<WidgetProps> = ({ isEditorFocused }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Add a slight delay to the appearance for a smoother experience
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isEditorFocused) {
      // Small delay before showing to make the animation feel more natural
      timeoutId = setTimeout(() => {
        setIsVisible(true);
      }, 300);
    } else {
      setIsVisible(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isEditorFocused]);

  return (
    <div
      className={`w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden transition-all duration-300 ease-in-out transform ${
        isVisible ? "opacity-100 translate-y-0 max-h-[500px]" : "opacity-0 -translate-y-4 max-h-0 pointer-events-none"
      }`}
    >
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">Keyboard Shortcuts</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex flex-col">
            <h4 className="text-sm font-medium text-gray-600 pb-2 mb-2 border-b border-gray-100">Navigation</h4>
            <div className="flex items-center justify-between mb-2">
              <div className="flex space-x-1">
                <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 bg-gray-100 border border-gray-200 rounded text-xs font-medium text-gray-700">↑</span>
                <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 bg-gray-100 border border-gray-200 rounded text-xs font-medium text-gray-700">↓</span>
              </div>
              <span className="text-xs text-gray-600">Navigate suggestions</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 bg-gray-100 border border-gray-200 rounded text-xs font-medium text-gray-700">Tab</span>
              <span className="text-xs text-gray-600">Select suggestion</span>
            </div>
          </div>

          <div className="flex flex-col">
            <h4 className="text-sm font-medium text-gray-600 pb-2 mb-2 border-b border-gray-100">Actions</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center justify-center min-w-[40px] h-7 px-1.5 bg-gray-100 border border-gray-200 rounded text-xs font-medium text-gray-700">Enter</span>
              <span className="text-xs text-gray-600">Select suggestion</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 bg-gray-100 border border-gray-200 rounded text-xs font-medium text-gray-700">Esc</span>
              <span className="text-xs text-gray-600">Close suggestions</span>
            </div>
          </div>

          <div className="flex flex-col">
            <h4 className="text-sm font-medium text-gray-600 pb-2 mb-2 border-b border-gray-100">Templates</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 bg-gray-100 border border-gray-200 rounded text-xs font-medium text-gray-700 font-mono">
                {"{"}
                {"{"}
                {"}"}
                {"}"}
              </span>
              <span className="text-xs text-gray-600">Open suggestions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widget;
