import axios from "axios";
export const API_BASE_URL = "http://localhost:5232/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/Auth/login`,
  },
  // Thêm các endpoint khác ở đây
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("user");
  //   {
  //   "success": true,
  //   "message": "Login successfully",
  //   "errorCode": null,
  //   "data": {
  //     "success": true,
  //     "message": "Login successful",
  //     "userId": "a1fb9089-8e1e-41bf-8332-0367e76fc063",
  //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImExZmI5MDg5LThlMWUtNDFiZi04MzMyLTAzNjdlNzZmYzA2MyIsImp0aSI6IjY3ZDdkMzc0LWJkYWMtNDE4Ni1hNjEzLTQ0MDRkYTJmYjA1YSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkNvbXBhbnlBZG1pbiIsImV4cCI6MTc2MTY2MzAyNiwiaXNzIjoiQ29tcGFueURlYWxlckFQSSIsImF1ZCI6IkNvbXBhbnlEZWFsZXJDbGllbnQifQ.gBSFhWgVJnHWA_R5_h-7JHc2t8g0kuCDCsn2X2lnzxk",
  //     "refreshToken": "w+Z3uGA59A0txxxbJbjupYogCDxidQbdQtBKdWbpPUo=",
  //     "roles": [
  //       "CompanyAdmin"
  //     ]
  //   }
  // }
  if (token) {
    const tokenData = JSON.parse(token);
    config.headers.Authorization = `Bearer ${tokenData.data.token}`;
  }

  return config;
});
