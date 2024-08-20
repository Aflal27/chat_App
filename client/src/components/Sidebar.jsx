import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import Avatar from "../components/Avatar";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from "./SearchUser";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa6";
import { logout } from "../../redux/userSlice";

export default function Sidebar() {
  const [editUser, setEditUser] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [searchUserBtn, setSearchUserBtn] = useState(false);
  const { socketConnection } = useSelector((state) => state.user);
  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user?._id);
      socketConnection.on("conversation", (data) => {
        console.log("conversation", data);
        const conversationUserData = data.map((converUser, index) => {
          if (converUser?.sender?._id === converUser?.receiver?._id) {
            return {
              ...converUser,
              userDetails: converUser?.sender,
            };
          } else if (converUser?.receiver?._id !== user?._id) {
            return {
              ...converUser,
              userDetails: converUser?.receiver,
            };
          } else {
            return {
              ...converUser,
              userDetails: converUser?.sender,
            };
          }
        });
        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);
  const handleLogOut = () => {
    dispatch(logout());
    navigate("/email");
    localStorage.clear();
  };
  return (
    <div className=" w-full h-full grid grid-cols-[48px,1fr] shadow-2xl ">
      <div className=" w-12 h-full bg-slate-100 rounded-tr-2xl py-5 text-slate-600 flex flex-col justify-between">
        <div className="">
          <NavLink
            title="chat"
            className={({ isActive }) =>
              ` w-12 h-12  flex items-center justify-center cursor-pointer hover:bg-slate-300 rounded ${
                isActive && " bg-slate-300"
              }  `
            }>
            <IoChatbubbleEllipses size={20} />
          </NavLink>
          <div
            title="user"
            className=" w-12 h-12  flex items-center justify-center cursor-pointer hover:bg-slate-300 rounded  ">
            <FaUserPlus onClick={() => setSearchUserBtn(true)} size={20} />
          </div>
        </div>
        <div className=" flex flex-col items-center">
          <button onClick={() => setEditUser(true)} title={user.name}>
            <Avatar
              image={user?.profile_pic}
              height={38}
              width={38}
              userId={user?._id}
            />
          </button>
          <button
            title="logout"
            className=" w-12 h-12  flex items-center justify-center cursor-pointer hover:bg-slate-300 rounded  ">
            <span>
              <CiLogout onClick={handleLogOut} size={20} />
            </span>
          </button>
        </div>
      </div>
      <div className=" w-full">
        <div className=" h-16">
          <h2 className=" text-xl text-slate-800 p-4 font-bold">Message</h2>
        </div>
        <hr />
        <div className=" h-[calc(100vh-64px)]  overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length === 0 && (
            <div className=" mt-16">
              <div className=" flex items-center justify-center text-slate-500 mb-2">
                <FiArrowUpLeft size={50} />
              </div>
              <p className=" text-lg text-center text-slate-400">
                Explore users to start a converstion with.
              </p>
            </div>
          )}

          {allUser.map((conv, index) => (
            <NavLink
              to={"/" + conv?.userDetails?._id}
              key={conv?._id}
              className=" flex items-center gap-2 py-3 px-2 border border-transparent hover:border-teal-500 cursor-pointer rounded hover:bg-slate-100">
              <div className="">
                <Avatar
                  image={conv?.userDetails?.profile_pic}
                  name={conv?.userDetails?.name}
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <p className=" line-clamp-1 text-ellipsis text-base font-semibold">
                  {conv?.userDetails?.name}
                </p>
                <div className=" text-xs text-slate-500 flex items-center gap-1">
                  <div className="">
                    {conv?.lastMsg?.imageUrl && (
                      <div className=" flex items-center gap-1">
                        <span>
                          <FaImage />
                        </span>
                        {!conv?.lastMsg?.text && <p>image</p>}
                      </div>
                    )}
                    {conv?.lastMsg?.videoUrl && (
                      <div className=" flex items-center gap-1">
                        <span>
                          <FaVideo />
                        </span>
                        {!conv?.lastMsg?.text && <p>video</p>}
                      </div>
                    )}
                  </div>
                  <p className=" text-ellipsis line-clamp-1">
                    {conv?.lastMsg?.text}
                  </p>
                </div>
              </div>
              {Boolean(conv?.unSeenMsg) && (
                <p className=" ml-auto text-xs w-5 h-5 bg-teal-400 text-white rounded-full p-1 flex items-center justify-center">
                  {conv?.unSeenMsg}
                </p>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="">
        {searchUserBtn && <SearchUser btn={setSearchUserBtn} />}
      </div>
      {editUser && <EditUserDetails data={user} setEditUser={setEditUser} />}
    </div>
  );
}
