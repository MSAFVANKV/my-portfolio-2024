import React, { useState, useRef, useEffect } from 'react';
import { type Editor } from '@tiptap/react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

interface ImageUploadDropdownProps {
  editor: Editor | null;
}

export const ImageUploadDropdown = ({ editor }: ImageUploadDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [width, setWidth] = useState<string>('100%');
  const [height, setHeight] = useState<string>('auto');
  const [borderRadius, setBorderRadius] = useState<string>('8px');

  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!editor) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertImage = () => {
    if (!previewUrl) return;

    editor
      .chain()
      .focus()
      .setImage({ src: previewUrl })
      .updateAttributes('image', {
        style: `width: ${width}; height: ${height}; border-radius: ${borderRadius};`,
      })
      .run();

    // Reset & close
    setSelectedFile(null);
    setPreviewUrl('');
    setWidth('100%');
    setHeight('auto');
    setBorderRadius('8px');
    setIsOpen(false);
  };

  return (
    <div className='relative inline-block' ref={containerRef}>
      {/* Single Toolbar Trigger Button */}
      <button
        type='button'
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center ${
          isOpen ? 'bg-gray-200 text-gray-900 font-semibold' : ''
        }`}
        title='Upload Image'
      >
        <ImageIcon className='w-4 h-4' />
      </button>

      {/* Local absolute popover aligned cleanly to the right side of the toolbar */}
      {isOpen && (
        <div className='absolute right-0 top-full mt-1 w-[260px] bg-white border border-gray-200 rounded-lg z-[99999] p-3 space-y-3 text-left'>
          <div className='flex items-center justify-between border-b border-gray-100 pb-2'>
            <span className='font-semibold text-gray-800 text-xs'>
              Insert Image
            </span>
            <button
              type='button'
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setIsOpen(false)}
              className='text-gray-400 hover:text-gray-600 p-1 rounded'
            >
              <X className='w-3.5 h-3.5' />
            </button>
          </div>

          {/* File Upload Box */}
          <div>
            {/* <label className='block text-[10px] font-medium text-gray-600 mb-1'>
              Select Image File
            </label> */}
            <label className='flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md p-2 cursor-pointer hover:border-gray-400 bg-gray-50/50'>
              {previewUrl ? (
                <div className='flex items-center gap-2 w-full'>
                  <img
                    src={previewUrl}
                    alt='Preview'
                    className='w-8 h-8 object-cover rounded'
                  />
                  <span className='text-[10px] text-gray-600 truncate flex-1'>
                    {selectedFile?.name}
                  </span>
                </div>
              ) : (
                <div className='flex items-center gap-1.5 py-1'>
                  <Upload className='w-4 h-4 text-gray-400' />
                  <span className='text-[10px] text-gray-600 font-medium'>
                    Click to browse
                  </span>
                </div>
              )}
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Width & Height */}
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <label className='block text-[10px] font-medium text-gray-600 mb-0.5'>
                Width
              </label>
              <input
                type='text'
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className='w-full px-2 py-1 text-[11px] border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400'
                placeholder='100%'
              />
            </div>
            <div>
              <label className='block text-[10px] font-medium text-gray-600 mb-0.5'>
                Height
              </label>
              <input
                type='text'
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className='w-full px-2 py-1 text-[11px] border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400'
                placeholder='auto'
              />
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className='block text-[10px] font-medium text-gray-600 mb-0.5'>
              Border Radius
            </label>
            <input
              type='text'
              value={borderRadius}
              onChange={(e) => setBorderRadius(e.target.value)}
              className='w-full px-2 py-1 text-[11px] border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400'
              placeholder='8px'
            />
          </div>

          {/* Actions (Safe type="button" to prevent parent form reloads) */}
          <div className='flex justify-end gap-1.5 pt-2 border-t border-gray-100'>
            <button
              type='button'
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setIsOpen(false)}
              className='px-3 py-1.5 text-[11px] font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors'
            >
              Cancel
            </button>
            <button
              type='button'
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleInsertImage}
              disabled={!previewUrl}
              className='px-3 py-1.5 text-[11px] font-medium text-white bg-gray-900 hover:bg-gray-800 rounded transition-colors disabled:opacity-40'
            >
              Insert
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
