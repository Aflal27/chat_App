import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa6";
import { uploadFileCloud } from "../helper/uploadFileCloud";
import { RxCross1 } from "react-icons/rx";
import { Spinner } from "flowbite-react";
import { IoMdSend } from "react-icons/io";
import moment from "moment";

export default function Message() {
  const { userId } = useParams();
  const { socketConnection } = useSelector((state) => state.user);
  const user = useSelector((state) => state?.user);
  const [uploadBtn, setUploadBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allMsg, setAllMsg] = useState([]);
  const currentMsg = useRef();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });

  useEffect(() => {
    if (currentMsg.current) {
      currentMsg.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [allMsg]);

  useEffect(() => {
    if (socketConnection) {
      if (userId) {
        socketConnection.emit("messagePage", userId);
      }

      socketConnection.emit("seen", userId);

      socketConnection.on("messageUser", (data) => {
        setUserData(data);
      });
      socketConnection.on("message", (data) => {
        setAllMsg(data);
      });
    }
  }, [socketConnection, userId, user]);
  const handleImage = async (e) => {
    setLoading(true);
    const file = e.target.files[0];

    const upload = await uploadFileCloud(file);
    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: upload?.url,
      };
    });
    setLoading(false);
    setUploadBtn(false);
  };
  const handleVideo = async (e) => {
    setLoading(true);
    const file = e.target.files[0];

    const upload = await uploadFileCloud(file);
    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: upload?.url,
      };
    });
    setLoading(false);
    setUploadBtn(false);
  };
  const handleText = (e) => {
    const { name, value } = e.target;
    setMessage((preve) => {
      return {
        ...preve,
        text: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.text || message.videoUrl || message.imageUrl) {
      if (socketConnection) {
        socketConnection.emit("newMessage", {
          sender: user?._id,
          receiver: userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        });
      }
      setMessage({
        text: "",
        videoUrl: "",
        imageUrl: "",
      });
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${"https://www.shutterstock.com/image-vector/social-media-sketch-vector-seamless-600nw-1660950727.jpg"})`,
      }}
      className=" bg-no-repeat bg-cover ">
      <header className=" sticky top-0 h-16 bg-white p-2  shadow-md flex items-center gap-2">
        <Link to="/" className=" cursor-pointer lg:hidden">
          <FaAngleLeft size={25} />
        </Link>
        <div className="flex items-center justify-between w-full">
          <div className=" flex items-center justify-center gap-2">
            <Avatar
              width={50}
              height={50}
              name={userData?.name}
              image={userData?.profile_pic}
              userId={userData?._id}
            />
            <div className="">
              <h3 className=" text-lg font-semibold my-0 text-ellipsis line-clamp-1">
                {userData?.name}
              </h3>
              <p className=" -my-2 text-xs">
                {userData?.online ? (
                  <span className=" text-green-600">Online</span>
                ) : (
                  <span className=" text-slate-400">Offline</span>
                )}
              </p>
            </div>
          </div>
          <div className=" cursor-pointer hover:text-teal-500 ">
            <HiOutlineDotsVertical size={22} />
          </div>
        </div>
      </header>
      {/* all messages */}
      <section className=" h-[calc(100vh-128px)]  overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50 ">
        {/* all message */}
        <div className=" flex flex-col gap-2 p-2" ref={currentMsg}>
          {allMsg.map((msg, index) => (
            <div
              className={`  p-1 py-1 rounded w-fit max-w-[200] md:max-w-sm lg:max-w-md ${
                user._id === msg.msgByUserId
                  ? "ml-auto bg-teal-200"
                  : "bg-white"
              }`}>
              <div className=" w-full">
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="image"
                    className=" w-full h-full object-scale-down"
                  />
                )}
              </div>
              <div className=" w-full">
                {msg.videoUrl && (
                  <video
                    controls
                    src={msg.videoUrl}
                    className=" w-full h-full object-scale-down"
                  />
                )}
              </div>
              <p className=" px-2">{msg.text}</p>
              <p className=" text-xs ml-auto w-fit">
                {moment(msg.createAt).format("hh:mm")}
              </p>
            </div>
          ))}
        </div>
        {/* display image */}
        {loading && (
          <div className=" sticky bottom-0 w-full h-full flex items-center justify-center">
            <Spinner />
          </div>
        )}
        {message.imageUrl && (
          <div className="  w-full sticky bottom-0 h-full bg-slate-700 bg-opacity-30  flex items-center justify-center rounded overflow-hidden">
            <div className=" w-fit p-5 absolute top-0 right-0">
              <RxCross1
                onClick={() => setMessage({ imageUrl: "" })}
                size={30}
                className=" text-white  cursor-pointer hover:bg-red-800"
              />
            </div>
            <div className=" bg-white p-3">
              <img
                src={message?.imageUrl}
                alt="uploadImage"
                height={300}
                width={300}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}
        {/* display video */}
        {message.videoUrl && (
          <div className=" w-full h-full sticky bottom-0 bg-slate-700 opacity-30 flex items-center justify-center rounded overflow-hidden">
            <div className=" w-fit p-5 absolute top-0 right-0">
              <RxCross1
                onClick={() => setMessage({ videoUrl: "" })}
                size={30}
                className=" text-white  cursor-pointer hover:bg-red-800 object-scale-down"
              />
            </div>
            <div className=" bg-white p-3">
              <video
                src={message?.videoUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay></video>
            </div>
          </div>
        )}
      </section>
      <section className=" h-16 bg-white flex items-center ">
        <div className=" relative">
          <button
            onClick={() => setUploadBtn(!uploadBtn)}
            className=" w-11 h-11 flex items-center justify-center hover:bg-teal-500 rounded-full  hover:text-white ">
            <FaPlus size={20} />
          </button>

          {/* video and image */}
          {uploadBtn && (
            <form className=" bg-white shadow rounded absolute bottom-12 left-3 w-36 p-2 flex flex-col gap-2">
              <label
                htmlFor="uploadImage"
                className=" flex items-center gap-2 hover:bg-slate-200 p-2 cursor-pointer">
                <button>
                  <FaImage size={18} className=" text-teal-500" />
                </button>
                <p>Image</p>
                <input
                  className=" hidden"
                  type="file"
                  id="uploadImage"
                  onChange={handleImage}
                />
              </label>
              <label
                htmlFor="uploadVideo"
                className=" flex items-center gap-2 hover:bg-slate-200 p-2 cursor-pointer">
                <button>
                  <FaVideo size={18} className=" text-purple-500" />
                </button>
                <p>Video</p>
                <input
                  className=" hidden"
                  type="file"
                  id="uploadVideo"
                  onChange={handleVideo}
                />
              </label>
            </form>
          )}
        </div>
        {/* input box */}
        <form
          onSubmit={handleSubmit}
          className=" w-full h-full flex items-center gap-2">
          <input
            type="text"
            placeholder="Type here message..."
            onChange={handleText}
            value={message?.text}
            className=" px-4 py-1 w-full h-full outline-none border-none"
          />
          <button className=" p-3 text-teal-400 hover:text-teal-700">
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
}
