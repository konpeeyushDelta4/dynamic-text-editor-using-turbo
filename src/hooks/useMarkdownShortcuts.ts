import { useEffect, useCallback } from 'react';
import Quill from 'quill';

/**
 * Hook to implement Markdown-style formatting shortcuts
 * - *text* to make text bold
 * - _text_ to make text italic (optional)
 * - Auto-pairs the syntax and applies formatting
 */
const useMarkdownShortcuts = (quill: Quill | null) => {
    // Process Markdown syntax and apply formatting without removing asterisks
    const processMarkdown = useCallback(() => {
        if (!quill) return;

        const text = quill.getText();
        // Match text between asterisks
        const boldPattern = /\*([^*]+)\*/g;
        let match;

        // Find all bold patterns
        while ((match = boldPattern.exec(text)) !== null) {
            const startIndex = match.index;
            const contentLength = match[1].length; // length of text between asterisks

            try {
                // Apply bold formatting to everything between the asterisks (including the asterisks)
                // The +1 and -2 ensure we only format the content between the asterisks
                quill.formatText(startIndex + 1, contentLength, { bold: true });
            } catch (error) {
                console.error("Error applying markdown formatting:", error);
            }
        }
    }, [quill]);

    // Handle asterisk auto-pairing
    const handleAsteriskInput = useCallback((event: KeyboardEvent) => {
        if (!quill || event.key !== '*') return;

        // Get current selection
        const selection = quill.getSelection();
        if (!selection) return;

        // Prevent default to handle it ourselves
        event.preventDefault();

        const cursorPosition = selection.index;

        // Check if there's selected text to wrap
        if (selection.length > 0) {
            // Get selected text
            const selectedText = quill.getText(selection.index, selection.length);

            // Delete selection first
            quill.deleteText(selection.index, selection.length);

            // Insert asterisks with the selected text in the middle
            quill.insertText(selection.index, '*');
            quill.insertText(selection.index + 1, selectedText);
            quill.insertText(selection.index + 1 + selectedText.length, '*');

            // Format the text as bold (including the asterisks)
            quill.formatText(selection.index + 1, selectedText.length, { bold: true });

            // Place cursor after the inserted content
            quill.setSelection(selection.index + selectedText.length + 2, 0);
        } else {
            // No text selected, just insert paired asterisks and place cursor in the middle
            quill.insertText(cursorPosition, '**');
            quill.setSelection(cursorPosition + 1, 0);
        }
    }, [quill]);

    // Set up event listeners
    useEffect(() => {
        if (!quill) return;

        // Process existing markdown when initialized
        processMarkdown();

        // Listen for asterisk input
        const editorElement = quill.root;
        editorElement.addEventListener('keydown', handleAsteriskInput);

        // Process markdown on text changes
        const handleTextChange = () => {
            // Use a small delay to ensure text is fully updated
            setTimeout(processMarkdown, 10);
        };

        quill.on('text-change', handleTextChange);

        return () => {
            editorElement.removeEventListener('keydown', handleAsteriskInput);
            quill.off('text-change', handleTextChange);
        };
    }, [quill, handleAsteriskInput, processMarkdown]);

    // Add CSS to style asterisks
    useEffect(() => {
        // Add CSS to make asterisks more subtle but still visible
        const style = document.createElement('style');
        style.textContent = `
            .ql-editor .markdown-asterisk {
                opacity: 0.5;
                color: #666;
                user-select: none;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Register a custom blot for markdown syntax characters
    useEffect(() => {
        if (!quill) return;

        // Register a custom format if not already registered
        if (!Quill.imports['formats/markdown-syntax']) {
            const Inline = Quill.import('blots/inline') as typeof import('quill/blots/inline').default;

            class MarkdownSyntaxBlot extends Inline {
                static blotName = 'markdown-syntax';
                static tagName = 'span';
                static className = 'markdown-syntax';
            }

            Quill.register('formats/markdown-syntax', MarkdownSyntaxBlot);
        }

        // Use this to style the asterisks in processMarkdown:
        // quill.formatText(startIndex, 1, { 'markdown-syntax': true });
        // quill.formatText(startIndex + contentLength + 1, 1, { 'markdown-syntax': true });
    }, [quill]);

    return {
        processMarkdown
    };
};

export default useMarkdownShortcuts;