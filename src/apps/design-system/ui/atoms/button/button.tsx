import type { FC } from 'react'
import classNames from 'classnames'

type ButtonProps = {
  className?: string
  label?: string
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void
}

export const Button: FC<ButtonProps> = ({ className, label, onClick }) => (
  <button className={classNames('design-system-button-main', className)} onClick={onClick}>
    {label && <p>{label}</p>}
  </button>
)
