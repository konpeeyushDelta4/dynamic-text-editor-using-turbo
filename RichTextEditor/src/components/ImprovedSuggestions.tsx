import React, { useEffect, useRef, useCallback, useMemo } from "react";
import ReactDOM from "react-dom";
import { Suggestions } from "../components";
import { ImprovedSuggestionsProps } from "../types";

const ImprovedSuggestions: React.FC<ImprovedSuggestionsProps> = ({ isVisible, position, filteredSuggestions, selectedIndex, setSelectedIndex, selectSuggestion, editorRef }) => {
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const initialPositionSetRef = useRef(false);

  // Memoize the position to prevent unnecessary re-renders
  const stablePosition = useMemo(() => {
    if (!isVisible || !editorRef?.current) return { top: 0, left: 0 };

    // Only calculate position once per visibility session
    if (initialPositionSetRef.current) {
      return { top: suggestionsRef.current?.offsetTop || 0, left: suggestionsRef.current?.offsetLeft || 0 };
    }

    // Get editor position
    const editorRect = editorRef.current.getBoundingClientRect();

    // Position based on cursor coordinates, but convert to viewport-relative
    const cursorX = editorRect.left + position.left;
    const cursorY = editorRect.top + position.top;

    // Calculate available space and adjust position if needed
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const suggestionsHeight = Math.min(384, filteredSuggestions.length * 65 + 20); // Reduced height without header/footer
    const suggestionsWidth = 380;

    // Check if we need to position above cursor instead of below (if near bottom of viewport)
    const willOverflowBottom = cursorY + suggestionsHeight > viewportHeight - 20;
    const willOverflowRight = cursorX + suggestionsWidth > viewportWidth - 20;

    // Calculate new position
    const newTop = cursorY + window.scrollY + (willOverflowBottom ? -suggestionsHeight : 8);
    const newLeft = willOverflowRight ? cursorX + window.scrollX - suggestionsWidth + 100 : cursorX + window.scrollX;

    return { top: newTop, left: newLeft };
  }, [isVisible, editorRef, position.left, position.top, filteredSuggestions.length]);

  // Handle mouse events to prevent focus issues
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Prevent the editor from losing focus when clicking on suggestions
    e.preventDefault();
  }, []);

  // Apply the position to the element only once when it becomes visible
  useEffect(() => {
    if (!isVisible || !suggestionsRef.current) {
      initialPositionSetRef.current = false;
      return;
    }

    if (!initialPositionSetRef.current) {
      const suggestionsEl = suggestionsRef.current;
      suggestionsEl.style.top = `${stablePosition.top}px`;
      suggestionsEl.style.left = `${stablePosition.left}px`;
      suggestionsEl.style.width = `380px`;

      initialPositionSetRef.current = true;
    }
  }, [isVisible, stablePosition]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      initialPositionSetRef.current = false;
    };
  }, []);

  // Don't render anything if not visible
  if (!isVisible) return null;

  // Don't render if no suggestions
  if (filteredSuggestions.length === 0) return null;

  return ReactDOM.createPortal(
    <div
      ref={suggestionsRef}
      className="fixed z-[9999] suggestions-container"
      onMouseDown={handleMouseDown}
      style={{
        position: "fixed",
        zIndex: 9999,
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      <div className="bg-white rounded-lg border border-gray-300 shadow-lg suggestions-wrapper">
        <div ref={listContainerRef} className="suggestions-list-container">
          <Suggestions filteredSuggestions={filteredSuggestions} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} selectSuggestion={selectSuggestion} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ImprovedSuggestions;
