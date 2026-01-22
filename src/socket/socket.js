import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOCKET_API, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
});
