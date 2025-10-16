import { FiShoppingBag } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";

export const links = [
  {
    title: "Profile",
    links: [
      {
        name: "profiles",
        icon: <IoHomeOutline />,
      },
      {
        name: "orders",
        icon: <CiHeart />
      },
      {
        name: "favorites",
        icon: <FiShoppingBag />,
      },

     
    ],
  },
];
