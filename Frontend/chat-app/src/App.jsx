import React, { useState } from "react";
import "./App.css";
import ChatPage from "./pages/chatPage";
import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Home />
      </>
    ),
  },
  {
    path: "/chat",
    element: (
      <>
        <ChatPage />
      </>
    ),
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
