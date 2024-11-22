import AddBookModal from "@/components/AddBookModal";
import BorrowBookModal from "@/components/BorrowBookModal";
import CheckInModal from "@/components/CheckInModal";
import CheckOutModal from "@/components/CheckOutModal";
import EditBookModal from "@/components/EditBookModal";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <main className="min-h-screen grid grid-cols-[315px,1fr]">
        <Sidebar />
        <div className="relative">
          <div className="absolute top-0 left-0 bottom-0 right-0 overflow-hidden overflow-y-auto">
            {children}
          </div>
        </div>
      </main>
      <AddBookModal />
      <EditBookModal />
      <CheckInModal />
      <CheckOutModal />
      <BorrowBookModal />
    </>
  );
};

export default Layout;
