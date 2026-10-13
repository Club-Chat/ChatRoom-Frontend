// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const BASE_URL = "https://a30e-150-129-146-122.ngrok-free.app/users";

// function getCSRFToken() {
//   return document.cookie
//     .split("; ")
//     .find((row) => row.startsWith("csrftoken="))
//     ?.split("=")[1];
// }

// // ✅ Fetch CSRF cookie first
// const getCSRF = async () => {
//   await fetch(`${BASE_URL}/csrf/`, {
//     method: "GET",
//     credentials: "include",
//   });
// };

// async function request(url: string, options: RequestInit = {}) {
//   const csrfToken = getCSRFToken();

//   const res = await fetch(url, {
//     ...options,
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       ...(csrfToken && { "X-CSRFToken": csrfToken }), // ✅ only send if exists
//       ...(options.headers || {}),
//     },
//   });

//   const data = await res.json().catch(() => null);

//   if (!res.ok) {
//     throw data || new Error("Request failed");
//   }

//   return data;
// }


// // REGISTER
// export const registerUser = async (data: {
//   email: string;
//   username: string;
//   password: string;
// }) => {
//   await getCSRF(); // ✅ ensure token exists
//   return request(`${BASE_URL}/register/`, {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// };

// // LOGIN
// export const loginUser = async (data: {
//   email: string;
//   password: string;
// }) => {
//   await getCSRF(); // ✅ VERY IMPORTANT
//   return request(`${BASE_URL}/login/`, {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// };

// // FORGOT PASSWORD
// export const forgotPassword = async (data: { email: string }) => {
//   await getCSRF();
//   return request(`${BASE_URL}/forgot-password/`, {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// };

// // RESET PASSWORD
// export const resetPassword = async (data: {
//   uid: string;
//   token: string;
//   password: string;
// }) => {
//   await getCSRF();
//   return request(`${BASE_URL}/reset-password/`, {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// };

// // LOGOUT
// export const logoutUser = async () => {
//   return request(`${BASE_URL}/logout/`, {
//     method: "POST",
//   });
// };

// // PROFILE
// export const getProfile = () => {
//   return request(`${BASE_URL}/profile/`, {
//     method: "GET",
//   });
// };

// // UPDATE PROFILE
// export const updateProfile = async (data: {
//   first_name: string;
//   last_name: string;
//   username: string;
//   status: string;
//   avatar?: string;
// }) => {
//   await getCSRF();
//   return request(`${BASE_URL}/update-profile/`, {
//     method: "PATCH",
//     body: JSON.stringify(data),
//   });
// };

// // UPDATE PASSWORD
// export const updatePassword = async (data: {
//   old_password: string;
//   new_password: string;
// }) => {
//   await getCSRF();
//   return request(`${BASE_URL}/update-password/`, {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// };

// // USER SEARCH
// export const searchUsers = async (query: string) => {
//   return request(`${BASE_URL}/users?q=${query}&page=1&limit=5`, {
//     method: "GET",
//   });
// };

// export { request, getCSRF };           


export const API_BASE = "https://2526-150-129-146-122.ngrok-free.app";

let csrfToken = "";

// Fetch CSRF token + cookie
export const getCSRF = async () => {
  const res = await fetch(`${API_BASE}/users/csrf/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch CSRF token");
  }

  const data = await res.json();

  csrfToken = data.csrfToken;

  return data;
};

export async function request(
  endpoint: string,
  options: RequestInit = {}
) {
  // Ensure CSRF token exists
  if (!csrfToken) {
    await getCSRF();
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
      "ngrok-skip-browser-warning": "true",
      ...(options.headers || {}),
    },
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    data = await res.text().catch(() => null);
  }

  // If CSRF expired, refresh once and retry
  if (res.status === 403) {
    await getCSRF();

    const retryRes = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
        "ngrok-skip-browser-warning": "true",
        ...(options.headers || {}),
      },
    });

    data = await retryRes.json().catch(() => null);

    if (!retryRes.ok) {
      console.error("Request Error:", data);
      throw data || new Error("Request failed");
    }

    return data;
  }

  if (!res.ok) {
    console.error("Request Error:", data);
    throw data || new Error("Request failed");
  }

  return data;
}

// REGISTER
export const registerUser = async (data: {
  email: string;
  username: string;
  password: string;
}) => {
  return request("/users/register/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// LOGIN
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  return request("/users/login/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
// FORGOT PASSWORD
export const forgotPassword = async (data: { email: string }) => {
  return request("/users/forgot-password/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// RESET PASSWORD
export const resetPassword = async (data: {
  uid: string;
  token: string;
  password: string;
}) => {
  return request("/users/reset-password/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// LOGOUT
export const logoutUser = async () => {
  return request("/users/logout/", {
    method: "POST",
  });
};

// PROFILE
export const getProfile = () => {
  return request("/users/profile/", {
    method: "GET",
  });
};

// UPDATE PROFILE
export const updateProfile = async (data: {
  first_name: string;
  last_name: string;
  username: string;
  status: string;
  avatar?: string;
}) => {
  return request("/users/update-profile/", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// UPDATE PASSWORD
export const updatePassword = async (data: {
  old_password: string;
  new_password: string;
}) => {
  return request("/users/update-password/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// USER SEARCH
export const searchUsers = async (query: string) => {
  return request(`/users/users?q=${query}&page=1&limit=5`, {
    method: "GET",
  });
};
