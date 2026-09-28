import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Export an array of objects to CSV, Excel, PDF, or JSON.
 *
 * @param {Array}    rows      Array of plain objects
 * @param {Array}    columns   [{ label, key }]  — defines column order + display name
 * @param {String}   format    'csv' | 'excel' | 'pdf' | 'json'
 * @param {String}   filename  without extension
 * @param {String}   title     shown on PDF header
 */
export function exportData(rows, columns, format, filename, title) {
  if (!rows || rows.length === 0) {
    alert('No data to export')
    return
  }

  // Normalize each row to { label: value } using the column definitions
  const normalized = rows.map((row) => {
    const obj = {}
    columns.forEach((c) => {
      const val = typeof c.value === 'function' ? c.value(row) : row[c.key]
      obj[c.label] = val ?? ''
    })
    return obj
  })

  /* -------------------- JSON -------------------- */
  if (format === 'json') {
    downloadBlob(
      JSON.stringify(normalized, null, 2),
      'application/json',
      `${filename}.json`
    )
    return
  }

  /* -------------------- CSV -------------------- */
  if (format === 'csv') {
    const headers = columns.map((c) => `"${c.label}"`).join(',')
    const lines = normalized.map((row) =>
      columns
        .map((c) => {
          const v = row[c.label] ?? ''
          return `"${String(v).replace(/"/g, '""')}"`
        })
        .join(',')
    )
    // BOM prefix makes Excel open it with correct UTF-8
    const csv = '\uFEFF' + headers + '\n' + lines.join('\n')
    downloadBlob(csv, 'text/csv;charset=utf-8', `${filename}.csv`)
    return
  }

  /* -------------------- Excel -------------------- */
  if (format === 'excel') {
    const ws = XLSX.utils.json_to_sheet(normalized)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Data')
    XLSX.writeFile(wb, `${filename}.xlsx`)
    return
  }

  /* -------------------- PDF -------------------- */
  if (format === 'pdf') {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
    doc.setFontSize(16)
    doc.setTextColor(8, 107, 135)
    doc.text(title || filename, 40, 40)
    doc.setFontSize(9)
    doc.setTextColor(120, 120, 120)
    doc.text(`Generated: ${new Date().toLocaleString()}  ·  ${rows.length} record(s)`, 40, 58)

    autoTable(doc, {
      head: [columns.map((c) => c.label)],
      body: normalized.map((row) => columns.map((c) => String(row[c.label] ?? ''))),
      startY: 80,
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: [10, 133, 167], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 250, 252] },
      margin: { left: 40, right: 40 },
    })

    doc.save(`${filename}.pdf`)
  }
}

function downloadBlob(content, mime, filename) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

/* -------------------- Dropdown component -------------------- */
import { useEffect, useState } from 'react'

export function DownloadMenu({ onDownload, label = 'Download', disabled = false }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    setTimeout(() => window.addEventListener('click', close), 0)
    return () => window.removeEventListener('click', close)
  }, [open])

  const items = [
    { key: 'csv',   label: 'CSV (.csv)',    icon: 'fa-file-csv' },
    { key: 'excel', label: 'Excel (.xlsx)', icon: 'fa-file-excel' },
    { key: 'pdf',   label: 'PDF (.pdf)',    icon: 'fa-file-pdf' },
    { key: 'json',  label: 'JSON (.json)',  icon: 'fa-file-code' },
  ]

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`px-3 py-2 text-xs font-semibold rounded-lg border border-line bg-white hover:bg-gray-50 transition inline-flex items-center gap-1.5 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <i className="fa-solid fa-download"></i>
        {label}
        <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} text-[10px] ml-0.5`}></i>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-line rounded-lg shadow-lg z-50 min-w-[170px] py-1">
          {items.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => { onDownload(opt.key); setOpen(false) }}
              className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 flex items-center gap-2"
            >
              <i className={`fa-solid ${opt.icon} text-brand-600 w-4`}></i>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}