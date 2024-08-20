import React, { useState } from "react";
import { Button, TextInput, Label, Spinner } from "flowbite-react";
import { IoMdCloseCircle } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { uploadFileCloud } from "../helper/uploadFileCloud";
import axios from "axios";
import toast from "react-hot-toast";

export default function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const [uploadFile, setUploadFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const navigate = useNavigate();

  const uploadFilePhoto = async (e) => {
    setLoading(true);
    const file = e.target.files[0];

    const upload = await uploadFileCloud(file);
    setUploadFile(file);
    setUserData((preve) => {
      return {
        ...preve,
        profile_pic: upload?.url,
      };
    });
    setLoading(false);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const handleCloseBtn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadFile("");
  };
  const handleSubmit = async (e) => {
    setRegisterLoading(true);
    e.preventDefault();
    e.stopPropagation();
    try {
      const { data } = await axios.post("/api/user/register", userData);
      toast.success(data.message);
      setRegisterLoading(false);
      if (data) {
        setUserData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        });
        navigate("/email");
      }
    } catch (error) {
      console.log("registerError", error);
      setRegisterLoading(false);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className=" mt-5">
      <div className=" bg-white max-w-sm rounded overflow-hidden p-4 mx-auto">
        <h3 className=" text-slate-500 mb-3">Welcome to Chat app!</h3>
        <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label value="Your username" />
            <TextInput
              type="text"
              placeholder="Username"
              id="username"
              name="name"
              onChange={handleOnChange}
              required
            />
          </div>
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
          <div className="">
            <label htmlFor="file">
              <Label value="Photo" />
              <p className=" bg-slate-100 p-4 text-center text-sm font-semibold hover:cursor-pointer flex items-center justify-center gap-3 max-w-sm text-ellipsis line-clamp-1">
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    {uploadFile?.name
                      ? uploadFile.name
                      : "Upload profile photo"}
                  </>
                )}
                {uploadFile?.name && (
                  <button onClick={handleCloseBtn}>
                    <IoMdCloseCircle
                      size={22}
                      className=" hover:text-red-600"
                    />
                  </button>
                )}
              </p>
            </label>
            <TextInput
              type="file"
              placeholder="Password"
              id="file"
              name="file"
              className=" hidden"
              onChange={uploadFilePhoto}
            />
          </div>
          {registerLoading ? (
            <Spinner className=" w-full" />
          ) : (
            <Button
              type="submit"
              gradientDuoTone="cyanToBlue"
              className=" w-full mt-4 tracking-wide">
              Register
            </Button>
          )}
        </form>
        <p className=" text-center mt-2 flex gap-2 justify-center">
          Already have account?
          <Link
            className=" text-blue-600 font-bold hover:text-blue-800"
            to={"/email"}>
            LogIn
          </Link>
        </p>
      </div>
    </div>
  );
}
