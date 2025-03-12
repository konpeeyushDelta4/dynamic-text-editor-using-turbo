import { useCallback, useState, useEffect, useRef } from "react";
import { useQuill, useRegex, usePaint } from "./hooks";
import "quill/dist/quill.snow.css";
import "../styles/fluidAnimation.css";
import "../styles/editor.css";
import "../styles/suggestions.css";
import { ImprovedSuggestions } from "../components";

interface EditorProps {
  onFocusChange?: (isFocused: boolean) => void;
}

const Editor: React.FC<EditorProps> = ({ onFocusChange }) => {
  const { quillRef, quillInstance } = useQuill();
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  // Create an additional ref for the editor container (not the Quill ref)
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Use our regex hook
  const { showSuggestions, position, filteredSuggestions, selectedIndex, setSelectedIndex, selectSuggestion } = useRegex({ quillInstance });

  // Use our paint hook to highlight templates
  usePaint({ quillInstance });

  // Handle click anywhere in the editor container
  const handleEditorClick = useCallback(() => {
    // Focus the Quill editor if it exists
    if (quillInstance) {
      quillInstance.focus();
      setIsEditorFocused(true);
    } else if (quillRef.current) {
      // Fallback to focusing the container if Quill isn't initialized
      const editableElement = quillRef.current.querySelector('[contenteditable="true"]');
      if (editableElement) {
        (editableElement as HTMLElement).focus();
        setIsEditorFocused(true);
      }
    }
  }, [quillInstance, quillRef]);

  // Handle focus and blur events to control animation
  useEffect(() => {
    const handleFocus = () => {
      setIsEditorFocused(true);
      if (onFocusChange) onFocusChange(true);
    };

    const handleBlur = () => {
      setIsEditorFocused(false);
      if (onFocusChange) onFocusChange(false);
    };

    // Add event listeners to detect focus/blur on the editor
    const editorElement = quillRef.current?.querySelector(".ql-editor");
    if (editorElement) {
      editorElement.addEventListener("focus", handleFocus);
      editorElement.addEventListener("blur", handleBlur);
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener("focus", handleFocus);
        editorElement.removeEventListener("blur", handleBlur);
      }
    };
  }, [onFocusChange, quillRef]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 relative overflow-hidden">
      {/* Full-covering fluid animation background */}
      <div className={`fluid-animation-container ${isEditorFocused ? "active" : ""}`}>
        <div className="fluid-blob blob-1"></div>
        <div className="fluid-blob blob-2"></div>
        <div className="fluid-blob blob-3"></div>
        <div className="fluid-blob blob-4"></div>
        <div className="fluid-blob blob-5"></div>
        <div className="fluid-blob blob-6"></div> {/* Added extra blob for better coverage */}
      </div>

      {/* Main container with glassmorphism */}
      <div className="glassmorphism-container relative z-10 p-4 rounded-xl shadow-xl">
        {/* Header */}
        <div className="mb-5 relative z-10">
          {/* <h2 className="text-xl font-bold text-gray-800">Dynamic Prompt Editor</h2> */}
          <p className="text-sm text-gray-600">
            Type your prompt in <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-600 font-medium border border-orange-200">{`{{`}</span> to get started.
          </p>
        </div>

        {/* The container for Quill editor with glassmorphism effect */}
        <div
          ref={editorContainerRef}
          className={`editor-container border border-gray-200/30 rounded-lg overflow-hidden cursor-text relative z-10 transition-all duration-500 ${
            isEditorFocused ? "editor-focused glassmorphism-active" : "glassmorphism-inactive"
          }`}
          onClick={handleEditorClick}
        >
          <div ref={quillRef} className="min-h-[300px] max-h-[400px] overflow-y-auto"></div>

          {/* Pass the editor container ref to ImprovedSuggestions */}
          <ImprovedSuggestions
            isVisible={showSuggestions}
            position={position}
            filteredSuggestions={filteredSuggestions}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            selectSuggestion={selectSuggestion}
            editorRef={editorContainerRef}
          />
        </div>

        {/* Word count or other UI elements */}
        <div className="mt-3 text-xs text-gray-600 flex justify-between relative z-10">
          <span>{isEditorFocused ? "Editing mode" : "Click to edit"}</span>
        </div>
      </div>
    </div>
  );
};

export default Editor;
