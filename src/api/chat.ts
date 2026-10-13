// import { request, getCSRF } from "./auth";
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const BASE_URL = "https://961a-150-129-146-122.ngrok-free.app/chat";

// // GET ROOMS
// export const getRooms = async () => {
//   return request(`${BASE_URL}/`, {
//     method: "GET",
//   });
// };

// // CREATE ROOM
// export const createRoom = async (data: any) => {
//   await getCSRF(); // ✅ REQUIRED for POST

//   return request(`${BASE_URL}/create/`, {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// };

// // GET SINGLE ROOM
// export const getRoom = async (id: number) => {
//   return request(`${BASE_URL}/${id}/`, {
//     method: "GET",
//   });
// };

//  // ADD MEMBERS
// export const addUsersToRoom = async (roomId: number, members: number[]) => {
//   await getCSRF();

//   return request(`${BASE_URL}/add-user/${roomId}/`, {
//     method: "POST",
//     body: JSON.stringify({ members }),
//   });
// };

// // UPDATE ROOM
// export const updateRoom = async (roomId: number, data: any) => {
//   await getCSRF();

//   return request(`${BASE_URL}/update/${roomId}/`, {
//     method: "PATCH",
//     body: JSON.stringify(data),
//   });
// };

// // DELETE ROOM
// export const deleteRoom = async (roomId: number) => {
//   await getCSRF();

//   return request(`${BASE_URL}/delete/${roomId}/`, {
//     method: "DELETE",
//   });
// };

import { request } from "./auth";

const BASE_URL = "/chat";

// GET ROOMS
export const getRooms = async () => {
  return request(`${BASE_URL}/`, {
    method: "GET",
  });
};

// CREATE ROOM
export const createRoom = async (data: any) => {
  return request(`${BASE_URL}/create/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// GET SINGLE ROOM
export const getRoom = async (id: number) => {
  return request(`${BASE_URL}/${id}/`, {
    method: "GET",
  });
};

// ADD MEMBERS
export const addUsersToRoom = async (
  roomId: number,
  members: number[]
) => {
  return request(`${BASE_URL}/add-user/${roomId}/`, {
    method: "POST",
    body: JSON.stringify({ members }),
  });
};

// UPDATE ROOM
export const updateRoom = async (roomId: number, data: any) => {
  return request(`${BASE_URL}/update/${roomId}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// DELETE ROOM
export const deleteRoom = async (roomId: number) => {
  return request(`${BASE_URL}/delete/${roomId}/`, {
    method: "DELETE",
  });
};
