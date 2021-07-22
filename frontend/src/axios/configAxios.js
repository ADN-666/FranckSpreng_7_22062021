import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api/",
});

instance.defaults.headers.common["Authorization"] = `bearer ${localStorage.getItem("token")}`;

export default instance;
