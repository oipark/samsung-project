/**
 * 아이콘: Material Design 3 Outlined (Google Fonts CDN)
 * npm 패키지 없이 동작, M3 Outlined 스타일 유지
 * @see https://m3.material.io/styles/icons/overview
 */
const defaultSize = 20

export function M3Icon({ icon, className = 'w-5 h-5', size = defaultSize }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontFamily: "'Material Symbols Outlined'",
        fontSize: size,
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'inherit',
      }}
      aria-hidden
    >
      {icon}
    </span>
  )
}

export function IconDashboard({ className = 'w-5 h-5' }) {
  return <M3Icon icon="dashboard" className={className} size={defaultSize} />
}

export function IconChevronDown({ className = 'w-5 h-5', size }) {
  return <M3Icon icon="expand_more" className={className} size={size ?? defaultSize} />
}

export function IconChevronRight({ className = 'w-5 h-5' }) {
  return <M3Icon icon="chevron_right" className={className} size={defaultSize} />
}

export function IconChevronLeft({ className = 'w-6 h-6' }) {
  return <M3Icon icon="chevron_left" className={className} size={24} />
}

export function IconChevronDoubleLeft({ className = 'w-5 h-5' }) {
  return <M3Icon icon="keyboard_double_arrow_left" className={className} size={defaultSize} />
}

export function IconDocumentPencil({ className = 'w-5 h-5' }) {
  return <M3Icon icon="description" className={className} size={defaultSize} />
}

export function IconShieldSearch({ className = 'w-5 h-5' }) {
  return <M3Icon icon="shield" className={className} size={defaultSize} />
}

export function IconClipboardList({ className = 'w-5 h-5' }) {
  return <M3Icon icon="assignment" className={className} size={defaultSize} />
}

export function IconCog({ className = 'w-5 h-5' }) {
  return <M3Icon icon="settings" className={className} size={defaultSize} />
}

export function IconClose({ className = 'w-6 h-6' }) {
  return <M3Icon icon="close" className={className} size={24} />
}

export function IconProfile({ className = 'w-5 h-5' }) {
  return <M3Icon icon="person" className={className} size={defaultSize} />
}

export function IconManual({ className = 'w-5 h-5' }) {
  return <M3Icon icon="menu_book" className={className} size={defaultSize} />
}

export function IconCalendar({ className = 'w-5 h-5' }) {
  return <M3Icon icon="calendar_today" className={className} size={defaultSize} />
}

export function IconInfo({ className = 'w-5 h-5' }) {
  return <M3Icon icon="info" className={className} size={defaultSize} />
}

/** Windows (M3에 브랜드 없음 – 인라인 SVG) */
export function IconWindows({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm7 .25l10 .15V21l-10-1.91V13.25z" />
    </svg>
  )
}

