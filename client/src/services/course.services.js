import axios from "axios";
const basic_url = "http://127.0.0.1:8080/api/course";

class CourseService {
  // get all post
  post(title, description, price) {
    let token = this.getToken();
    return axios.post(
      basic_url,
      { title, description, price },
      { headers: { Authorization: token } }
    );
  }

  // get post by instructor id
  getByInstructorId(_id) {
    let token = this.getToken();
    return axios.get(basic_url + `/instructor/${_id}`, {
      headers: { Authorization: token },
    });
  }

  // get post by student id
  getByStudentId(_id) {
    let token = this.getToken();
    return axios.get(basic_url + `/student/${_id}`, {
      headers: { Authorization: token },
    });
  }

  // get post by title
  getByTitle(name) {
    let token = this.getToken();
    return axios.get(basic_url + `/findByName/${name}`, {
      headers: { Authorization: token },
    });
  }

  // enroll course
  enrollCourse(_id) {
    let token = this.getToken();
    return axios.get(basic_url + `/enroll/${_id}`, {
      headers: { Authorization: token },
    });
  }

  getToken() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return token;
  }
}

export default new CourseService();
