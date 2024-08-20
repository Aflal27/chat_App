import React, { useState } from "react";
import { Button, TextInput, Label, Spinner } from "flowbite-react";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import toast from "react-hot-toast";
import { FaRegUserCircle } from "react-icons/fa";

export default function CheckEmail() {
  const [userData, setUserData] = useState({
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/user/checkEmail", userData);
      toast.success(data.message);
      setLoading(false);
      if (data) {
        setUserData({
          email: "",
        });
        navigate("/password", {
          state: data,
        });
      }
    } catch (error) {
      console.log("registerError", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className=" mt-5">
      <div className=" bg-white max-w-sm rounded overflow-hidden p-4 mx-auto">
        <div>
          <FaRegUserCircle size={70} className=" w-full mx-auto mb-2" />
        </div>
        <h3 className=" text-slate-500 mb-3">Welcome to Chat app!</h3>
        <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label value="Your emaiil" />
            <TextInput
              type="email"
              placeholder="name@gmail.com"
              id="email"
              name="email"
              onChange={handleOnChange}
              required
            />
          </div>

          {loading ? (
            <Spinner className=" w-full" />
          ) : (
            <Button
              type="submit"
              gradientDuoTone="cyanToBlue"
              className=" w-full mt-4 tracking-wide">
              Lets Go
            </Button>
          )}
        </form>
        <p className=" text-center mt-2 flex gap-2 justify-center">
          New User?
          <Link
            className=" text-blue-600 font-bold hover:text-blue-800"
            to={"/register"}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
