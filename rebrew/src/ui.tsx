import { useEffect, useRef, type ReactNode } from 'react'

/** Escape closes whatever is on top. Panels opt in by calling this. */
export function useEscape(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
}

/**
 * A full-window panel over the coffee machine. Everything except the main
 * screen is one of these, so they all scroll, close and read the same way.
 */
export function Sheet({
  title,
  onClose,
  closeLabel = 'Close',
  children,
  footer,
}: {
  title: string
  onClose: () => void
  closeLabel?: string
  children: ReactNode
  footer?: ReactNode
}) {
  useEscape(onClose)
  const body = useRef<HTMLDivElement>(null)

  // Focus the panel so Escape and the tab order start inside it.
  useEffect(() => {
    body.current?.focus()
  }, [])

  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
      <div className="sheet__bar">
        <h1 className="sheet__title">{title}</h1>
        <button className="bar__btn" onClick={onClose} title={closeLabel} aria-label={closeLabel}>
          ✕
        </button>
      </div>
      <div className="sheet__body" ref={body} tabIndex={-1}>
        {children}
      </div>
      {footer && <div className="sheet__footer">{footer}</div>}
    </div>
  )
}

/** A labelled on/off row, used throughout settings. */
export function Toggle({
  label,
  hint,
  checked,
  onChange,
  disabled,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
}) {
  return (
    <label className={`toggle ${disabled ? 'toggle--off' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle__text">
        <span className="toggle__label">{label}</span>
        {hint && <span className="toggle__hint">{hint}</span>}
      </span>
    </label>
  )
}

/** A yes/no the user has to mean, used before anything destructive. */
export function Confirm({
  question,
  detail,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  question: string
  detail?: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}) {
  useEscape(onCancel)
  return (
    <div className="confirm" role="alertdialog" aria-modal="true" aria-label={question}>
      <div className="confirm__box">
        <p className="confirm__question">{question}</p>
        {detail && <p className="confirm__detail">{detail}</p>}
        <div className="confirm__actions">
          <button className="btn" onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button className="btn btn--danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
