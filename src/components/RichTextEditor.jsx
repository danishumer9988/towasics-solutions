import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  // Sync external changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

  // Prevent losing selection
  const handleButtonMouseDown = (e) => {
    e.preventDefault();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent bg-white shadow-sm">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center">
        {/* Formatting Buttons */}
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('bold')}
          className="p-1.5 px-3 text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded font-bold text-sm"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('italic')}
          className="p-1.5 px-3 text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded italic text-sm font-serif"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('underline')}
          className="p-1.5 px-3 text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded underline text-sm"
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
          className="p-1.5 px-2 text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded text-xs font-bold"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('formatBlock', '<h3>')}
          className="p-1.5 px-2 text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded text-xs font-bold"
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('formatBlock', '<p>')}
          className="p-1.5 px-2 text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded text-xs"
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
          className="p-1.5 text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded text-sm"
          title="Bullet List"
        >
          <i className="fa-solid fa-list-ul"></i>
        </button>
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('insertOrderedList')}
          className="p-1.5 text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded text-sm"
          title="Numbered List"
        >
          <i className="fa-solid fa-list-ol"></i>
        </button>
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCmd('formatBlock', '<blockquote>')}
          className="p-1.5 text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded text-sm font-serif"
          title="Quote"
        >
          ”
        </button>

        <span className="w-px h-6 bg-gray-200 mx-1"></span>

        {/* Links & Images */}
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

        {/* Clear Formatting */}
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
        className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto outline-none prose max-w-none font-sans"
        placeholder={placeholder}
      />
    </div>
  );
}
