import React, { useState } from "react";
import { Button, Spinner, TextInput } from "flowbite-react";
import Avatar from "./Avatar";
import { uploadFileCloud } from "../helper/uploadFileCloud";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";

export default function EditUserDetails({ data, setEditUser }) {
  const [userData, setUserData] = useState({
    name: data?.name,
    profile_pic: data?.profile_pic,
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const uploadFilePhoto = async (e) => {
    setLoading(true);
    const file = e.target.files[0];

    const upload = await uploadFileCloud(file);
    console.log(upload);
    setUserData((preve) => {
      return {
        ...preve,
        profile_pic: upload?.url,
      };
    });
    setLoading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/update", userData);
      console.log(data);
      toast.success(data?.message);
      if (data) {
        dispatch(setUser(data?.data));
      }
      setEditUser(false);
    } catch (error) {
      console.log("updateUserError", error);
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div>
      <div className=" fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
        <div className=" bg-white max-w-sm w-full p-4 rounded">
          <h2 className=" font-semibold ">Profile Details</h2>
          <p className=" text-sm">Edit user details</p>

          <form onSubmit={handleSubmit} className=" mt-3" action="">
            <label className=" " htmlFor="">
              Name:
              <TextInput
                name="name"
                value={userData?.name}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="file" className=" flex flex-col gap-2">
              Photo:
              {loading ? (
                <Spinner />
              ) : (
                <div className="flex items-center gap-3">
                  <Avatar
                    width={40}
                    height={40}
                    name={data?.name}
                    image={userData?.profile_pic}
                  />
                  <p type="button">change photo</p>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className=" hidden"
                    onChange={uploadFilePhoto}
                  />
                </div>
              )}
            </label>
            <div className=" flex items-center gap-3">
              <Button
                onClick={() => setEditUser(false)}
                outline
                gradientDuoTone="cyanToBlue"
                className=" w-full mt-4 tracking-wide">
                Cancel
              </Button>
              <Button
                type="submit"
                gradientDuoTone="cyanToBlue"
                className=" w-full mt-4 tracking-wide">
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
