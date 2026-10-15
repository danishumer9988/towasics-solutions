import React, { useRef, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  /* Active formats tracked at the current cursor position */
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    underline: false,
    ul: false,
    ol: false,
    blockquote: false,
    h2: false,
    h3: false,
    p: false,
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
    // Only compute when the selection is inside the editor
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) return;

    const blockTag = (() => {
      try {
        return (document.queryCommandValue('formatBlock') || '').toLowerCase();
      } catch {
        return '';
      }
    })();

    const safeQuery = (cmd) => {
      try { return document.queryCommandState(cmd); } catch { return false; }
    };

    setActive({
      bold:       safeQuery('bold'),
      italic:     safeQuery('italic'),
      underline:  safeQuery('underline'),
      ul:         safeQuery('insertUnorderedList'),
      ol:         safeQuery('insertOrderedList'),
      blockquote: blockTag === 'blockquote',
      h2:         blockTag === 'h2',
      h3:         blockTag === 'h3',
      p:          blockTag === 'p' || blockTag === '',
    });
  }, []);

  /* Attach listeners so highlight follows the cursor */
  useEffect(() => {
    const handler = () => refreshActiveFormats();
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, [refreshActiveFormats]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
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
    if (url) {
      execCmd('createLink', url);
    }
  };

  const handleImageUploadClick = (e) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
      if (res.data && res.data.url) {
        execCmd('insertImage', res.data.url);
      }
    } catch (err) {
      console.error('Editor image upload failed:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  /* Prevent losing selection when clicking toolbar buttons */
  const handleButtonMouseDown = (e) => {
    e.preventDefault();
  };

  /* Smart paste: if user pastes raw HTML source, insert as HTML */
  const handlePaste = (e) => {
    const clipboard = e.clipboardData || window.clipboardData;
    if (!clipboard) return;

    const text = clipboard.getData('text/plain') || '';
    const html = clipboard.getData('text/html') || '';

    const looksLikeHtmlSource =
      /^\s*</.test(text) &&
      /<\/[a-z][\s\S]*>/i.test(text);

    if (looksLikeHtmlSource && !html) {
      e.preventDefault();
      document.execCommand('insertHTML', false, text);
      handleInput();
    }
  };

  /* Shared button class — highlights when active */
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
        {/* Bold / Italic / Underline */}
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('bold')}
          className={btnClass(active.bold, 'px-3 font-bold text-sm')}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('italic')}
          className={btnClass(active.italic, 'px-3 italic text-sm font-serif')}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('underline')}
          className={btnClass(active.underline, 'px-3 underline text-sm')}
          title="Underline"
        >
          U
        </button>

        <span className="w-px h-6 bg-gray-200 mx-1"></span>

        {/* Headings */}
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('formatBlock', '<h2>')}
          className={btnClass(active.h2, 'px-2 text-xs font-bold')}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('formatBlock', '<h3>')}
          className={btnClass(active.h3, 'px-2 text-xs font-bold')}
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('formatBlock', '<p>')}
          className={btnClass(active.p, 'px-2 text-xs')}
          title="Paragraph"
        >
          P
        </button>

        <span className="w-px h-6 bg-gray-200 mx-1"></span>

        {/* Lists */}
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('insertUnorderedList')}
          className={btnClass(active.ul, 'text-sm')}
          title="Bullet List"
        >
          <i className="fa-solid fa-list-ul"></i>
        </button>
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('insertOrderedList')}
          className={btnClass(active.ol, 'text-sm')}
          title="Numbered List"
        >
          <i className="fa-solid fa-list-ol"></i>
        </button>
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('formatBlock', '<blockquote>')}
          className={btnClass(active.blockquote, 'text-sm font-serif')}
          title="Quote"
        >
          ”
        </button>

        <span className="w-px h-6 bg-gray-200 mx-1"></span>

        {/* Links & Images — no active state */}
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={handleLink}
          className="p-1.5 text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded text-sm"
          title="Insert Link"
        >
          <i className="fa-solid fa-link"></i>
        </button>
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={handleImageUploadClick}
          disabled={uploading}
          className="p-1.5 text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded text-sm flex items-center gap-1"
          title="Insert Image"
        >
          <i className="fa-solid fa-image"></i>
          {uploading && <span className="text-[10px] text-brand-600">Uploading...</span>}
        </button>

        <span className="w-px h-6 bg-gray-200 mx-1"></span>

        {/* Clear */}
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('removeFormat')}
          className="p-1.5 text-gray-500 hover:bg-gray-200 rounded text-sm"
          title="Clear Formatting"
        >
          <i className="fa-solid fa-eraser"></i>
        </button>

        {/* Hidden File Input */}
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