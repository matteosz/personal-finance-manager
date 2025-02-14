import * as FaIcons from "react-icons/fa";

export const SidebarData = [
  {
    title: "Current Net Worth",
    path: null,
    icon: <FaIcons.FaCoins />,
  },
  {
    title: "Home",
    path: "/home",
    icon: <FaIcons.FaHome />,
  },
  {
    title: "Expenses",
    path: "/expenses",
    icon: <FaIcons.FaCartPlus />,
  },
  {
    title: "Income",
    path: "/income",
    icon: <FaIcons.FaMoneyCheck />,
  },
  {
    title: "Assets",
    path: "/assets",
    icon: <FaIcons.FaMoneyBillWave />,
  },
  {
    title: "Exit",
    path: "/",
    icon: <FaIcons.FaDoorClosed />,
  },
];
