import '@/styles/checkbox.css'
import { useState } from 'react';

export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean; 
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  id,
  name,
  className = "",
}) => {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isChecked = isControlled ? checked! : internalChecked;

  const handleChange = () => {
    if (disabled) return;
    const next = !isChecked;

    if (!isControlled) {
      setInternalChecked(next);
    }

    onChange?.(next);
  };

  return (
    <label
      className={`checkbox ${disabled ? "checkbox--disabled" : ""} ${className}`}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        className="checkbox__input"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
      />

      <span
        className={
          "checkbox__box" + (isChecked ? " checkbox__box--checked" : "")
        }
      >
        <svg
          className="checkbox__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <polyline
            points="20 6 9 17 4 12"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {label && <span className="checkbox__label font-semibold">{label}</span>}
    </label>
  );
};
