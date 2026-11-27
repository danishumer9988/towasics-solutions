import React, { useRef, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const FONT_SIZES = [
  { value: '2', label: 'Small' },
  { value: '3', label: 'Normal' },
  { value: '4', label: 'Medium' },
  { value: '5', label: 'Large' },
  { value: '6', label: 'X-Large' },
  { value: '7', label: 'XX-Large' },
];

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const savedRangeRef = useRef(null);
  const tablePickerRef = useRef(null);
  const tableButtonRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [tableHover, setTableHover] = useState({ rows: 0, cols: 0 });

  const [active, setActive] = useState({
    bold: false, italic: false, underline: false, strike: false,
    ul: false, ol: false, blockquote: false,
    h1: false, h2: false, h3: false, h4: false, p: false,
    alignLeft: false, alignCenter: false, alignRight: false, alignJustify: false,
  });

  /* Sync external changes */
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  /* Detect which formats are active at the cursor */
  const refreshActiveFormats = useCallback(() => {
    if (!editorRef.current) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) return;

    const blockTag = (() => {
      try {
        return (document.queryCommandValue('formatBlock') || '').toLowerCase();
      } catch { return ''; }
    })();

    const safeQuery = (cmd) => {
      try { return document.queryCommandState(cmd); } catch { return false; }
    };

    setActive({
      bold:       safeQuery('bold'),
      italic:     safeQuery('italic'),
      underline:  safeQuery('underline'),
      strike:     safeQuery('strikeThrough'),
      ul:         safeQuery('insertUnorderedList'),
      ol:         safeQuery('insertOrderedList'),
      blockquote: blockTag === 'blockquote',
      h1:         blockTag === 'h1',
      h2:         blockTag === 'h2',
      h3:         blockTag === 'h3',
      h4:         blockTag === 'h4',
      p:          blockTag === 'p' || blockTag === '',
      alignLeft:    safeQuery('justifyLeft'),
      alignCenter:  safeQuery('justifyCenter'),
      alignRight:   safeQuery('justifyRight'),
      alignJustify: safeQuery('justifyFull'),
    });
  }, []);

  /* Attach listeners so highlight follows the cursor */
  useEffect(() => {
    const handler = () => refreshActiveFormats();
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, [refreshActiveFormats]);

  /* Close table picker on outside click */
  useEffect(() => {
    if (!showTablePicker) return;
    const handler = (e) => {
      if (
        tablePickerRef.current && !tablePickerRef.current.contains(e.target) &&
        tableButtonRef.current && !tableButtonRef.current.contains(e.target)
      ) {
        setShowTablePicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showTablePicker]);

  /* Save / restore selection for popups & dropdowns */
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedRangeRef.current && editorRef.current) {
      editorRef.current.focus();
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
    refreshActiveFormats();
  };

  const handleKeyUp = () => refreshActiveFormats();
  const handleMouseUp = () => refreshActiveFormats();
  const handleFocus = () => refreshActiveFormats();

  const execCmd = (command, val = null) => {
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleLink = (e) => {
    e.preventDefault();
    const url = prompt('Enter the link URL (e.g., https://example.com):');
    if (url) execCmd('createLink', url);
  };

  const handleImageUploadClick = (e) => {
    e.preventDefault();
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      alert('Invalid file type. Please choose a PNG or JPEG image.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data && res.data.url) execCmd('insertImage', res.data.url);
    } catch (err) {
      console.error('Editor image upload failed:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  /* Font size — restore selection first, force <font size="N"> output */
  const handleFontSizeChange = (e) => {
    const sizeValue = e.target.value;
    if (!sizeValue) return;
    restoreSelection();
    document.execCommand('styleWithCSS', false, false);
    document.execCommand('fontSize', false, sizeValue);
    handleInput();
    e.target.value = '';
  };

  /* Table grid picker */
  const toggleTablePicker = () => {
    saveSelection();
    setShowTablePicker((s) => !s);
    setTableHover({ rows: 0, cols: 0 });
  };

  const insertTable = (rows, cols) => {
    if (rows < 1 || cols < 1) return;
    restoreSelection();
    const thStyle = 'border: 1px solid #d1d5db; padding: 8px 12px; background: #f3f4f6; text-align: left; font-weight: 600;';
    const tdStyle = 'border: 1px solid #d1d5db; padding: 8px 12px; vertical-align: top;';
    const headerRow = `<tr>${Array(cols).fill(`<th style="${thStyle}">Header</th>`).join('')}</tr>`;
    const bodyRows = Array(Math.max(0, rows - 1)).fill(
      `<tr>${Array(cols).fill(`<td style="${tdStyle}">&nbsp;</td>`).join('')}</tr>`
    ).join('');
    const tableHtml =
      `<table style="width: 100%; border-collapse: collapse; margin: 12px 0;">` +
      `<thead>${headerRow}</thead>` +
      `<tbody>${bodyRows}</tbody>` +
      `</table><p><br></p>`;
    document.execCommand('insertHTML', false, tableHtml);
    handleInput();
    setShowTablePicker(false);
    setTableHover({ rows: 0, cols: 0 });
  };

  /* Prevent losing selection when clicking toolbar buttons */
  const handleButtonMouseDown = (e) => e.preventDefault();

  /* Smart paste: if user pastes raw HTML source, insert as HTML */
  const handlePaste = (e) => {
    const clipboard = e.clipboardData || window.clipboardData;
    if (!clipboard) return;
    const text = clipboard.getData('text/plain') || '';
    const html = clipboard.getData('text/html') || '';
    const looksLikeHtmlSource = /^\s*</.test(text) && /<\/[a-z][\s\S]*>/i.test(text);
    if (looksLikeHtmlSource && !html) {
      e.preventDefault();
      document.execCommand('insertHTML', false, text);
      handleInput();
    }
  };

  const btnClass = (isActive, extra = '') =>
    `p-1.5 rounded transition-colors ${extra} ${
      isActive
        ? 'bg-[#0a85a7] text-white hover:bg-[#097390]'
        : 'text-gray-700 hover:bg-gray-200 active:bg-gray-300'
    }`;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent bg-white shadow-sm">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center">

        {/* Undo / Redo */}
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('undo')} className="p-1.5 text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded text-sm" title="Undo">
          <i className="fa-solid fa-rotate-left"></i>
        </button>
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('redo')} className="p-1.5 text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded text-sm" title="Redo">
          <i className="fa-solid fa-rotate-right"></i>
        </button>

        <span className="w-px h-6 bg-gray-200 mx-1"></span>

        {/* Block types */}
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('formatBlock', '<h1>')} className={btnClass(active.h1, 'px-2 text-xs font-bold')} title="Heading 1">H1</button>
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('formatBlock', '<h2>')} className={btnClass(active.h2, 'px-2 text-xs font-bold')} title="Heading 2">H2</button>
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('formatBlock', '<h3>')} className={btnClass(active.h3, 'px-2 text-xs font-bold')} title="Heading 3">H3</button>
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('formatBlock', '<h4>')} className={btnClass(active.h4, 'px-2 text-xs font-bold')} title="Heading 4">H4</button>
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('formatBlock', '<p>')} className={btnClass(active.p, 'px-2 text-xs')} title="Paragraph">P</button>

        <span className="w-px h-6 bg-gray-200 mx-1"></span>

        {/* Font size */}
        <select
          onMouseDown={saveSelection}
          onChange={handleFontSizeChange}
          defaultValue=""
          className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
          title="Font Size"
        >
          <option value="" disabled>Size</option>
          {FONT_SIZES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <span className="w-px h-6 bg-gray-200 mx-1"></span>

        {/* Inline formatting */}
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('bold')} className={btnClass(active.bold, 'px-3 font-bold text-sm')} title="Bold">B</button>
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('italic')} className={btnClass(active.italic, 'px-3 italic text-sm font-serif')} title="Italic">I</button>
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('underline')} className={btnClass(active.underline, 'px-3 underline text-sm')} title="Underline">U</button>
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('strikeThrough')} className={btnClass(active.strike, 'px-3 line-through text-sm')} title="Strikethrough">S</button>

        <span className="w-px h-6 bg-gray-200 mx-1"></span>

        {/* Alignment */}
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('justifyLeft')} className={btnClass(active.alignLeft, 'text-sm')} title="Align Left"><i className="fa-solid fa-align-left"></i></button>
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('justifyCenter')} className={btnClass(active.alignCenter, 'text-sm')} title="Align Center"><i className="fa-solid fa-align-center"></i></button>
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('justifyRight')} className={btnClass(active.alignRight, 'text-sm')} title="Align Right"><i className="fa-solid fa-align-right"></i></button>
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('justifyFull')} className={btnClass(active.alignJustify, 'text-sm')} title="Justify"><i className="fa-solid fa-align-justify"></i></button>

        <span className="w-px h-6 bg-gray-200 mx-1"></span>

        {/* Lists & Quote */}
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('insertUnorderedList')} className={btnClass(active.ul, 'text-sm')} title="Bullet List"><i className="fa-solid fa-list-ul"></i></button>
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('insertOrderedList')} className={btnClass(active.ol, 'text-sm')} title="Numbered List"><i className="fa-solid fa-list-ol"></i></button>
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('formatBlock', '<blockquote>')} className={btnClass(active.blockquote, 'text-sm font-serif')} title="Quote">”</button>

        <span className="w-px h-6 bg-gray-200 mx-1"></span>

        {/* Link, Image, Table, HR */}
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={handleLink} className="p-1.5 text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded text-sm" title="Insert Link">
          <i className="fa-solid fa-link"></i>
        </button>
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={handleImageUploadClick} disabled={uploading} className="p-1.5 text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded text-sm flex items-center gap-1" title="Insert Image">
          <i className="fa-solid fa-image"></i>
          {uploading && <span className="text-[10px] text-brand-600">…</span>}
        </button>

        {/* Table with grid picker */}
        <div className="relative" ref={tableButtonRef}>
          <button
            type="button"
            onMouseDown={handleButtonMouseDown}
            onClick={toggleTablePicker}
            className={btnClass(showTablePicker, 'text-sm')}
            title="Insert Table"
          >
            <i className="fa-solid fa-table"></i>
          </button>
          {showTablePicker && (
            <div
              ref={tablePickerRef}
              className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50"
            >
              <div className="text-[11px] text-gray-500 mb-1.5 text-center">
                {tableHover.rows > 0 ? `${tableHover.rows} × ${tableHover.cols}` : 'Select size'}
              </div>
              {Array.from({ length: 6 }).map((_, r) => (
                <div key={r} className="flex">
                  {Array.from({ length: 6 }).map((_, c) => {
                    const isHighlighted = r < tableHover.rows && c < tableHover.cols;
                    return (
                      <button
                        key={c}
                        type="button"
                        onMouseEnter={() => setTableHover({ rows: r + 1, cols: c + 1 })}
                        onClick={() => insertTable(r + 1, c + 1)}
                        className={`w-5 h-5 m-0.5 rounded-sm border transition-colors ${
                          isHighlighted
                            ? 'bg-[#0a85a7] border-[#0a85a7]'
                            : 'bg-white border-gray-300 hover:border-[#0a85a7]'
                        }`}
                        title={`${r + 1} × ${c + 1}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('insertHorizontalRule')} className="p-1.5 text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded text-sm" title="Horizontal Rule">
          <i className="fa-solid fa-minus"></i>
        </button>

        <span className="w-px h-6 bg-gray-200 mx-1"></span>

        {/* Clear */}
        <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => execCmd('removeFormat')} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded text-sm" title="Clear Formatting">
          <i className="fa-solid fa-eraser"></i>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageFileChange}
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
        />
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyUp={handleKeyUp}
        onMouseUp={handleMouseUp}
        onFocus={handleFocus}
        className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto outline-none prose max-w-none font-sans"
        placeholder={placeholder}
      />
    </div>
  );
}