/** Linux (M3에 브랜드 없음 – 인라인 SVG) */
export function IconLinux({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.413 1.684-.347 2.454.056.656.259 1.229.593 1.686.345.475.84.793 1.424.908.634.124 1.253-.035 1.75-.42.498-.385.877-.95 1.099-1.612.225-.663.3-1.385.211-2.077-.089-.692-.337-1.348-.715-1.897.576-.276 1.167-.237 1.682.168.515.405.91 1.055 1.146 1.882.236.827.302 1.772.183 2.717-.12.945-.435 1.858-.906 2.6-.471.743-1.076 1.288-1.718 1.553-.642.265-1.299.246-1.878-.054-.579-.301-1.061-.837-1.392-1.532-.331-.695-.502-1.519-.494-2.359.009-.84.189-1.669.528-2.359-.673-.318-1.218-.93-1.546-1.722-.328-.792-.422-1.704-.27-2.617.152-.913.548-1.787 1.14-2.493.592-.706 1.358-1.213 2.17-1.455.812-.242 1.63-.21 2.354.093.724.303 1.332.878 1.742 1.62.41.742.607 1.596.566 2.449-.041.853-.379 1.677-.958 2.359-.116.137-.24.267-.372.389-.666-.772-1.011-1.776-.968-2.78.043-1.004.378-1.987.968-2.78.943-1.264 2.391-2.028 3.894-2.028.239 0 .478.019.715.056.826.129 1.588.437 2.208.893.62.456 1.067 1.034 1.294 1.678.227.644.224 1.327-.009 1.97-.233.643-.669 1.218-1.246 1.572-.577.354-1.261.468-1.887.322-.626-.146-1.164-.532-1.513-1.088-.349-.556-.485-1.244-.385-1.911.1-.667.437-1.272.954-1.653.517-.381 1.178-.513 1.819-.369.641.144 1.22.532 1.62 1.088.4.556.597 1.244.561 1.911-.036.667-.311 1.272-.828 1.653-.259.191-.553.338-.868.434-.315.096-.645.139-.976.126-.331-.013-.658-.079-.968-.196-.31-.117-.597-.283-.848-.489-.251-.206-.463-.449-.626-.72-.163-.271-.275-.565-.332-.869-.057-.304-.058-.613-.003-.917.055-.304.164-.598.322-.869.158-.271.363-.514.607-.72.244-.206.523-.371.828-.489.305-.118.631-.196.968-.228.337-.032.673-.017 1.003.045.33.062.647.173.94.322.293.149.557.345.782.576.225.231.407.494.539.782.132.288.212.595.237.91.025.315-.006.632-.092.944-.086.312-.225.61-.411.882-.186.272-.417.513-.686.711-.269.198-.573.349-.897.434-.324.085-.662.111-.997.076-.335-.035-.661-.129-.963-.276-.302-.147-.574-.345-.803-.576-.229-.231-.411-.494-.539-.782-.128-.288-.2-.595-.213-.91-.013-.315.032-.632.134-.944.102-.312.266-.61.489-.882.223-.272.503-.513.834-.711.331-.198.71-.349 1.112-.434.402-.085.82-.111 1.232-.076.412.035.818.129 1.2.276.382.147.732.345 1.034.576.302.231.551.494.728.782.177.288.279.595.302.91.023.315-.032.632-.165.944-.133.312-.34.61-.607.882-.267.272-.589.513-.963.711-.374.198-.793.349-1.244.434-.451.085-.92.111-1.385.076-.465-.035-.922-.129-1.354-.276-.432-.147-.832-.345-1.183-.576-.351-.231-.647-.494-.882-.782-.235-.288-.405-.595-.503-.91-.098-.315-.121-.632-.069-.944.052-.312.172-.61.351-.882.179-.272.413-.513.694-.711.281-.198.605-.349.957-.434.352-.085.716-.111 1.071-.076.355.035.702.129 1.024.276.322.147.614.345.861.576.247.231.445.494.586.782.141.288.222.595.24.91.018.315-.028.632-.138.944-.11.312-.283.61-.513.882-.23.272-.513.513-.842.711-.329.198-.699.349-1.097.434-.398.085-.811.111-1.218.076.407.035.807.129 1.18.276.373.147.723.345 1.034.576.311.231.567.494.754.782.187.288.301.595.334.91.033.315-.017.632-.15.944-.133.312-.339.61-.607.882-.268.272-.593.513-.969.711-.376.198-.797.349-1.25.434-.453.085-.923.111-1.388.076z" />
    </svg>
  )
}

/** Apple (M3에 브랜드 없음 – 인라인 SVG) */
export function IconApple({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 6.98.48 9.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

export function IconArrowRight({ className = 'w-5 h-5' }) {
  return <M3Icon icon="arrow_forward" className={className} size={defaultSize} />
}

export function IconEmergency({ className = 'w-5 h-5' }) {
  return <M3Icon icon="warning" className={className} size={defaultSize} />
}

export function IconEvent({ className = 'w-5 h-5' }) {
  return <M3Icon icon="event" className={className} size={defaultSize} />
}

export function IconAssignmentAdd({ className = 'w-5 h-5' }) {
  return <M3Icon icon="assignment_add" className={className} size={defaultSize} />
}

export function IconAccountTree({ className = 'w-5 h-5' }) {
  return <M3Icon icon="account_tree" className={className} size={defaultSize} />
}

export function IconStorage({ className = 'w-5 h-5' }) {
  return <M3Icon icon="storage" className={className} size={defaultSize} />
}

export function IconChecklist({ className = 'w-5 h-5' }) {
  return <M3Icon icon="checklist" className={className} size={defaultSize} />
}

export function IconStar({ className = 'w-5 h-5' }) {
  return <M3Icon icon="star" className={className} size={defaultSize} />
}

export function IconRefresh({ className = 'w-5 h-5' }) {
  return <M3Icon icon="refresh" className={className} size={defaultSize} />
}

export function IconExpandLess({ className = 'w-5 h-5' }) {
  return <M3Icon icon="expand_less" className={className} size={defaultSize} />
}

export function IconFilterList({ className = 'w-5 h-5' }) {
  return <M3Icon icon="filter_list" className={className} size={defaultSize} />
}

export function IconCheck({ className = 'w-5 h-5' }) {
  return <M3Icon icon="check" className={className} size={defaultSize} />
}

export function IconDownload({ className = 'w-5 h-5' }) {
  return <M3Icon icon="download" className={className} size={defaultSize} />
}
