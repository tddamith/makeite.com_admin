import {
  RiHome2Line,
  RiLayout5Line,
  RiPaletteLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import { FiPlus, FiX } from "react-icons/fi";
import { PiCirclesFour } from "react-icons/pi";
import { TbFolderMinus } from "react-icons/tb";
import { FaArrowLeftLong } from "react-icons/fa6";

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
    case "cross":
      return <FiX />;
    case "bin":
      return <RiDeleteBinLine />;
    case "folder":
      return <TbFolderMinus />;
    case "arrow-left":
      return <FaArrowLeftLong />;

    default:
      return;
  }
};
