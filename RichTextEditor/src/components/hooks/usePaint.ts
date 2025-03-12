import { useEffect, useCallback, useRef } from 'react';
import Quill from 'quill';

// Define a custom Blot for styling text in double curly braces
type InlineBlotConstructor = {
    new(): {
        domNode: HTMLElement;
    };
    create(): HTMLElement;
    formats(node: HTMLElement): boolean | undefined;
};

const Inline = Quill.import('blots/inline') as InlineBlotConstructor;

class TemplateVariableBlot extends Inline {
    static blotName = 'template-variable';
    static tagName = 'span';

    static create() {
        const node = super.create();
        node.classList.add('template-variable');
        return node;
    }

    static formats(node: HTMLElement) {
        return node.classList.contains('template-variable') ? true : undefined;
    }
}

// Register the custom blot
Quill.register('formats/template-variable', TemplateVariableBlot);

interface UsePaintProps {
    quillInstance: Quill | null;
}

/**
 * A hook that highlights all text within {{template}} delimiters using a custom Quill blot
 */
const usePaint = ({ quillInstance }: UsePaintProps) => {
    // Regex pattern to find {{anything}} in text

    /**
     * Apply highlighting to all template patterns in the text using the custom blot
    */
    const highlightTemplates = useCallback(() => {
        const templatePattern = /{{(.*?)}}/g;
        if (!quillInstance) return;

        // Get the current text content
        const text = quillInstance.getText();

        // Clear existing template formats first to avoid duplications
        quillInstance.formatText(0, text.length, 'template-variable', false);

        // Find all template patterns in text and apply highlighting
        let match;
        templatePattern.lastIndex = 0; // Reset regex state

        while ((match = templatePattern.exec(text)) !== null) {
            const startIndex = match.index;
            const length = match[0].length;

            // Apply the custom template-variable format
            quillInstance.formatText(startIndex, length, 'template-variable', true);
        }
    }, [quillInstance]);

    // Use a debounced version of the highlight function to avoid performance issues
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const debouncedHighlight = useCallback(() => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
        }

        timeoutIdRef.current = setTimeout(() => {
            highlightTemplates();
            timeoutIdRef.current = null;
        }, 10); // Small delay to batch rapid changes
    }, [highlightTemplates]);

    // Monitor text changes to detect and highlight templates
    useEffect(() => {
        if (!quillInstance) return;

        // Apply initial highlighting
        highlightTemplates();

        // Add event listener for text changes
        quillInstance.on('text-change', debouncedHighlight);

        return () => {
            quillInstance.off('text-change', debouncedHighlight);
        };
    }, [quillInstance, highlightTemplates, debouncedHighlight]);

    return {
        highlightTemplates
    };
};

export default usePaint;
