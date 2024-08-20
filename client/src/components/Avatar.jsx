import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Avatar({ name, image, width, height, userId }) {
  const onlineUser = useSelector((state) => state.user?.onlineUser);

  let avatarname = "";
  if (name) {
    const splitName = name?.split(" ");
    if (splitName.length > 1) {
      avatarname = splitName[0][0] + splitName[1][0];
    } else {
      avatarname = splitName[0][0];
    }
  }
  const bgColor = [
    "bg-slate-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-gray-200",
    "bg-cyan-200",
    "bg-sky-200",
    "bg-blue-200",
  ];
  const randomNumber = Math.floor(Math.random() * 9);
  const isOnline = onlineUser.includes(userId);
  return (
    <>
      <div
        style={{ width: width + "px", height: height + "px" }}
        className={` relative  rounded-full text-slate-800 bg-slate-400 flex items-center justify-center`}>
        {image ? (
          <img
            className=" overflow-hidden rounded-full w-full h-full object-cover"
            src={image}
            alt={name}
            width={width}
            height={height}
          />
        ) : name ? (
          <div
            className={` overflow-hidden w-full h-full flex items-center justify-center rounded-full  text-xl  ${bgColor[randomNumber]}`}>
            {avatarname}
          </div>
        ) : (
          <FaRegUserCircle size={width} />
        )}

        {isOnline && (
          <div className=" bg-green-600 p-1 absolute bottom-1 right-0 z-10 rounded"></div>
        )}
      </div>
    </>
  );
}
