import { Outlet } from "react-router-dom";
import React from "react";
import Header from "../components/header";

const MissingPage: React.FC = () => {
  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default MissingPage;
