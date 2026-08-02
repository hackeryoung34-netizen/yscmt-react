import { ReactNode } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/admin.css";

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="admin-container">
      <Sidebar />

      <div className="admin-main">
        <Header />

        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
