import React, { forwardRef, type ForwardRefRenderFunction } from "react";
import { useDynamicTextEditor } from "../hooks/useDynamicTextEditor";
import type { DynamicTextEditorProps, DynamicTextEditorRef, BaseEditorItem } from "../types";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "../../styles/editor.css";

const DefaultSuggestionItem = ({ item, isSelected }: { item: BaseEditorItem; isSelected: boolean }) => (
    <div
        style={{
            padding: "8px 12px",
            backgroundColor: isSelected ? "#f0f9ff" : "transparent",
            cursor: "pointer"
        }}
    >
        <div style={{ fontWeight: "bold" }}>{item.label}</div>
        {item.description && (
            <div style={{ fontSize: "0.9em", color: "#666" }}>{item.description}</div>
        )}
        {item.category && (
            <div style={{ fontSize: "0.8em", color: "#888" }}>{item.category}</div>
        )}
    </div>
);

const DynamicTextEditorBase: ForwardRefRenderFunction<DynamicTextEditorRef, DynamicTextEditorProps> = (
    {
        className = "",
        classNames,
        suggestions,
        renderItem,
        renderCategory,
        renderDescription,
        value,
        onChange,
        ...props
    },
    ref
) => {
    const {
        quillRef,
        quillInstance,
        editorState,
        setEditorState,
        clearContent,
        focus,
        blur,
        suggestionState,
        insertSuggestion
    } = useDynamicTextEditor({
        value,
        onChange,
        suggestions,
        ...props
    });

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
        quillInstance,
        editorState,
        setEditorState,
        clearContent,
        focus,
        blur,
        containerRef: quillRef.current
    }));

    const handleSuggestionClick = (item: BaseEditorItem) => {
        insertSuggestion(item);
    };

    return (
        <div className={`dynamic-text-editor ${className} ${classNames?.root || ''}`}>
            <div ref={quillRef} className={`dynamic-text-editor-container ${classNames?.editor || ''}`} />
            {suggestionState.isOpen && (
                <div
                    className={`suggestions-dropdown ${classNames?.suggestions || ''}`}
                    style={{
                        position: 'absolute',
                        top: suggestionState.triggerPosition.top,
                        left: suggestionState.triggerPosition.left,
                        zIndex: 1000,
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        maxHeight: props.maxSuggestionHeight || 300,
                        overflowY: 'auto',
                        minWidth: props.minSuggestionWidth || 200,
                        maxWidth: props.maxSuggestionWidth || 400
                    }}
                >
                    {suggestionState.items.map((item, index) => (
                        <div
                            key={item.id}
                            onClick={() => handleSuggestionClick(item)}
                            className={`suggestion-item ${classNames?.suggestion || ''} ${index === suggestionState.selectedIndex ? classNames?.suggestionSelected || '' : ''
                                }`}
                        >
                            {renderItem ? (
                                renderItem(item, index === suggestionState.selectedIndex)
                            ) : (
                                <DefaultSuggestionItem item={item} isSelected={index === suggestionState.selectedIndex} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const DynamicTextEditor = forwardRef<DynamicTextEditorRef, DynamicTextEditorProps>(DynamicTextEditorBase);
DynamicTextEditor.displayName = "DynamicTextEditor";

export default DynamicTextEditor; 