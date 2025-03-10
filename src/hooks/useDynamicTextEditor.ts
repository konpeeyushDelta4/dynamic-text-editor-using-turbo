import { useEffect, useRef, useState, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { DynamicTextEditorProps, BaseEditorItem } from '../types';

type ToolbarConfig = Array<
    | string[]
    | { [key: string]: any }[]
>;

type useDynamicTextEditorProps = {
    theme?: 'snow' | 'bubble';
    placeholder?: string;
    classNames?:Object;
    value?: string;
    defaultValue?: string;
    readOnly?: boolean;
    fontSize?: string;
    lineHeight?: string;
    width?: string;
    height?: string;
    toolbar?: boolean | ToolbarConfig;
    formats?: string[];
    onChange?: (content: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    suggestions: BaseEditorItem[];
    suggestionTrigger?: string;
    suggestionClosing?: string;
    minSuggestionWidth?: number;
    maxSuggestionWidth?: number;
    maxSuggestionHeight?: number;
};

type useDynamicTextEditorReturn = {
    quillRef: React.RefObject<HTMLDivElement>;
    quillInstance: Quill | null;
    editorState: string;
    setEditorState: (content: string) => void;
    clearContent: () => void;
    focus: () => void;
    blur: () => void;
    suggestionState: SuggestionState;
    insertSuggestion: (item: BaseEditorItem) => void;
};

interface SuggestionState {
    isOpen: boolean;
    items: BaseEditorItem[];
    selectedIndex: number;
    triggerPosition: { top: number; left: number };
}

const defaultToolbarOptions = [
    ['bold', 'italic', 'underline'],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['clean']
];

export const useDynamicTextEditor = ({
    theme = 'snow',
    placeholder = 'Write something...',
    value,
    defaultValue = '',
    readOnly = false,
    fontSize = '1rem',
    lineHeight = '1.5',
    width = '100%',
    height = 'auto',
    toolbar = true,
    formats = [],
    onChange,
    onFocus,
    onBlur,
    suggestions,
    suggestionTrigger = '{{',
    suggestionClosing = '}}',
    minSuggestionWidth = 200,
    maxSuggestionWidth = 400,
    maxSuggestionHeight = 300
}: DynamicTextEditorProps): useDynamicTextEditorReturn => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [quillInstance, setQuillInstance] = useState<Quill | null>(null);
    const [editorState, setEditorState] = useState<string>(defaultValue);
    const [suggestionState, setSuggestionState] = useState<SuggestionState>({
        isOpen: false,
        items: [],
        selectedIndex: 0,
        triggerPosition: { top: 0, left: 0 }
    });

    const handleTextChange = useCallback((delta: any, oldContents: any, source: string) => {
        if (!quillInstance || source !== 'user') return;

        const text = quillInstance.getText();
        const cursorPosition = quillInstance.getSelection()?.index;

        if (cursorPosition === undefined) return;

        // Check for trigger character
        const lastTwoChars = text.slice(Math.max(0, cursorPosition - 2), cursorPosition);

        if (lastTwoChars === suggestionTrigger) {
            const bounds = quillInstance.getBounds(cursorPosition);
            if (!bounds) return;

            setSuggestionState({
                isOpen: true,
                items: suggestions,
                selectedIndex: 0,
                triggerPosition: {
                    top: bounds.top + bounds.height,
                    left: bounds.left
                }
            });
        } else if (!text.includes(suggestionTrigger)) {
            setSuggestionState(prev => ({ ...prev, isOpen: false }));
        }

        onChange(quillInstance.root.innerHTML);
    }, [quillInstance, onChange, suggestions, suggestionTrigger]);

    const insertSuggestion = useCallback((item: BaseEditorItem) => {
        if (!quillInstance) return;

        const selection = quillInstance.getSelection();
        if (!selection) return;

        // Delete the trigger characters
        quillInstance.deleteText(selection.index - suggestionTrigger.length, suggestionTrigger.length);
        // Insert the suggestion value
        quillInstance.insertText(selection.index - suggestionTrigger.length, item.value);
        setSuggestionState(prev => ({ ...prev, isOpen: false }));
    }, [quillInstance, suggestionTrigger]);

    // Initialize Quill
    useEffect(() => {
        if (!containerRef.current || quillInstance) return;

        containerRef.current.innerHTML = '<div class="editor-content"></div>';
        const editorElement = containerRef.current.querySelector('.editor-content');

        const quill = new Quill(editorElement as HTMLElement, {
            theme,
            placeholder,
            readOnly,
            modules: {
                ...(toolbar !== false && {
                    toolbar: toolbar === true ? defaultToolbarOptions : toolbar
                }),
                history: {
                    userOnly: true
                }
            },
            formats: formats.length > 0 ? formats : undefined
        });

        // Apply styles
        quill.root.style.fontSize = fontSize;
        quill.root.style.lineHeight = lineHeight;
        quill.root.style.width = width;
        quill.root.style.height = height;

        // Set initial content
        if (value) {
            quill.clipboard.dangerouslyPasteHTML(value);
        } else if (defaultValue) {
            quill.clipboard.dangerouslyPasteHTML(defaultValue);
        }

        setQuillInstance(quill);

        // Event listeners
        quill.on('text-change', handleTextChange);
        quill.root.addEventListener('focus', onFocus || (() => { }));
        quill.root.addEventListener('blur', onBlur || (() => { }));

        return () => {
            quill.off('text-change', handleTextChange);
            quill.root.removeEventListener('focus', onFocus || (() => { }));
            quill.root.removeEventListener('blur', onBlur || (() => { }));
            quill.disable();
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
            setQuillInstance(null);
        };
    }, []);

    // Handle prop changes after initial mount
    useEffect(() => {
        if (!quillInstance) return;

        // Update styles
        quillInstance.root.style.fontSize = fontSize;
        quillInstance.root.style.lineHeight = lineHeight;
        quillInstance.root.style.width = width;
        quillInstance.root.style.height = height;

        // Update readOnly state
        quillInstance.enable(!readOnly);

        // Reinitialize Quill if toolbar changes
        if (toolbar !== undefined && containerRef.current) {
            const content = quillInstance.root.innerHTML;
            quillInstance.disable();
            containerRef.current.innerHTML = '<div class="editor-content"></div>';
            const editorElement = containerRef.current.querySelector('.editor-content');

            const newQuill = new Quill(editorElement as HTMLElement, {
                theme,
                placeholder,
                readOnly,
                modules: {
                    ...(toolbar !== false && {
                        toolbar: toolbar === true ? defaultToolbarOptions : toolbar
                    }),
                    history: {
                        userOnly: true
                    }
                },
                formats: formats.length > 0 ? formats : undefined
            });

            newQuill.clipboard.dangerouslyPasteHTML(content);
            setQuillInstance(newQuill);
        }
    }, [theme, fontSize, lineHeight, width, height, readOnly, toolbar]);

    // Handle value changes separately
    useEffect(() => {
        if (!quillInstance || value === undefined) return;
        if (value !== quillInstance.root.innerHTML) {
            quillInstance.clipboard.dangerouslyPasteHTML(value);
        }
    }, [value]);

    // Utility functions
    const clearContent = useCallback(() => {
        quillInstance?.setText('');
    }, [quillInstance]);

    const focus = useCallback(() => {
        quillInstance?.focus();
    }, [quillInstance]);

    const blur = useCallback(() => {
        if (quillInstance) {
            (quillInstance.root as HTMLElement).blur();
        }
    }, [quillInstance]);

    return {
        quillRef: containerRef,
        quillInstance,
        editorState,
        setEditorState: (content: string) => {
            if (quillInstance) {
                quillInstance.clipboard.dangerouslyPasteHTML(content);
            }
        },
        clearContent,
        focus,
        blur,
        suggestionState,
        insertSuggestion
    };
};

export type { useDynamicTextEditorProps, useDynamicTextEditorReturn };
export default useDynamicTextEditor;