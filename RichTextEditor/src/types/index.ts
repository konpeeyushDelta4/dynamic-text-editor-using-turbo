import Quill from "quill";
interface SuggestionProps {
    id: string | number;
    label: string;
    description: string;
    category?: string;
    type?: string;
    link?: string; // Include link property
}

interface SuggestionsProps {
    filteredSuggestions: SuggestionProps[];
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
    selectSuggestion: (suggestion: SuggestionProps) => void;
}

interface TemplateSuggestion {
    id: string | number;
    label: string;
    description: string;
    category?: string;
    type?: string;
    link?: string;
    value?: string;
}

interface UseRegexProps {
    quillInstance: Quill | null;
}

interface Position {
    top: number;
    left: number;
}

interface ImprovedSuggestionsProps {
    isVisible: boolean;
    position: { top: number; left: number };
    filteredSuggestions: SuggestionProps[];
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
    selectSuggestion: (suggestion: SuggestionProps) => void;
    editorRef?: React.RefObject<HTMLDivElement | null>;

}



export type {
    SuggestionProps,
    SuggestionsProps,
    TemplateSuggestion,
    UseRegexProps,
    Position,
    ImprovedSuggestionsProps
}