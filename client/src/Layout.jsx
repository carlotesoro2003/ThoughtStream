import Header from "./components/Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      {/* Header Section */}
      <Header />
      
      {/* Nested Route Content */}
      <main className="">
        <Outlet />
      </main>
    </>
  );
}
