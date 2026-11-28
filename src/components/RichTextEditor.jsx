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

/* Find the nearest td/th ancestor of a selection node */
const getClosestCell = (node) => {
  if (!node) return null;
  const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  return el?.closest?.('td, th') || null;
};

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const savedRangeRef = useRef(null);
  const tablePickerRef = useRef(null);
  const tableButtonRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [tableHover, setTableHover] = useState({ rows: 0, cols: 0 });
  const [tableState, setTableState] = useState({ inTable: false, rows: 0, cols: 0 });

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

  /*
   * FIX: Completely replaced queryCommandState with 100% accurate DOM traversal.
   * This fixes the double-click issue where H2 was falsely triggering the B (Bold) button.
   */
  const refreshActiveFormats = useCallback(() => {
    if (!editorRef.current) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) return;

    // Use startContainer to get the actual cursor position
    let node = range.startContainer;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;

    const state = {
      bold: false, italic: false, underline: false, strike: false,
      ul: false, ol: false, blockquote: false,
      h1: false, h2: false, h3: false, h4: false, p: false,
      alignLeft: false, alignCenter: false, alignRight: false, alignJustify: false,
    };

    let curr = node;
    let foundBlock = false;
    let foundAlign = false;

    // Walk up the DOM tree from the cursor to the editor root
    while (curr && curr !== editorRef.current) {
      if (curr.nodeType === Node.ELEMENT_NODE) {
        const tag = curr.tagName.toLowerCase();
        const style = curr.style;

        // Block formatting
        if (!foundBlock) {
          if (['h1', 'h2', 'h3', 'h4', 'p', 'blockquote'].includes(tag)) {
            state[tag] = true;
            foundBlock = true;
          } else if (tag === 'div') {
            state.p = true;
            foundBlock = true;
          }
        }

        if (tag === 'ul') state.ul = true;
        if (tag === 'ol') state.ol = true;
        if (tag === 'blockquote') state.blockquote = true;

        // Inline formatting (Strictly checking tags/styles, ignoring natural H1-H4 boldness)
        if (tag === 'b' || tag === 'strong' || style.fontWeight === 'bold' || style.fontWeight === '700') {
          state.bold = true;
        }
        if (tag === 'i' || tag === 'em' || style.fontStyle === 'italic') {
          state.italic = true;
        }
        if (tag === 'u' || (style.textDecoration && style.textDecoration.includes('underline'))) {
          state.underline = true;
        }
        if (tag === 's' || tag === 'strike' || (style.textDecoration && style.textDecoration.includes('line-through'))) {
          state.strike = true;
        }

        // Alignment
        if (!foundAlign) {
          const align = style.textAlign || curr.getAttribute('align');
          if (align === 'center') { state.alignCenter = true; foundAlign = true; }
          else if (align === 'right') { state.alignRight = true; foundAlign = true; }
          else if (align === 'justify') { state.alignJustify = true; foundAlign = true; }
          else if (align === 'left') { state.alignLeft = true; foundAlign = true; }
        }
      }
      curr = curr.parentNode;
    }

    // Defaults if not found
    if (!foundBlock) state.p = true;
    if (!foundAlign) state.alignLeft = true;

    setActive(state);

    /* Detect whether the cursor is inside a table */
    const cell = getClosestCell(sel.anchorNode);
    const table = cell ? cell.closest('table') : null;
    setTableState({
      inTable: !!table,
      rows: table ? table.rows.length : 0,
      cols: table && table.rows[0] ? table.rows[0].cells.length : 0,
    });
  }, []);

  /* Attach listeners so highlight follows the cursor */
  useEffect(() => {
    let rafId;
    const handler = () => {
      // requestAnimationFrame ensures the selection state is fully settled on double clicks
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        refreshActiveFormats();
      });
    };
    document.addEventListener('selectionchange', handler);
    return () => {
      document.removeEventListener('selectionchange', handler);
      if (rafId) cancelAnimationFrame(rafId);
    };
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
    const thStyle = 'border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; font-weight: 600;';
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

  /* ---------- Table row / column operations ---------- */
  const addRow = (position) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const cell = getClosestCell(sel.anchorNode);
    const row = cell?.closest('tr');
    if (!row) return;

    const newRow = document.createElement('tr');
    Array.from(row.cells).forEach((c) => {
      const tag = c.tagName.toLowerCase() === 'th' ? 'th' : 'td';
      const newCell = document.createElement(tag);
      newCell.innerHTML = '&nbsp;';
      const style = c.getAttribute('style');
      if (style) newCell.setAttribute('style', style);
      newRow.appendChild(newCell);
    });

    if (position === 'above') row.parentNode.insertBefore(newRow, row);
    else row.parentNode.insertBefore(newRow, row.nextSibling);

    handleInput();
  };

  const deleteRow = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const cell = getClosestCell(sel.anchorNode);
    const row = cell?.closest('tr');
    if (!row) return;
    const table = row.closest('table');

    if (table.rows.length <= 1) {
      if (window.confirm('This will delete the entire table. Continue?')) {
        table.remove();
        handleInput();
      }
      return;
    }
    row.remove();
    handleInput();
  };

  const addColumn = (position) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const cell = getClosestCell(sel.anchorNode);
    if (!cell) return;
    const table = cell.closest('table');
    if (!table) return;

    const colIndex = cell.cellIndex;
    const insertAt = position === 'left' ? colIndex : colIndex + 1;

    Array.from(table.rows).forEach((row) => {
      const refCell = row.cells[colIndex];
      const tag = refCell && refCell.tagName.toLowerCase() === 'th' ? 'th' : 'td';
      const newCell = document.createElement(tag);
      newCell.innerHTML = '&nbsp;';
      const style = refCell?.getAttribute('style');
      if (style) newCell.setAttribute('style', style);
      const ref = row.cells[insertAt] || null;
      if (ref) row.insertBefore(newCell, ref);
      else row.appendChild(newCell);
    });

    handleInput();
  };

  const deleteColumn = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const cell = getClosestCell(sel.anchorNode);
    if (!cell) return;
    const table = cell.closest('table');
    if (!table) return;

    const colIndex = cell.cellIndex;

    if (table.rows[0] && table.rows[0].cells.length <= 1) {
      if (window.confirm('This will delete the entire table. Continue?')) {
        table.remove();
        handleInput();
      }
      return;
    }
    Array.from(table.rows).forEach((row) => {
      if (row.cells[colIndex]) row.deleteCell(colIndex);
    });
    handleInput();
  };

  const deleteTable = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const cell = getClosestCell(sel.anchorNode);
    const table = cell?.closest('table');
    if (!table) return;
    if (window.confirm('Delete this table?')) {
      table.remove();
      handleInput();
    }
  };

  /* Prevent losing selection when clicking toolbar buttons */
  const handleButtonMouseDown = (e) => e.preventDefault();

  /* Smart paste: clean up inline styles (like white backgrounds) from pasted content */
  const handlePaste = (e) => {
    e.preventDefault();
    const clipboard = e.clipboardData || window.clipboardData;
    if (!clipboard) return;

    let html = clipboard.getData('text/html');
    const text = clipboard.getData('text/plain') || '';

    if (html) {
      // Create a temporary DOM element to parse the pasted HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Find all elements and strip out background colors, weird fonts, and classes
      const elements = tempDiv.querySelectorAll('*');
      elements.forEach((el) => {
        el.style.backgroundColor = '';
        el.style.background = '';
        el.style.fontFamily = '';
        el.style.color = '';
        el.style.lineHeight = '';
        el.removeAttribute('class');

        if (el.getAttribute('style') === '') {
          el.removeAttribute('style');
        }
      });

      document.execCommand('insertHTML', false, tempDiv.innerHTML);
    } else {
      // Insert as plain text if no HTML
      document.execCommand('insertText', false, text);
    }

    handleInput();
  };

  const btnClass = (isActive, extra = '') =>
    `p-1.5 rounded transition-colors ${extra} ${
      isActive
        ? 'bg-[#0a85a7] text-white hover:bg-[#097390]'
        : 'text-gray-700 hover:bg-gray-200 active:bg-gray-300'
    }`;

  const tableBtnClass =
    'inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold text-brand-700 hover:bg-brand-100 transition';

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

      {/* Contextual table toolbar — appears only when the cursor is inside a table */}
      {tableState.inTable && (
        <div className="bg-brand-50 border-b border-brand-100 px-2 py-1.5 flex flex-wrap items-center gap-1">
          <span className="px-2 text-[11px] font-semibold text-brand-700 flex items-center gap-1.5">
            <i className="fa-solid fa-table"></i>
            {tableState.rows} × {tableState.cols}
          </span>
          <span className="w-px h-4 bg-brand-200 mx-1"></span>

          <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => addRow('above')} className={tableBtnClass} title="Insert a row above the current row">
            <i className="fa-solid fa-arrow-up"></i> Row
          </button>
          <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => addRow('below')} className={tableBtnClass} title="Insert a row below the current row">
            <i className="fa-solid fa-arrow-down"></i> Row
          </button>

          <span className="w-px h-4 bg-brand-200 mx-1"></span>

          <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => addColumn('left')} className={tableBtnClass} title="Insert a column to the left">
            <i className="fa-solid fa-arrow-left"></i> Col
          </button>
          <button type="button" onMouseDown={handleButtonMouseDown} onClick={() => addColumn('right')} className={tableBtnClass} title="Insert a column to the right">
            <i className="fa-solid fa-arrow-right"></i> Col
          </button>

          <span className="w-px h-4 bg-brand-200 mx-1"></span>

          <button type="button" onMouseDown={handleButtonMouseDown} onClick={deleteRow} className={tableBtnClass} title="Delete the current row">
            <i className="fa-solid fa-minus"></i> Row
          </button>
          <button type="button" onMouseDown={handleButtonMouseDown} onClick={deleteColumn} className={tableBtnClass} title="Delete the current column">
            <i className="fa-solid fa-minus"></i> Col
          </button>

          <span className="w-px h-4 bg-brand-200 mx-1"></span>

          <button type="button" onMouseDown={handleButtonMouseDown} onClick={deleteTable} className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold text-red-600 hover:bg-red-50 transition" title="Delete the entire table">
            <i className="fa-solid fa-trash"></i> Table
          </button>
        </div>
      )}

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