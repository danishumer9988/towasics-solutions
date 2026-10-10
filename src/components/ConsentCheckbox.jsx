// src/components/ConsentCheckbox.jsx
import { Link } from 'react-router-dom'

export default function ConsentCheckbox({
  checked,
  onChange,
  className = '',
  id = 'consent-cookie',
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-2.5 cursor-pointer select-none ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        className="mt-[2px] h-4 w-4 shrink-0 rounded border-gray-300 accent-[#0a85a7] focus:ring-2 focus:ring-[#0a85a7]/30 cursor-pointer"
      />
      <span className="text-xs sm:text-[13px] text-gray-600 leading-snug">
        Please accept our privacy policy, cookies and terms of services.
      </span>
    </label>
  )
}