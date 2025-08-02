import { useState } from "react";

const ComboDropdown = ({ label, name, value, onChange, options = [] }) => {
  const [error, setError] = useState("");

  const validate = (name, value) => {
    switch (value) {
      case "apple":
        return "Apple is selected";
      case "banana":
        return "Banana is selected";
      case "mango":
        return "Mango is selected";
    }

    return "";
  };

  const handleChange = (e) => {
    const validationError  = validate(name, e.target.value);
    setError(validationError)
    onChange(e.target.value); // Parent doesn't need to extract .target.value anymore
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={name}>{label}</label>}
      <select
        name={name}
        id={name}
        onChange={handleChange}
        value={value}
        className="outline-2 rounded-xl px-2 py-1 outline-red-400"
      >
        <option value="">---Select---</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

export default ComboDropdown;
