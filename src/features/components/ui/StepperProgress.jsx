import '../styles/ui/stepper-progress.css'

import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

function getStepStatus(index, currentStep) {
  if (index < currentStep) return 'completed'
  if (index === currentStep) return 'active'
  return 'pending'
}

export function StepperProgress({ steps = [], currentStep = 0, ariaLabel }) {
  const { t } = useTranslation()
  const resolvedAriaLabel = ariaLabel ?? t('checkout.progressAria')
  const safeSteps =
    steps.length > 0 ? steps : [{ id: 'step-1', label: t('checkout.steps.shipping') }]
  const lastStepIndex = safeSteps.length - 1
  const clampedStep = Math.max(0, Math.min(currentStep, lastStepIndex))
  const gridTemplateColumns = safeSteps
    .flatMap((_, index) =>
      index === lastStepIndex ? ['minmax(0, 1fr)'] : ['minmax(0, 1fr)', 'minmax(0, 1fr)'],
    )
    .join(' ')

  return (
    <nav className="stepper-progress" aria-label={resolvedAriaLabel}>
      <ol className="stepper-progress-row" style={{ gridTemplateColumns }}>
        {safeSteps.map((step, index) => {
          const status = getStepStatus(index, clampedStep)
          const isCompleted = status === 'completed'
          const isActive = status === 'active'
          const stepKey = step.id ?? `${step.label}-${index}`

          return (
            <Fragment key={stepKey}>
              <li className={`stepper-progress-item is-${status}`} aria-current={isActive ? 'step' : undefined}>
                <span className="stepper-progress-node" aria-hidden="true">
                  {isCompleted ? (
                    <span className="material-symbols-outlined">check_circle</span>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </span>
                <span className="stepper-progress-label">{step.label}</span>
              </li>

              {index < lastStepIndex && (
                <span className="stepper-progress-connector" aria-hidden="true">
                  <span className="stepper-progress-connector-base">
                    <span
                      className={`stepper-progress-connector-fill ${
                        index < clampedStep ? 'is-filled' : ''
                      }`}
                    />
                  </span>
                </span>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
