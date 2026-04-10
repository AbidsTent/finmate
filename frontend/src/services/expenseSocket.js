import { io } from "socket.io-client";

let socket = null;

export function connectExpenseSocket(token) {
  if (!token) return null;

  if (!socket) {
    socket = io("http://localhost:8080", {
      auth: { token },
      transports: ["websocket"],
    });
  }

  return socket;
}

export function disconnectExpenseSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
