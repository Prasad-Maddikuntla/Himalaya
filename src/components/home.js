import React from "react";
import logo from '../images/hlogo.png'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate();

  return (
    <div className="home">
      <h1 className="title">HIMALAYA HOSTELS</h1>
      <img
        className="logo"
        alt="logo"
        src={logo}
      />
      <button className="login" onClick={()=>{navigate('/blocks')}}>
        LOGIN
      </button>
    </div>
  );
};
export default Home;
