import React, { useEffect, useState } from "react";

const ReuseableInput = ({ label, name, type, value, onChange }) => {
  const [error, setError] = useState("");

  const validate = (name, value) => {
    switch (name) {
      case "name":
        if (value !== "usman") {
          return "name should be usman";
        }
        break;
      case "password":
        if (value.length < 6) {
          return "password should be atleast 6 characters long";
        }

      default:
        break;
    }
    return ""
  };

  const handleChange = (e) => {
    const validatationError = validate(name, e.target.value);
    setError(validatationError);

    onChange(e);
  };
  return (
    <div>
      <label htmlFor={name}>{label} : </label>
      <input
        type={type}
        name={name}
        onChange={handleChange}
        value={value}
        placeholder={name === "name" ? "Enter your name" : ""}
        className="outline-2 outline-blue focus:outline-green-400 px-2 py-1 rounded-2xl"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

export default ReuseableInput;
