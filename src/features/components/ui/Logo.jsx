export function Logo({ compact = false }) {
  return (
    <div className="logo">
      <span className="material-symbols-outlined" aria-hidden="true">
        spa
      </span>
      {!compact && <span>Comfort</span>}
    </div>
  )
}
