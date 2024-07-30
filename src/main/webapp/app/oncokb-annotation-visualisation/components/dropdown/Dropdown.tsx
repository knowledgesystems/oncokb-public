import React, { useState, useRef } from 'react';
import './Dropdown.scss';

const Dropdown = ({ options, selectedOptions, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = option => {
    const newSelectedOptions = selectedOptions.includes(option.value)
      ? selectedOptions.filter(item => item !== option.value)
      : [...selectedOptions, option.value];

    onChange(newSelectedOptions.map(value => ({ value })));
  };

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <button onClick={handleToggle} className="btn full-width">
        Select Columns
      </button>
      {isOpen && (
        <div className="dropdown-menu show">
          {options.map(option => (
            <div key={option.value} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={option.value}
                checked={selectedOptions.includes(option.value)}
                onChange={() => handleCheckboxChange(option)}
              />
              <label className="form-check-label" htmlFor={option.value}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
