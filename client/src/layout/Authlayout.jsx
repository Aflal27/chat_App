import React from "react";

export default function Authlayout({ children }) {
  return (
    <>
      <div className=" flex items-center justify-center h-20 py-3 bg-white shadow-md">
        <img
          src="https://logos-world.net/wp-content/uploads/2022/04/Google-Chat-Logo.png"
          alt="LOGO"
          width={100}
          height={100}
        />
      </div>
      {children}
    </>
  );
}
