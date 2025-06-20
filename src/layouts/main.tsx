import { Outlet } from "react-router-dom";
import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

const Main: React.FC = () => {
  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
