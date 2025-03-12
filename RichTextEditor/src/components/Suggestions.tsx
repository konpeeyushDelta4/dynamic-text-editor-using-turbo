import React, { useEffect, useRef, useCallback } from "react";
import { SuggestionProps } from "../types";

interface SuggestionsProps {
  filteredSuggestions: SuggestionProps[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  selectSuggestion: (suggestion: SuggestionProps) => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({ filteredSuggestions, selectedIndex, setSelectedIndex, selectSuggestion }) => {
  // Reference to track the currently selected item
  const selectedItemRef = useRef<HTMLLIElement | null>(null);

  // Prevent default on mouse down to avoid focus issues
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  // Scroll selected item into view when selectedIndex changes
  useEffect(() => {
    if (selectedIndex >= 0 && selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  if (filteredSuggestions.length === 0) {
    return <div className="suggestions-empty p-4 text-center text-gray-500">No matching templates found</div>;
  }

  // Group suggestions by category
  const groupedSuggestions: Record<string, SuggestionProps[]> = {};
  filteredSuggestions.forEach((suggestion) => {
    const category = suggestion.category || "Other";
    if (!groupedSuggestions[category]) {
      groupedSuggestions[category] = [];
    }
    groupedSuggestions[category].push(suggestion);
  });

  let currentIndex = 0;

  return (
    <div className="suggestions-container w-full" onMouseDown={handleMouseDown}>
      {Object.entries(groupedSuggestions).map(([category, items]) => (
        <div key={category} className="suggestion-category">
          <div className="px-3 py-1.5 bg-gray-50 text-xs font-medium text-gray-700 uppercase tracking-wider">{category}</div>
          <ul className="divide-y divide-gray-100">
            {items.map((suggestion) => {
              const itemIndex = currentIndex;
              const isSelected = itemIndex === selectedIndex;
              currentIndex++; // Increment after checking

              return (
                <li
                  key={suggestion.id}
                  id={`suggestion-item-${itemIndex}`}
                  ref={isSelected ? selectedItemRef : null}
                  className={`suggestion-item px-4 py-3 cursor-pointer transition-colors ${isSelected ? "bg-indigo-50 border-l-2 border-indigo-500" : "hover:bg-gray-50"}`}
                  onClick={(e) => {
                    e.preventDefault();
                    selectSuggestion(suggestion);
                  }}
                  onMouseEnter={() => {
                    // Only update if different to avoid unnecessary re-renders
                    if (selectedIndex !== itemIndex) {
                      setSelectedIndex(itemIndex);
                    }
                  }}
                  aria-selected={isSelected}
                  data-index={itemIndex}
                  tabIndex={isSelected ? 0 : -1} // Make only the selected item focusable
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-800">
                      {isSelected && <span className="text-indigo-500 mr-1">›</span>}
                      {suggestion.label}
                    </div>
                    <div className="flex items-center space-x-2">
                      {suggestion.type && <div className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{suggestion.type}</div>}
                      {suggestion.link && (
                        <a
                          href={suggestion.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="text-blue-500 hover:text-blue-700"
                          title="View documentation"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{suggestion.description}</div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Suggestions;
