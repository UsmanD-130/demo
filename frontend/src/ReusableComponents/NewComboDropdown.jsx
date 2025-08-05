import React, { useEffect, useRef, useState } from "react";

const NewComboDropdown = ({
  label,
  //   data= [],
  placeholder = "",
  onChange,
  name,
  value,
  mode,
  isRequired,
  optionLabelKey,
  optionLabelValue,
}) => {
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  console.log(searchTerm, "searchTerm");
  const [showDropdown, setShowDropdown] = useState(false);
  const [clickedOutside, setClickedOutside] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const data = [
    { id: 1, fruit: "Apple", color: "red" },
    { id: 2, fruit: "Banana", color: "yellow" },
    { id: 3, fruit: "Mango", color: "orange" },
    { id: 4, fruit: "Watermelon", color: "green" },
  ];

  const columnsToShow = ["fruit", "color"];

  const filteredData = data.filter((row) =>
    row["fruit"].toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setClickedOutside(true);
        setShowDropdown(false);
      } else {
        setClickedOutside(false);
        setShowDropdown(true);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="w-[80] relative px-3 py-1 border-[1px] border-red-400 bg-red-300 ">
        <input
          ref={inputRef}
          type="text"
          name="name"
          id="name"
          value={searchTerm}
          className="text-white"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {showDropdown && (
          <div className="absolute w-full mx-auto max-h-[100px] overflow-y-auto ">
            <div>
              <table className="w-full border-2">
                <thead>
                  <tr className="border-2">
                    {columnsToShow.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <>
                        <tr>
                            <td colSpan={2} className="text-center">No results found</td>
                        </tr>
                    </>
                  ) : (
                    <>
                      {filteredData.map((row) => (
                        <>
                          <tr
                            key={row.id}
                            onMouseDown={() => {
                              console.log("clicked");
                              setSearchTerm(row.fruit);
                              setSelectedItem(row.fruit);
                              setShowDropdown(false);
                            }}
                            className="w-full py-2 bg-blue-200"
                          >
                            {columnsToShow.map((column) => (
                              <td key={column}>{row[column]}</td>
                            ))}
                          </tr>
                        </>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* <p>Clicked : {clickedOutside ? "outside" : "inside"}</p> */}
    </>
  );
};

export default NewComboDropdown;
