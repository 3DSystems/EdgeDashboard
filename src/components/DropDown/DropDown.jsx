import React, { useState, useRef, useEffect } from "react";
import "./DropDown.css";

const DropDown = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const dropdownRef = useRef(null);

  // Toggle dropdown open/close
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Handle checkbox change
  const handleSelect = (value) => {
    setSelected((prev) => {
      const valueAlreadyExists = prev.includes(value)
      return valueAlreadyExists ? prev.filter((v) => v !== value) : [...prev, value]
      // if(value === "All") {
      //   return valueAlreadyExists ? [] : [value, ...options]
      // } else if(valueAlreadyExists) {
      //   return prev.includes("All") 
      //     ? prev.filter((v) => v !== value && v !== "All") 
      //     : prev.filter((v) => v !== value);
      // } else {
      //   const newSelectedOptions = [value, ...prev]
      //   return options.length === newSelectedOptions.length ? ["All", ...options] : newSelectedOptions;
      // }
    }
    );
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Display selected values
  const displayText =
    selected.length > 0 ? selected.join(", ") : "Filter by technology";

  // const optionToShow = hasSelectAllOption ? ["All", ...options] : options;

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        <span className={selected.length === 0 ? "placeholder" : ""}>
          {displayText}
        </span>
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <label key={option} className="dropdown-item">
              <input
                type="checkbox"
                value={option}
                checked={selected.includes(option)}
                onChange={() => handleSelect(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;
