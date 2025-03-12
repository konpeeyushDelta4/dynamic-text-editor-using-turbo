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
    const selectedItemRef = useRef<HTMLDivElement>(null);

    // Handle viewport positioning
    useEffect(() => {
        if (!isOpen || !dropdownRef.current) return;

        try {
            // Adjust position to ensure dropdown is visible
            const dropdown = dropdownRef.current;
            const rect = dropdown.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            // Check if dropdown would go below viewport
            if (position.top + rect.height > viewportHeight) {
                dropdown.style.top = `${position.top - rect.height}px`;
            } else {
                dropdown.style.top = `${position.top + window.scrollY}px`;
            }

            // Check if dropdown would go beyond right edge
            if (position.left + rect.width > viewportWidth) {
                dropdown.style.left = `${viewportWidth - rect.width - 10}px`;
            } else {
                dropdown.style.left = `${position.left}px`;
            }
        } catch (error) {
            console.error("Error positioning dropdown:", error);
        }
    }, [isOpen, position]);

    // Handle selected item scrolling
    useEffect(() => {
        if (!isOpen || !selectedItemRef.current) return;

        try {
            selectedItemRef.current.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        } catch (error) {
            console.error("Error scrolling to selection:", error);
        }
    }, [isOpen, selectedIndex]);

    // Safe way to handle item selection
    const handleItemSelect = useCallback((item: BaseEditorItem) => {
        try {
            // Create a promise to handle the selection
            setTimeout(() => {
                onSelect(item);
            }, 10);
        } catch (error) {
            console.error("Error selecting item:", error);
        }
    }, [onSelect]);

    // Safer mousedown handler
    const handleItemMouseDown = useCallback((e: React.MouseEvent, item: BaseEditorItem) => {
        try {
            // Prevent default behavior and stop event propagation
            e.preventDefault();
            e.stopPropagation();

            // Defer selection to prevent focus issues
            handleItemSelect(item);
        } catch (error) {
            console.error("Error in mouseDown handler:", error);
        }
    }, [handleItemSelect]);

    // Prevent container events from propagating
    const handleContainerMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    if (!isOpen || !items || items.length === 0) {
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
            onMouseDown={handleContainerMouseDown}
            data-testid="suggestions-dropdown"
        >
            {items.map((item, index) => (
                <div
                    key={item.id || `suggestion-${index}`}
                    ref={index === selectedIndex ? selectedItemRef : null}
                    onMouseDown={(e) => handleItemMouseDown(e, item)}
                    className={`suggestion-item ${classNames?.suggestion || ''} ${index === selectedIndex ? classNames?.suggestionSelected || '' : ''
                        }`}
                    style={{
                        transition: 'background-color 0.2s ease',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        backgroundColor: index === selectedIndex ? '#f0f9ff' : 'transparent',
                        borderBottom: '1px solid #eee',
                        userSelect: 'none'
                    }}
                    data-index={index}
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