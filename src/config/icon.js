import { RiHome2Line, RiLayout5Line, RiPaletteLine } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";
import { PiCirclesFour } from "react-icons/pi";

export const AddIcon = (iconName) => {
  switch (iconName) {
    case "plus":
      return <FiPlus />;
    case "home":
      return <RiHome2Line />;
    case "fourCircles":
      return <PiCirclesFour />;
    case "layout":
      return <RiLayout5Line />;
    case "palette":
      return <RiPaletteLine />;

    default:
      return;
  }
};
