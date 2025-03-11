import React, { useEffect, useRef, useCallback } from 'react';
import { BaseEditorItem } from '../types';

interface SuggestionsProps {
    isOpen: boolean;
    items: BaseEditorItem[];
    position: { top: number; left: number };
    selectedIndex: number;
    onSelect: (item: BaseEditorItem) => void;
    renderItem?: (item: BaseEditorItem, isSelected: boolean) => React.ReactNode;
    classNames?: {
        suggestions?: string;
        suggestion?: string;
        suggestionSelected?: string;
    };
    maxHeight?: number;
    minWidth?: number;
    maxWidth?: number;
}

const DefaultSuggestionItem = ({ item, isSelected }: { item: BaseEditorItem; isSelected: boolean }) => (
    <div
        style={{
            padding: "8px 12px",
            backgroundColor: isSelected ? "#f0f9ff" : "transparent",
            cursor: "pointer",
            borderBottom: "1px solid #eee"
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

export const Suggestions: React.FC<SuggestionsProps> = ({
    isOpen,
    items,
    position,
    selectedIndex,
    onSelect,
    renderItem,
    classNames,
    maxHeight = 300,
    minWidth = 200,
    maxWidth = 400
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen || !dropdownRef.current) return;

        // Adjust position to ensure dropdown is visible
        const dropdown = dropdownRef.current;
        const rect = dropdown.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Check if dropdown would go below viewport
        if (position.top + rect.height > viewportHeight) {
            dropdown.style.top = `${position.top - rect.height}px`;
        }

        // Check if dropdown would go beyond right edge
        if (position.left + rect.width > viewportWidth) {
            dropdown.style.left = `${viewportWidth - rect.width - 10}px`;
        }
    }, [isOpen, position]);

    const handleItemClick = useCallback((item: BaseEditorItem, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        onSelect(item);
    }, [onSelect]);

    if (!isOpen || items.length === 0) {
        return null;
    }

    return (
        <div
            ref={dropdownRef}
            className={`suggestions-dropdown ${classNames?.suggestions || ''}`}
            style={{
                position: 'fixed',
                top: position.top + window.scrollY,
                left: position.left,
                zIndex: 9999,
                backgroundColor: 'white',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                maxHeight,
                overflowY: 'auto',
                minWidth,
                maxWidth,
                border: '1px solid #e0e0e0',
            }}
            onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking the dropdown
        >
            {items.map((item, index) => (
                <div
                    key={item.id}
                    onMouseDown={(e) => handleItemClick(item, e)}
                    className={`suggestion-item ${classNames?.suggestion || ''} ${index === selectedIndex ? classNames?.suggestionSelected || '' : ''
                        }`}
                    style={{
                        transition: 'background-color 0.2s ease'
                    }}
                >
                    {renderItem ? (
                        renderItem(item, index === selectedIndex)
                    ) : (
                        <DefaultSuggestionItem item={item} isSelected={index === selectedIndex} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default Suggestions;