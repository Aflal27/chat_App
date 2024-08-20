import axios from "axios";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from "../../redux/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Message from "../components/Message";
import io from "socket.io-client";

export default function Home() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const baseUrl = location.pathname === "/";

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/user/user-details", {
        withCredentials: true,
      });
      dispatch(setUser(res.data.data));
      if (res.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
    } catch (error) {
      console.log("userData", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // socket
  useEffect(() => {
    const socketConnection = io("http://localhost:3000", {
      auth: {
        token: localStorage.getItem("token"),
      },
    });
    socketConnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data));
    });
    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <div className=" grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={` bg-white ${!baseUrl && " hidden"} lg:block`}>
        <Sidebar />
      </section>
      <section className={`${baseUrl && " hidden"}`}>
        <Message />
      </section>
      <div
        className={`hidden lg:flex items-center justify-center ${
          !baseUrl ? "hidden" : " lg:flex"
        }`}>
        <div className={`flex flex-col items-center ${!baseUrl && " hidden"}`}>
          <img
            src="https://logos-world.net/wp-content/uploads/2022/04/Google-Chat-Logo.png"
            alt="LOGO"
            width={300}
            height={300}
          />
          <p className=" text-slate-500 text-lg ">
            Select user to send message
          </p>
        </div>
      </div>
    </div>
  );
}
