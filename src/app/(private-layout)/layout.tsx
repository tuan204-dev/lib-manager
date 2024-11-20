import AddBookModal from "@/components/AddBookModal";
import CheckInModal from "@/components/CheckInModal";
import CheckOutModal from "@/components/CheckOutModal";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex min-h-screen">
      <Sidebar />
      {children}
      <AddBookModal />
      <CheckInModal />
      <CheckOutModal />
    </main>
  );
};

export default Layout;
