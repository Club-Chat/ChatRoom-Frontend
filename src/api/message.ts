// import { request, getCSRF } from "./auth";
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const BASE_URL = "https://961a-150-129-146-122.ngrok-free.app/messages";

// // GET MESSAGES
// export const getMessages = async (roomId: number) => {
//   return request(`${BASE_URL}/room/${roomId}/`, {
//     method: "GET",
//   });
// };

// // SEND MESSAGE
// export const sendMessage = async (data: {
//   room: number;
//   content: string;
// }) => {
//   await getCSRF(); // ✅ REQUIRED

//   return request(`${BASE_URL}/send/`, {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// };

// // MARK AS READ
// export const markAsRead = async (messageId: number) => {
//   await getCSRF(); // ✅ REQUIRED

//   return request(`${BASE_URL}/read/${messageId}/`, {
//     method: "POST",
//   });
// };

import { request } from "./auth";

const BASE_URL = "/messages";

// GET MESSAGES
export const getMessages = async (roomId: number) => {
  return request(`${BASE_URL}/room/${roomId}/`, {
    method: "GET",
  });
};

// SEND MESSAGE
export const sendMessage = async (data: {
  room: number;
  content: string;
}) => {
  return request(`${BASE_URL}/send/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// MARK AS READ
export const markAsRead = async (messageId: number) => {
  return request(`${BASE_URL}/read/${messageId}/`, {
    method: "POST",
  });
};