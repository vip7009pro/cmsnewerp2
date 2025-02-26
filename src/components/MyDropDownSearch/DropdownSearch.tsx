import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FixedSizeList as FixedSizeListType, ListChildComponentProps } from 'react-window';
import './DropdownSearch.scss';

interface FixedSizeListProps {
  height: number;
  width: number | string;
  itemCount: number;
  itemSize: number;
  children: React.ComponentType<ListChildComponentProps>;
  [key: string]: any;
}

const FixedSizeList = FixedSizeListType as unknown as React.ComponentClass<FixedSizeListProps>;

interface Option {
  value: string | number;
  label: string;
}

interface DropdownSearchProps {
  options: Option[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  itemHeight?: number;
  visibleItems?: number;
}

const DropdownSearch: React.FC<DropdownSearchProps> = ({
  options = [],
  value = null,
  onChange,
  placeholder = 'Select an option...',
  style = {},
  itemHeight = 35,
  visibleItems = 8,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFading, setIsFading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null); // Theo dõi item được highlight
  const listRef = useRef<InstanceType<typeof FixedSizeListType>>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const selectedLabel = useMemo(() => {
    const selected = options.find(opt => opt.value === value);
    return selected ? selected.label : '';
  }, [value, options]);

  const handleSelect = (selectedValue: string | number) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(null); // Reset highlight khi chọn
  };

  const Row: React.ComponentType<ListChildComponentProps> = ({ index, style }) => {
    const option = filteredOptions[index];
    return (
      <div
        style={style}
        className={`dropdown-item ${value === option.value ? 'selected' : ''} ${
          highlightedIndex === index ? 'highlighted' : ''
        }`}
        onClick={() => handleSelect(option.value)}
      >
        {option.label}
      </div>
    );
  };

  // Xử lý phím mũi tên
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredOptions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (highlightedIndex === null) {
          setHighlightedIndex(0); // Bắt đầu từ item đầu tiên
        } else if (highlightedIndex < filteredOptions.length - 1) {
          setHighlightedIndex(highlightedIndex + 1); // Xuống item tiếp theo
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (highlightedIndex !== null && highlightedIndex > 0) {
          setHighlightedIndex(highlightedIndex - 1); // Lên item trước đó
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex !== null) {
          handleSelect(filteredOptions[highlightedIndex].value); // Chọn item được highlight
        }
        break;
      default:
        break;
    }
  };

  // Focus vào search input khi dropdown mở
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll đến item được highlight
  useEffect(() => {
    if (highlightedIndex !== null && listRef.current) {
      listRef.current.scrollToItem(highlightedIndex, 'smart'); // Scroll thông minh đến item
    }
  }, [highlightedIndex]);

  // Xử lý click ngoài và hiệu ứng mờ
  useEffect(() => {
    let fadeTimeout: NodeJS.Timeout;

    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(null); // Reset highlight khi đóng
      }
    };

    if (isOpen) {
      fadeTimeout = setTimeout(() => {
        setIsFading(true);
      }, 2000);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(fadeTimeout);
      setIsFading(false);
    };
  }, [isOpen]);

  return (
    <div className="dropdown-search" style={style} ref={wrapperRef}>
      <div
        className="dropdown-selected"
        onClick={() => {
          setIsOpen(!isOpen);
          setIsFading(false);
          setHighlightedIndex(null); // Reset highlight khi mở lại
        }}
        style={style}
      >
        {selectedLabel || placeholder}
      </div>

      {isOpen && (
        <div className={`dropdown-menu ${isFading ? 'fade-out' : ''}`}>
          <input
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown} // Thêm sự kiện keydown
            placeholder="Search..."
            onClick={(e) => e.stopPropagation()}
            ref={searchInputRef}
          />
          <FixedSizeList
            height={itemHeight * Math.min(visibleItems, filteredOptions.length)}
            width="100%"
            itemCount={filteredOptions.length}
            itemSize={itemHeight}            
          >
            {Row}
          </FixedSizeList>
        </div>
      )}
    </div>
  );
};

export default DropdownSearch;