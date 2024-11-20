import { BsBook } from "react-icons/bs";
import { GoHome } from "react-icons/go";
import { GrLogin } from "react-icons/gr";
import { LiaHandHoldingSolid } from "react-icons/lia";

export const NAV_LINKS = [
  {
    path: "/",
    label: "Trang chủ",
    icon: GoHome,
  },
  {
    path: "/book",
    label: "Quản lý sách",
    icon: BsBook,
  },
  {
    path: "/lib-log",
    label: "Quản vào thư viện",
    icon: GrLogin,
  },
  {
    path: "/borrow",
    label: "Quản lý mượn sách",
    icon: LiaHandHoldingSolid,
  },
];
