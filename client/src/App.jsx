import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Authlayout from "./layout/Authlayout";
import CheckEmail from "./pages/CheckEmail";
import toast, { Toaster } from "react-hot-toast";
import CheckPassword from "./pages/CheckPassword";

export default function App() {
  return (
    <div>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path=":userId" element={<Home />} />

          <Route
            path="/register"
            element={
              <Authlayout>
                <Register />
              </Authlayout>
            }
          />
          <Route
            path="/email"
            element={
              <Authlayout>
                <CheckEmail />
              </Authlayout>
            }
          />
          <Route
            path="/password"
            element={
              <Authlayout>
                <CheckPassword />
              </Authlayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
