import React from "react";
import Avatar from "../components/Avatar";
import { Link } from "react-router-dom";

export default function userCard({ user, btn }) {
  return (
    <Link
      onClick={() => btn(false)}
      to={"/" + user?._id}
      className="flex items-center gap-1 mt-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border-sky-500 rounded cursor-pointer ">
      <div className=" ">
        <Avatar
          width={50}
          height={50}
          name={user?.name}
          userId={user?._id}
          image={user?.profile_pic}
        />
      </div>
      <div className="">
        <div className=" font-semibold text-ellipsis line-clamp-1">
          {user?.name}
        </div>
        <p className=" text-sm text-ellipsis line-clamp-1">{user?.email}</p>
      </div>
    </Link>
  );
}
