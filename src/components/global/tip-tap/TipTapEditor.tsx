import  { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { FontSize } from './widgets/FontSize';
import { cn } from '@/lib/utils';
import { TipTapToolbar } from './TipTapToolbar';

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showUndoRedo?: boolean;
}

export const TipTapEditor = ({
  value,
  onChange,
  placeholder = 'Write something...',
  className,
  showUndoRedo = true,
}: TipTapEditorProps) => {
  const [, setForceUpdate] = useState({});

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({
        HTMLAttributes: {
          class: 'object-cover',
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onTransaction: () => {
      setForceUpdate({});
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none min-h-[180px] max-h-[350px] overflow-y-auto w-full p-4 text-gray-800 bg-gray-50 focus:outline-none focus:ring-0',
          className,
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && value === '') {
      editor.commands.clearContent();
    }
  }, [value, editor]);

  return (
    <div
      onKeyDown={(e) => {
        // Prevent Enter from bubbling up to parent forms and causing unintended submissions/reloads
        if (e.key === 'Enter') {
          e.stopPropagation();
        }
      }}
      className='w-full rounded-lg border border-gray-200 shadow-sm overflow-visible relative'
    >
      <TipTapToolbar editor={editor} showUndoRedo={showUndoRedo} />

      <div className='relative w-full bg-gray-50 rounded-b-lg overflow-hidden'>
        <EditorContent editor={editor} />

        {editor?.isEmpty && placeholder && (
          <p className='pointer-events-none absolute left-4 top-4 select-none text-sm text-gray-400'>
            {placeholder}
          </p>
        )}
      </div>
    </div>
  );
};
