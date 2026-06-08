import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./redux/store";
// Change: Import SocketProvider and ToastContainer to manage WebSocket state and show alert overlays
import { SocketProvider } from "./context/SocketContext";
import ToastContainer from "./components/ToastContainer";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* Change: Wrapped inside SocketProvider to enable notification event triggers */}
      <SocketProvider>
        <BrowserRouter>
          <App />
          {/* Change: Render the global floating toast container */}
          <ToastContainer />
        </BrowserRouter>
      </SocketProvider>
    </Provider>
  </React.StrictMode>
);