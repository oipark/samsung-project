/**
 * 공통 버튼 컴포넌트
 * Figma Button/Button-34px, Button-24px (node 323-3588) 스타일
 * - variant: 'primary' | 'secondary' | 'tertiary'
 * - size: 'md' (34px) | 'sm' (24px)
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}) {
  const sizeClass =
    size === 'sm'
      ? 'h-6 min-w-[40px] px-2.5 py-1 text-[14px] rounded'
      : 'h-[34px] min-w-[60px] px-3 py-[7.5px] text-[14px] rounded'

  const baseClass =
    'inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

  const variantClass = {
    primary:
      'border-none bg-[var(--color-primary)] font-bold text-white hover:bg-[var(--color-button-primary-hover)] disabled:hover:bg-[var(--color-primary)]',
    secondary:
      'border border-[var(--color-primary)] bg-white font-normal text-[var(--color-primary)] hover:bg-[var(--color-primary-bg)] disabled:hover:bg-white',
    tertiary:
      'border-none bg-[var(--color-bg-subtle)] font-normal text-[var(--color-primary)] hover:bg-[var(--color-black-10)] disabled:hover:bg-[var(--color-bg-subtle)]',
  }

  const combined = [
    baseClass,
    sizeClass,
    variantClass[variant] || variantClass.primary,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} disabled={disabled} className={combined} {...props}>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  )
}
