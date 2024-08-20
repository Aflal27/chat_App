import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import SearchUserCard from "./SearchUserCard";
import toast from "react-hot-toast";
import axios from "axios";
import { Spinner } from "flowbite-react";
import { IoMdCloseCircle } from "react-icons/io";

export default function SearchUser({ btn }) {
  const [searchUser, setSearchUser] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(search);
  const handleSearch = async () => {
    try {
      const { data } = await axios.post("/api/user/search", {
        search: search,
      });
      setSearchUser(data.data);
      console.log(data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    handleSearch();
  }, [search]);
  return (
    <div className=" fixed left-0 right-0 bottom-0 top-0 bg-slate-700 bg-opacity-40 p-2 z-10">
      <div className=" w-full max-w-lg mx-auto mt-10 ">
        <div className=" bg-white rounded h-14 flex ">
          <input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            type="text"
            placeholder="Search user by name, email..... "
            className=" outline-none w-full  py-1 px-4 h-full border-none rounded "
          />
          <div className=" flex items-center justify-center mr-3">
            <IoSearchOutline size={25} />
          </div>
        </div>
        {/* display users */}
        <div className=" w-full mt-2 p-4 rounded bg-white">
          {searchUser.length === 0 && (
            <p className=" text-center text-slate-400">no user found!</p>
          )}
          {loading && <Spinner />}
          {searchUser.length !== 0 &&
            searchUser.map((user, index) => (
              <SearchUserCard btn={btn} key={user?._id} user={user} />
            ))}
        </div>
        <div className=" absolute top-0 right-0">
          <button>
            <IoMdCloseCircle
              className=" hover:text-red-500 text-5xl p-2"
              onClick={() => btn(false)}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
