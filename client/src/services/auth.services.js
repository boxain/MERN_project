import axios from "axios";
const basic_url = "http://127.0.0.1:8080/api/user";

class AuthService {
  login(email, password) {
    return axios.post(basic_url + "/login", {
      email,
      password,
    });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username, email, password, role) {
    return axios.post(basic_url + "/register", {
      username,
      email,
      password,
      role,
    });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"))
  }
}

export default new AuthService();
