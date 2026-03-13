/**
 * 공통 체크박스 (Figma node 330-3591)
 * 1. 일반상태  2. 체크된상태  3. 체크됨+비활성  4. 비체크+비활성
 */
const CheckmarkSvg = ({ className = 'text-white' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M5 12l5 5L19 7" />
  </svg>
)

export default function Checkbox({
  checked = false,
  disabled = false,
  onChange,
  'aria-label': ariaLabel,
  className = '',
  ...props
}) {
  const isCheckedDisabled = checked && disabled
  const isUncheckedDisabled = !checked && disabled

  const inputClass = [
    'peer h-5 w-5 shrink-0 rounded-md border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    'appearance-none',
    isCheckedDisabled && 'border-blue-300 bg-blue-200',
    isUncheckedDisabled && 'border-gray-200 bg-gray-100',
    !disabled && !checked && 'border-gray-300 bg-white',
    !disabled && checked && 'border-blue-800 bg-blue-800',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <label
      className={`relative inline-flex h-5 w-5 flex-shrink-0 items-center justify-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={disabled ? undefined : onChange}
        className={inputClass}
        aria-label={ariaLabel}
        {...props}
      />
      <span
        className={`pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity peer-checked:opacity-100 ${
          isCheckedDisabled ? '!opacity-100 text-blue-600' : 'text-white'
        }`}
      >
        <CheckmarkSvg className={isCheckedDisabled ? 'h-3.5 w-3.5 text-blue-600' : 'h-3.5 w-3.5 text-white'} />
      </span>
    </label>
  )
}
