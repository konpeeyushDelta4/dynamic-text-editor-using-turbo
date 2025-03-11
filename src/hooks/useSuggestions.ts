import { useState, useCallback, useEffect } from 'react';
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
        return false;
    }, [quillInstance, suggestions, trigger, closingChar]);

    const insertSuggestion = useCallback((item: BaseEditorItem) => {
        if (!quillInstance) return;

        const selection = quillInstance.getSelection();
        if (!selection) return;

        const cursorPosition = selection.index;
        const text = quillInstance.getText();
        const textBeforeCursor = text.slice(0, cursorPosition);
        const lastTriggerPos = textBeforeCursor.lastIndexOf(trigger);

        if (lastTriggerPos >= 0) {
            // Delete from trigger to cursor
            quillInstance.deleteText(lastTriggerPos, cursorPosition - lastTriggerPos);

            // Insert the full template with value
            const template = `${trigger}${item.value}${closingChar}`;
            quillInstance.insertText(lastTriggerPos, template);

            // Move cursor after the inserted template
            quillInstance.setSelection(lastTriggerPos + template.length, 0);

            setState(prev => ({ ...prev, isOpen: false }));
        }
    }, [quillInstance, trigger, closingChar]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!state.isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setState(prev => ({
                    ...prev,
                    selectedIndex: prev.selectedIndex >= prev.filteredItems.length - 1
                        ? prev.filteredItems.length - 1
                        : prev.selectedIndex + 1
                }));
                break;

            case 'ArrowUp':
                e.preventDefault();
                setState(prev => ({
                    ...prev,
                    selectedIndex: prev.selectedIndex <= 0 ? 0 : prev.selectedIndex - 1
                }));
                break;

            case 'Enter':
                e.preventDefault();
                if (state.filteredItems[state.selectedIndex]) {
                    insertSuggestion(state.filteredItems[state.selectedIndex]);
                    setState(prev => ({ ...prev, isOpen: false }));
                }
                break;

            case 'Escape':
                e.preventDefault();
                setState(prev => ({ ...prev, isOpen: false }));
                break;

            case 'Tab':
                e.preventDefault();
                if (state.filteredItems[state.selectedIndex]) {
                    insertSuggestion(state.filteredItems[state.selectedIndex]);
                    setState(prev => ({ ...prev, isOpen: false }));
                }
                break;
        }
    }, [state.isOpen, state.filteredItems, state.selectedIndex, insertSuggestion]);

    // Setup and cleanup keyboard event handlers
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

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

        const text = quillInstance.getText();
        templateRegex.extractMatches(text);

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