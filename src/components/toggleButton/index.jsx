// import React, { useState } from "react";

// const ToggleButton = () => {
//   const [active, setActive] = useState("create");

//   return (
//     <div className="flex bg-disable_2 rounded-full p-1 w-fit cursor-pointer font-manrope">
//       <button
//         onClick={() => setActive("create")}
//         className={`px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
//           active === "create"
//             ? "bg-black text-white shadow"
//             : "text-black hover:text-gray-700"
//         }`}
//       >
//         Create new
//       </button>

//       <button
//         onClick={() => setActive("view")}
//         className={`px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
//           active === "view"
//             ? "bg-black text-white shadow"
//             : "text-black hover:text-gray-700"
//         }`}
//       >
//         View all
//       </button>
//     </div>
//   );
// };

// export default ToggleButton;

import React, { useState } from "react";

const ToggleButton = ({
  options = ["Create new", "View all"],
  defaultActive = 0,
  activeColor = "bg-black text-white shadow",
  inactiveColor = "text-black hover:text-hover",
  onChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultActive);

  const handleClick = (index) => {
    setActiveIndex(index);
    if (onChange) onChange(options[index]);
  };

  return (
    <div className="flex bg-disable_2 rounded-full p-1 w-fit cursor-pointer font-manrope">
      {options.map((label, index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          className={`px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
            activeIndex === index ? activeColor : inactiveColor
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ToggleButton;
