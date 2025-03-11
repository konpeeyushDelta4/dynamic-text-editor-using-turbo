import React, { useState, useRef } from 'react';
import { DynamicTextEditor } from 'dynamic-text-editor';
import type { DynamicTextEditorRef, BaseEditorItem } from 'dynamic-text-editor';
import './App.css';
import './editor-styles.css';

import { defaultSuggestions } from '../utils/constants';

const renderCustomItem = (item: BaseEditorItem, isSelected: boolean) => (
  <div
    style={{
      padding: "8px",
      backgroundColor: isSelected ? "#f0f9ff" : "transparent",
      cursor: "pointer"
    }}
  >
    <div style={{ fontWeight: "bold" }}>{item.label}</div>
    <div style={{ fontSize: "0.9em", color: "#666" }}>{item.description}</div>
    <div style={{ fontSize: "0.8em", color: "#888" }}>{item.category}</div>
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
          width="800px"
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
      </div>
    </div>
  );
};

export default App;