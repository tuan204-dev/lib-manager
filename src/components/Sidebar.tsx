"use client";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/localStorage";
import cn from "@/utils/cn";
import useModal from "antd/es/modal/useModal";
import { deleteCookie } from "cookies-next/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BsBook } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { GoHome } from "react-icons/go";
import { GrLogin } from "react-icons/gr";
import { LiaHandHoldingSolid } from "react-icons/lia";

const NAV_LINKS = [
  {
    path: "/",
    label: "Trang chủ",
    icon: <GoHome className="text-3xl" />,
  },
  {
    path: "/books",
    label: "Quản lý sách",
    icon: <BsBook className="text-2xl" />,
  },
  {
    path: "/lib-log",
    label: "Quản lý vào thư viện",
    icon: <GrLogin className="text-[26px]" />,
  },
  {
    path: "/borrow",
    label: "Quản lý mượn trả sách",
    icon: <LiaHandHoldingSolid className="text-[32px]" />,
  },
  // {
  //   path: "/settings",
  //   label: "Cài đặt",
  //   icon: <LuSettings className="text-[30px]" />,
  // },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [modal, contextHolder] = useModal();

  const handleLogout = () => {
    deleteCookie(ACCESS_TOKEN);
    deleteCookie(REFRESH_TOKEN);
    router.push("/login");
  };

  const confirmLogout = () =>
    modal.confirm({
      title: <span>Đăng xuất</span>,
      content: "Bạn có chắc chắn muốn đăng xuất không?",
      okText: "Đăng xuất",
      cancelText: "Huỷ",
      onOk: handleLogout,
    });

  return (
    <aside className="w-[315px] bg-white py-5 px-4 flex flex-col gap-y-10 border-r border-[#d7d7d7]">
      <div className="flex items-center gap-x-6">
        <Image
          alt="Ptit Logo"
          src={"/img/ptit.png"}
          width={50}
          height={50}
          className="object-contain"
        />

        <h1 className="text-[26px] font-semibold text-[#151D48]">
          Thư viện PTIT
        </h1>
      </div>

      <div className="flex flex-col gap-y-5">
        {NAV_LINKS.map((link) => (
          <Link
            href={link.path}
            key={link.path}
            className={cn(
              "py-[14px] px-5 rounded-2xl grid gap-x-4 items-center grid-cols-[30px,1fr] text-[#737791]",
              {
                "bg-[#5D5FEF] text-white": pathname === link.path,
              },
            )}
          >
            {link.icon}
            <span className="text-start text-lg font-semibold whitespace-nowrap">
              {link.label}
            </span>
          </Link>
        ))}

        <button
          className={cn(
            "py-[14px] px-5 rounded-2xl grid gap-x-4 items-center grid-cols-[30px,1fr] text-[#737791]",
          )}
          onClick={confirmLogout}
        >
          <CiLogout className="text-3xl" />
          <span className="text-start text-lg font-semibold whitespace-nowrap">
            Đăng xuất
          </span>
        </button>
      </div>
      {contextHolder}
    </aside>
  );
};

export default Sidebar;
