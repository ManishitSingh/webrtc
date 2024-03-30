import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./context/SocketProvider.jsx";
import { PeerProvider } from "./context/Peer.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider>
      <PeerProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </PeerProvider>
    </SocketProvider>
  </React.StrictMode>
);
