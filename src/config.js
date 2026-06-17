const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://backend-p8j1.onrender.com"
    : "http://localhost:3002");

export default BACKEND_URL;
