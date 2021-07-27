import axios from "axios";
import store from "../store/index";

const instance = axios.create({
  baseURL: "http://localhost:3000/api/",
});

let token = store.state.userInfos.token;

if (token == "" || token != token) {
  instance.defaults.headers.common["Authorization"] = `bearer ${token}`;
} else {
  instance.defaults.headers.common["Authorization"] = `bearer ${token}`;
}
export default instance;
