export function Logo({ compact = false, brandName = 'Comfort', icon = 'spa' }) {
  return (
    <div className="logo">
      <span className="material-symbols-outlined" aria-hidden="true">
        {icon}
      </span>
      {!compact && <span>{brandName}</span>}
    </div>
  )
}
