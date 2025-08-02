import React, { useState } from "react";
import ComboDropdown from "../ReusableComponents/ComboDropdown";

const Dropdowns = () => {
  const [selectedItem, setSelectedItem] = useState("");

  const handleSelect = (value) => {
    console.log(value);
    setSelectedItem(value);
  };

  const fruits = ["apple","banana","mango"]
  return (
    <>
      <div>Dropdowns</div>

      <p>----- normal dropdown</p>

      <div className="flex flex-col justify-center gap-4"> 
        <div>
          <label htmlFor="fruits"></label>
          <select
            name="fruits"
            id="fruits"
            className="outline-2 rounded-xl px-2 py-1"
            onChange={(e) => handleSelect(e.target.value)}
            value={selectedItem}
          >
            <option value="">---Select fruit</option>
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="mango">Mango</option>
          </select>
        </div>
        <div>
            <ComboDropdown label="Select fruit" name="fruits" id="fruits" options={fruits} value={selectedItem} onChange={handleSelect} />
        </div>
      </div>
    </>
  );
};

export default Dropdowns;
