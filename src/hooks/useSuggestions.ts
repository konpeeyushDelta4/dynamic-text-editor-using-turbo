import { useState, useCallback, useEffect, useRef } from 'react';
import Quill from 'quill';
import { BaseEditorItem } from '../types';
import useRegex from './useRegex';

interface SuggestionState {
    isOpen: boolean;
    items: BaseEditorItem[];
    filteredItems: BaseEditorItem[];
    query: string;
    selectedIndex: number;
    triggerPosition: { top: number; left: number };
}

interface UseSuggestionsOptions {
    quillInstance: Quill | null;
    suggestions: BaseEditorItem[];
    trigger: string;
    closingChar?: string;
}

export const useSuggestions = ({
    quillInstance,
    suggestions,
    trigger = '{{',
    closingChar = '}}'
}: UseSuggestionsOptions) => {
    const [state, setState] = useState<SuggestionState>({
        isOpen: false,
        items: suggestions,
        filteredItems: suggestions,
        query: '',
        selectedIndex: 0,
        triggerPosition: { top: 0, left: 0 }
    });

    // Create a ref for trigger position tracking
    const triggerPositionRef = useRef<number | null>(null);

    // Create regex for matching {{template}}
    const templateRegex = useRegex(
        new RegExp(`${trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^${closingChar}]*)${closingChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')
    );

    const checkForTrigger = useCallback(() => {
        if (!quillInstance) return;

        const selection = quillInstance.getSelection();
        if (!selection) return;

        const cursorPosition = selection.index;
        const text = quillInstance.getText();

        // Check if we just typed the trigger character
        const beforeCursor = text.slice(Math.max(0, cursorPosition - trigger.length), cursorPosition);

        if (beforeCursor === trigger) {
            const bounds = quillInstance.getBounds(cursorPosition);
            if (!bounds) return false;

            // Get the editor's position
            const editorRect = quillInstance.root.getBoundingClientRect();

            // Store trigger position for later use
            triggerPositionRef.current = cursorPosition - trigger.length;

            setState(prev => ({
                ...prev,
                isOpen: true,
                query: '',
                filteredItems: suggestions,
                selectedIndex: 0,
                triggerPosition: {
                    top: editorRect.top + bounds.top + bounds.height + 5, // Add 5px padding
                    left: editorRect.left + bounds.left
                }
            }));

            return true;
        }

        // Check if we're inside an existing template that's being typed
        const textBeforeCursor = text.slice(0, cursorPosition);
        const lastTriggerPos = textBeforeCursor.lastIndexOf(trigger);

        if (lastTriggerPos >= 0) {
            const hasClosing = text.indexOf(closingChar, lastTriggerPos) > -1;
            if (!hasClosing || text.indexOf(closingChar, lastTriggerPos) > cursorPosition) {
                const query = text.slice(lastTriggerPos + trigger.length, cursorPosition);
                const bounds = quillInstance.getBounds(lastTriggerPos);
                if (!bounds) return false;

                // Get the editor's position
                const editorRect = quillInstance.root.getBoundingClientRect();

                // Store trigger position for later use
                triggerPositionRef.current = lastTriggerPos;

                const filteredItems = suggestions.filter(
                    item =>
                        item.label.toLowerCase().includes(query.toLowerCase()) ||
                        item.value.toLowerCase().includes(query.toLowerCase())
                );

                setState(prev => ({
                    ...prev,
                    isOpen: true,
                    query,
                    filteredItems,
                    selectedIndex: 0,
                    triggerPosition: {
                        top: editorRect.top + bounds.top + bounds.height + 5, // Add 5px padding
                        left: editorRect.left + bounds.left
                    }
                }));

                return true;
            }
        }

        setState(prev => ({ ...prev, isOpen: false }));
        triggerPositionRef.current = null;
        return false;
    }, [quillInstance, suggestions, trigger, closingChar]);

    // A separate function to safely insert text at the trigger position
    const insertAtTrigger = useCallback((content: string, triggerPos: number) => {
        if (!quillInstance) return;

        try {
            // Focus the editor first to ensure it's ready to receive changes
            quillInstance.focus();

            // Small delay to ensure focus has taken effect
            setTimeout(() => {
                try {
                    // Get current selection to calculate what to delete
                    let selection = quillInstance.getSelection();
                    if (!selection) {
                        // If no selection, set one at the trigger position
                        quillInstance.setSelection(triggerPos, 0);

                        // Short delay to ensure selection is set
                        setTimeout(() => {
                            try {
                                // Try getting selection again
                                selection = quillInstance.getSelection();

                                // If still null, use a default
                                if (!selection) {
                                    // Create a safe default
                                    selection = { index: triggerPos, length: 0 };
                                }

                                // Calculate delete length (from trigger to cursor)
                                const deleteLength = selection.index - triggerPos + selection.length;
                                if (deleteLength > 0) {
                                    quillInstance.deleteText(triggerPos, deleteLength);
                                }

                                // Insert the new content
                                quillInstance.insertText(triggerPos, content);

                                // Move cursor after the inserted content
                                quillInstance.setSelection(triggerPos + content.length, 0);
                            } catch (error) {
                                console.error('Error in delayed insertion:', error);
                            }
                        }, 10);
                    } else {
                        // We have a selection, proceed normally
                        const deleteLength = selection.index - triggerPos + selection.length;
                        if (deleteLength > 0) {
                            quillInstance.deleteText(triggerPos, deleteLength);
                        }

                        // Insert the new content
                        quillInstance.insertText(triggerPos, content);

                        // Move cursor after the inserted content
                        quillInstance.setSelection(triggerPos + content.length, 0);
                    }
                } catch (error) {
                    console.error('Error inserting content:', error);
                }
            }, 10);
        } catch (error) {
            console.error('Error in insertAtTrigger:', error);
        }
    }, [quillInstance]);

    const insertSuggestion = useCallback((item: BaseEditorItem) => {
        if (!quillInstance || triggerPositionRef.current === null) return;

        // First make sure we close the dropdown
        setState(prev => ({ ...prev, isOpen: false }));

        // Wait a moment for the UI to update
        setTimeout(() => {
            try {
                // Focus editor first
                quillInstance.focus();

                // Create the full template text
                const templateText = `${trigger}${item.value}${closingChar}`;

                // Insert at the stored trigger position
                insertAtTrigger(templateText, triggerPositionRef.current as number);

                // Reset the trigger position
                triggerPositionRef.current = null;
            } catch (error) {
                console.error('Error inserting suggestion:', error);
            }
        }, 0);
    }, [quillInstance, trigger, closingChar, insertAtTrigger]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!state.isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation?.();
                setState(prev => ({
                    ...prev,
                    selectedIndex: Math.min(prev.selectedIndex + 1, prev.filteredItems.length - 1)
                }));
                break;

            case 'ArrowUp':
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation?.();
                setState(prev => ({
                    ...prev,
                    selectedIndex: Math.max(prev.selectedIndex - 1, 0)
                }));
                break;

            case 'Enter':
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation?.();
                if (state.filteredItems[state.selectedIndex]) {
                    insertSuggestion(state.filteredItems[state.selectedIndex]);
                }
                break;

            case 'Escape':
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation?.();
                setState(prev => ({ ...prev, isOpen: false }));
                break;

            case 'Tab':
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation?.();
                if (state.filteredItems[state.selectedIndex]) {
                    insertSuggestion(state.filteredItems[state.selectedIndex]);
                }
                break;
        }
    }, [state.isOpen, state.filteredItems, state.selectedIndex, insertSuggestion]);

    // Setup and cleanup keyboard event handlers
    useEffect(() => {
        if (!state.isOpen) return;

        // Create a reference to the current callback
        const currentHandleKeyDown = handleKeyDown;

        const handleKeyPress = (e: KeyboardEvent) => {
            currentHandleKeyDown(e);
        };

        // Add event listener with capture to ensure we get the event first
        document.addEventListener('keydown', handleKeyPress, true);

        return () => {
            document.removeEventListener('keydown', handleKeyPress, true);
        };
    }, [state.isOpen, handleKeyDown]);

    // Setup Quill text-change handler
    useEffect(() => {
        if (!quillInstance) return;

        const handleTextChange = () => {
            checkForTrigger();
        };

        quillInstance.on('text-change', handleTextChange);
        quillInstance.on('selection-change', handleTextChange);

        return () => {
            quillInstance.off('text-change', handleTextChange);
            quillInstance.off('selection-change', handleTextChange);
        };
    }, [quillInstance, checkForTrigger]);

    // Highlight all template matches
    const highlightTemplates = useCallback(() => {
        if (!quillInstance) return;

        try {
            const text = quillInstance.getText();
            templateRegex.extractMatches(text);
        } catch (error) {
            console.error('Error highlighting templates:', error);
        }
    }, [quillInstance, templateRegex]);

    // Apply highlighting on editor content changes
    useEffect(() => {
        if (!quillInstance) return;

        const handleHighlight = () => {
            highlightTemplates();
        };

        quillInstance.on('text-change', handleHighlight);

        return () => {
            quillInstance.off('text-change', handleHighlight);
        };
    }, [quillInstance, highlightTemplates]);

    // Handle editor blur
    const handleEditorBlur = useCallback((event: FocusEvent) => {
        // Check if the related target is part of the suggestions dropdown
        const relatedTarget = event.relatedTarget as HTMLElement;
        if (relatedTarget?.closest('.suggestions-dropdown')) {
            return;
        }

        setState(prev => ({ ...prev, isOpen: false }));
    }, []);

    // Setup editor blur handler
    useEffect(() => {
        if (!quillInstance) return;

        quillInstance.root.addEventListener('blur', handleEditorBlur);

        return () => {
            quillInstance.root.removeEventListener('blur', handleEditorBlur);
        };
    }, [quillInstance, handleEditorBlur]);

    return {
        suggestionState: {
            ...state,
            filteredItems: state.filteredItems
        },
        checkForTrigger,
        insertSuggestion,
        closeSuggestions: () => setState(prev => ({ ...prev, isOpen: false }))
    };
};

export default useSuggestions;
