import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/Register";
import CheckEmail from "../pages/CheckEmail";
import CheckPassword from "../pages/CheckPassword";
import Home from "../pages/Home";
import Message from "../components/Message";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "email",
        element: <CheckEmail />,
      },
      {
        path: "password",
        element: <CheckPassword />,
      },
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: "userId",
            element: <Message />,
          },
        ],
      },
    ],
  },
]);
