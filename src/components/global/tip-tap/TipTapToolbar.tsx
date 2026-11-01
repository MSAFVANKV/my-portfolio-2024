
import { type Editor } from '@tiptap/react';
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Baseline,
  Highlighter,
  Link as LinkIcon,
  RemoveFormatting,
  // Image as ImageIcon, // <-- Import Image Icon
} from 'lucide-react';
import { ColorPickerDropdown } from './widgets/ColorPickerDropdown';
import { ImageUploadDropdown } from './widgets/ImageUploadModal'; // <-- Import Modal Component

interface TipTapToolbarProps {
  editor: Editor | null;
  showUndoRedo?: boolean;
}

export const TipTapToolbar = ({
  editor,
  showUndoRedo = true,
}: TipTapToolbarProps) => {
  // const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  if (!editor) {
    return null;
  }

  const getItemClass = (isActive: boolean) =>
    `p-1.5 rounded transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100 ${
      isActive ? 'bg-gray-200 text-gray-900 font-semibold' : ''
    }`;

  const currentFontSize =
    editor.getAttributes('textStyle').fontSize || 'normal';

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <>
      <div className='flex flex-wrap items-center gap-1 px-3 py-2 border-b border-gray-200 bg-white text-gray-700 rounded-t-lg'>
        {/* Undo / Redo */}
        {showUndoRedo && (
          <>
            <button
              type='button'
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className='p-1.5 rounded hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40'
              title='Undo'
            >
              <Undo className='w-4 h-4' />
            </button>
            <button
              type='button'
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className='p-1.5 rounded hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40'
              title='Redo'
            >
              <Redo className='w-4 h-4' />
            </button>
          </>
        )}

        <div className='h-4 w-[1px] bg-gray-200 mx-1' />

        {/* Font Size Selector Dropdown */}
        <select
          className='h-8 px-2 text-xs border border-gray-200 rounded bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 cursor-pointer'
          value={currentFontSize}
          onChange={(e) => {
            const fontSize = e.target.value;
            if (fontSize === 'normal') {
              editor.chain().focus().unsetFontSize().run();
            } else {
              editor.chain().focus().setFontSize(fontSize).run();
            }
          }}
        >
          <option value='normal'>Normal</option>
          <option value='12px'>Small</option>
          <option value='16px'>Medium</option>
          <option value='18px'>Large</option>
          <option value='24px'>Huge</option>
        </select>

        <div className='h-4 w-[1px] bg-gray-200 mx-1' />

        {/* Formatting Tools */}
        <button
          type='button'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={getItemClass(editor.isActive('heading', { level: 2 }))}
          title='Heading'
        >
          <Heading2 className='w-4 h-4' />
        </button>

        <button
          type='button'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={getItemClass(editor.isActive('bold'))}
          title='Bold'
        >
          <Bold className='w-4 h-4' />
        </button>

        <button
          type='button'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={getItemClass(editor.isActive('italic'))}
          title='Italic'
        >
          <Italic className='w-4 h-4' />
        </button>

        <button
          type='button'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={getItemClass(editor.isActive('strike'))}
          title='Strikethrough'
        >
          <Strikethrough className='w-4 h-4' />
        </button>

        {/* <button
        type='button'
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={getItemClass(editor.isActive('codeBlock'))}
        title='Code Block'
      >
        <Code className='w-4 h-4' />
      </button> */}

        <div className='h-4 w-[1px] bg-gray-200 mx-1' />

        {/* Text Color Picker Component */}
        <ColorPickerDropdown
          icon={<Baseline className='w-4 h-4' />}
          title='Text Color'
          isActive={!!editor.getAttributes('textStyle').color}
          onSelectColor={(color) =>
            editor.chain().focus().setColor(color).run()
          }
        />

        {/* Highlight Color Picker Component */}
        <ColorPickerDropdown
          icon={<Highlighter className='w-4 h-4' />}
          title='Highlight Color'
          isActive={editor.isActive('highlight')}
          onSelectColor={(color) =>
            editor.chain().focus().toggleHighlight({ color }).run()
          }
        />

        {/* Add Link */}
        <button
          type='button'
          onMouseDown={(e) => e.preventDefault()}
          onClick={setLink}
          className={getItemClass(editor.isActive('link'))}
          title='Insert Link'
        >
          <LinkIcon className='w-4 h-4' />
        </button>

        {/* Image Upload Trigger Button */}
        <ImageUploadDropdown editor={editor} />

        {/* Clear Formatting */}
        <button
          type='button'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
          className='p-1.5 rounded transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          title='Clear Formatting'
        >
          <RemoveFormatting className='w-4 h-4' />
        </button>

        <div className='h-4 w-[1px] bg-gray-200 mx-1' />

        {/* Lists & Quotes */}
        <button
          type='button'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={getItemClass(editor.isActive('bulletList'))}
          title='Bullet List'
        >
          <List className='w-4 h-4' />
        </button>

        <button
          type='button'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={getItemClass(editor.isActive('orderedList'))}
          title='Ordered List'
        >
          <ListOrdered className='w-4 h-4' />
        </button>

        <button
          type='button'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={getItemClass(editor.isActive('blockquote'))}
          title='Quote'
        >
          <Quote className='w-4 h-4' />
        </button>
      </div>

      {/* Image Upload Modal Dialog */}
      {/* <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onOpen={() => setIsImageModalOpen(true)}
        onInsert={({ src, width, height, borderRadius }) => {
          editor
            .chain()
            .focus()
            .setImage({ src })
            .updateAttributes('image', {
              style: `width: ${width}; height: ${height}; border-radius: ${borderRadius};`,
            })
            .run();
        }}
      /> */}
    </>
  );
};
