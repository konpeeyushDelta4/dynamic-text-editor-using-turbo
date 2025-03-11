import React, { useState, useRef } from 'react';
import { DynamicTextEditor } from 'dynamic-text-editor';
import type { DynamicTextEditorRef, BaseEditorItem } from 'dynamic-text-editor';
import './App.css';
import './editor-styles.css';

import { defaultSuggestions } from '../utils/constants';

const renderCustomItem = (item: BaseEditorItem, isSelected: boolean) => {
  // Add icons for different types of suggestions
  const getIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'equality and comparison':
        return '🔍';
      case 'logical operations':
        return '🔄';
      case 'string manipulation':
        return '✏️';
      case 'conditional checks':
        return '⚡';
      case 'date and time':
        return '📅';
      case 'json utilities':
        return '📦';
      case 'flow':
        return '🔄';
      case 'session':
        return '📍';
      case 'visitor':
        return '👤';
      case 'contact':
        return '📇';
      default:
        return '✨';
    }
  };

  return (
    <div
      style={{
        padding: "12px 16px",
        backgroundColor: isSelected ? "#f0f9ff" : "transparent",
        cursor: "pointer",
        borderLeft: isSelected ? "3px solid #0066cc" : "3px solid transparent",
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        transition: "all 0.2s ease"
      }}
    >
      <div style={{
        fontSize: "20px",
        lineHeight: "1",
        marginTop: "2px"
      }}>
        {getIcon(item.category)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px"
        }}>
          <div style={{
            fontWeight: "600",
            color: "#1a1a1a",
          }}>
            {item.label}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              // Open in new tab
              window.open(item.link, '_blank');
            }}
            onMouseDown={(e) => {
              // This is crucial - prevents the parent from getting focus/selection
              e.preventDefault();
              e.stopPropagation();
            }}
            style={{
              background: "transparent",
              border: "1px solid #0066cc",
              color: "#0066cc",
              borderRadius: "4px",
              padding: "2px 6px",
              fontSize: "0.7rem",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#e6f0ff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Docs
          </button>
        </div>
        {item.description && (
          <div style={{
            fontSize: "0.9em",
            color: "#666",
            marginBottom: "4px",
            lineHeight: "1.4"
          }}>
            {item.description}
          </div>
        )}
        {item.category && (
          <div style={{
            fontSize: "0.8em",
            color: "#888",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{
              backgroundColor: isSelected ? "#e6f0ff" : "#f5f5f5",
              padding: "2px 8px",
              borderRadius: "12px",
              transition: "background-color 0.2s ease"
            }}>
              {item.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const InstructionsSection = () => (
  <div className="instructions-section">
    <div className="instruction-box">
      <h3>📝 How to Use Templates</h3>
      <p>Type <span>{`{{`}</span> to open the template suggestions. Browse through available functions and variables.</p>
      <div className="keyboard-shortcuts">
        <span><code>↑</code> <code>↓</code> Navigate</span>
        <span><code>Enter</code> Select</span>
        <span><code>Esc</code> Close</span>
      </div>
    </div>
  </div>
);

const App = () => {
  const [content, setContent] = useState<string>('');
  const editorRef = useRef<DynamicTextEditorRef>(null);

  return (
    <div className="app-container">
      <h1>Dynamic Text Editor</h1>
      <div className="editor-section">
        <DynamicTextEditor
          ref={editorRef}
          theme="snow"
          value={content}
          onChange={setContent}
          placeholder="Start typing..."
          fontSize="1.8rem"
          lineHeight="1.6"
          width="100%"
          height="400px"
          toolbar={[
            ['bold', 'italic', 'underline']
          ]}
          suggestions={defaultSuggestions}
          renderItem={renderCustomItem}
          classNames={{
            root: "custom-editor",
            editor: "custom-editor__input",
            variable: "custom-editor__variable",
            suggestions: "custom-editor__suggestions",
            suggestion: "custom-editor__suggestion",
            suggestionSelected: "custom-editor__suggestion--selected",
            category: "custom-editor__category",
            description: "custom-editor__description",
          }}
        />
        
        <div className="editor-controls">
          <button
            onClick={() => editorRef.current?.clearContent()}
            className="editor-button"
          >
            Clear
          </button>
          <button
            onClick={() => editorRef.current?.focus()}
            className="editor-button"
          >
            Focus
          </button>
        </div>
          <InstructionsSection />
      </div>
    </div>
  );
};

export default App;