import React, { useEffect, useState } from "react";
import { Button, TextInput, Label, Spinner } from "flowbite-react";
import { IoMdCloseCircle } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { setToken, setUser } from "../../redux/userSlice";

export default function CheckPassword() {
  const [userData, setUserData] = useState({
    password: "",
    userId: "",
  });

  const [registerLoading, setRegisterLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location?.state?.data?._id) {
      setUserData((preve) => {
        return {
          ...preve,
          userId: location?.state?.data?._id,
        };
      });
    }
  }, [location]);

  useEffect(() => {
    if (!location?.state?.data?.name) {
      navigate("/email");
    }
  }, []);

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
    setRegisterLoading(true);
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/checkPassword", userData);
      toast.success(data?.message);
      setRegisterLoading(false);
      console.log(data);

      if (data) {
        setUserData({
          password: "",
        });
        dispatch(setToken(data?.token));
        localStorage.setItem("token", data?.token);
        navigate("/");  
      }
    } catch (error) {
      console.log("registerError", error);
      setRegisterLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className=" mt-5">
      <div className=" bg-white max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className=" flex flex-col items-center justify-center">
          <div className=" max-w-md  flex items-center justify-center">
            <Avatar
              width={70}
              name={location?.state?.data?.name}
              height={70}
              image={location?.state?.data?.profile_pic}
            />
          </div>
          <p className=" text-lg font-semibold mt-1">
            {location?.state?.data?.name}
          </p>
        </div>
        <h3 className=" text-slate-500 mb-3">Welcome to Chat app!</h3>
        <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label value="Your password" />
            <TextInput
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              onChange={handleOnChange}
              required
            />
          </div>

          {registerLoading ? (
            <Spinner className=" w-full" />
          ) : (
            <Button
              type="submit"
              gradientDuoTone="cyanToBlue"
              className=" w-full mt-4 tracking-wide">
              Login
            </Button>
          )}
        </form>
        <p className=" text-center mt-2 flex gap-2 justify-center">
          <Link className="  font-bold hover:text-blue-800" to={"/register"}>
            Forget password?
          </Link>
        </p>
      </div>
    </div>
  );
}
