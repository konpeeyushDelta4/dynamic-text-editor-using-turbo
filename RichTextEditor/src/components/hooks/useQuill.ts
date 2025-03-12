import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';

const useQuill = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [quillInstance, setQuillInstance] = useState<Quill | null>(null);
    const [editorState, setEditorState] = useState<string>('');

    useEffect(() => {
        if (!containerRef.current) return;

        // First, clear any potential content in the container
        containerRef.current.innerHTML = '';

        // Create Quill instance with explicit placeholder configuration
        const quill = new Quill(containerRef.current, {
            theme: 'bubble',
            placeholder: 'Write your prompt...',
            modules: {
                toolbar: false,
                history: {
                    // Prevent any automatic content restoration
                    userOnly: true
                }
            },
            formats: ['template-variable'] // Allow our custom format
        });

        // Set default font size for the entire editor
        quill.root.style.fontSize = '1.8rem';
        quill.root.style.lineHeight = '1.6';

        // Reset the editor content to be completely empty
        quill.setText('');

        // Remove any potential p tags with br that Quill might add
        const emptyParagraphs = quill.root.querySelectorAll('p:empty, p:only-child:has(br)');
        emptyParagraphs.forEach(el => {
            if (el.innerHTML === '<br>') {
                el.remove();
            }
        });

        // Save instance
        setQuillInstance(quill);

        // Listen for content changes
        const handleTextChange = () => {
            setEditorState(quill.root.innerHTML);
        };

        quill.on('text-change', handleTextChange);

        // Clean up
        return () => {
            quill.off('text-change', handleTextChange);
            quill.disable();
        };
    }, []);

    return {
        quillRef: containerRef,
        quillInstance,
        editorState,
        setEditorState
    };
};

export default useQuill;