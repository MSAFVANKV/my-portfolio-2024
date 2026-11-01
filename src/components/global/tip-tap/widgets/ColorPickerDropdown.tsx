import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

interface ColorPickerDropdownProps {
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  onSelectColor: (color: string) => void;
}

const COLOR_PALETTE = [
  ['#000000', '#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#8a2be2'],
  ['#ffffff', '#ffcccc', '#ffe5cc', '#ffffcc', '#ccffcc', '#cce5ff', '#e5ccff'],
  ['#cccccc', '#ff6666', '#ffb266', '#ffff66', '#66cc66', '#66b2ff', '#b266ff'],
  ['#808080', '#990000', '#b26b00', '#b2b200', '#006600', '#000099', '#4c0099'],
  ['#4d4d4d', '#660000', '#663300', '#666600', '#003300', '#000066', '#330066'],
];

export const ColorPickerDropdown = ({
  icon,
  title,
  isActive,
  onSelectColor,
}: ColorPickerDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [positionClass, setPositionClass] = useState('left-0 top-full mt-1');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Dynamically calculate space & align popover
  useLayoutEffect(() => {
    if (!isOpen || !dropdownRef.current || !popoverRef.current) return;

    const triggerRect = dropdownRef.current.getBoundingClientRect();
    const popoverWidth = popoverRef.current.offsetWidth || 210;
    const popoverHeight = popoverRef.current.offsetHeight || 160;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Check right space constraint
    const alignRight = triggerRect.left + popoverWidth > viewportWidth - 12;
    // Check bottom space constraint
    const alignTop = triggerRect.bottom + popoverHeight > viewportHeight - 12;

    const horizontalClass = alignRight ? 'right-0' : 'left-0';
    const verticalClass = alignTop ? 'bottom-full mb-1' : 'top-full mt-1';

    setPositionClass(`${horizontalClass} ${verticalClass}`);
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative inline-block' ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type='button'
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center ${
          isActive ? 'bg-gray-200 text-gray-900 font-semibold' : ''
        }`}
        title={title}
      >
        {icon}
      </button>

      {/* Dynamic Popover Grid */}
      {isOpen && (
        <div
          ref={popoverRef}
          className={`absolute p-2 bg-white border border-gray-300 shadow-lg z-50 grid gap-1 ${positionClass}`}
        >
          {COLOR_PALETTE.map((row, rowIndex) => (
            <div key={rowIndex} className='flex gap-1 justify-between'>
              {row.map((color) => (
                <button
                  key={color}
                  type='button'
                  className='w-4 h-4 hover:scale-110 transition-transform focus:outline-none focus:ring-1 focus:ring-gray-400'
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onSelectColor(color);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
