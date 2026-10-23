export default function ConsentCheckbox({
  showCookies = true,
  cookieChecked,
  policyChecked,
  onCookieChange,
  onPolicyChange,
  className = ''
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Checkbox 1: Cookies (Only shows if showCookies is true) */}
      {showCookies && (
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={cookieChecked}
            onChange={(e) => onCookieChange(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0a85a7] focus:ring-[#0a85a7] cursor-pointer"
          />
          <span className="text-sm text-gray-600 font-medium group-hover:text-gray-800 transition-colors">
            Please accept our cookies.
          </span>
        </label>
      )}

      {/* Checkbox 2: Privacy Policy & Terms (Always shows) */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={policyChecked}
          onChange={(e) => onPolicyChange(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0a85a7] focus:ring-[#0a85a7] cursor-pointer"
        />
        <span className="text-sm text-gray-600 font-medium group-hover:text-gray-800 transition-colors">
          Please accept our privacy policy and terms of service.
        </span>
      </label>
    </div>
  )
}