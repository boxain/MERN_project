import React, { useState } from "react";
import courseServices from "../services/course.services";
import { useNavigate } from "react-router-dom";

const EnrollComponent = ({currentUser,setCurrentUser}) => {
  let [searchInput, setSearchInput] = useState("");
  let [searchInputData, setSearchInputData] = useState();
  let redirect = useNavigate()

  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    courseServices
      .getByTitle(searchInput)
      .then((data) => {
        setSearchInputData(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleEnroll = (e) => {
    courseServices
      .getByTitle(searchInput)
      .then((data) => {
        courseServices.enrollCourse(e.target.id)
        window.alert("Enroll successfully ! Now redirect to course page. ")
        redirect("/course")
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>需要先登入才能瀏覽此頁面</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              redirect("/login");
            }}
          >
            回到登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "instructor" && (
        <h1>只有學生才能註冊課程</h1>
      )}
      {currentUser && currentUser.user.role === "student" && (
        <div className="search input-group mb-3">
          <input
            type="text"
            className="form-control"
            onChange={handleChangeInput}
          />
          <button onClick={handleSearch} className="btn btn-primary">
            搜尋課程
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "student" && searchInputData &&
        <div style={{display:"flex", flexWrap:"wrap"}}>
          {searchInputData.map((course) => {
            return (
            <div className="card" style={{ width: "18rem", margin: "1rem" }} key={course._id}>
              <div className="card-body">
                <h5 className="card-title">課程名稱 : {course.title}</h5>
                <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                  {course.description}
                </p>
                <p style={{ margin: "0.5rem 0rem" }}>
                  學生人數 : {course.students.length}
                </p>
                <p style={{ margin: "0.5rem 0rem" }}>課程價格 : {course.price}</p>
                <p style={{ margin: "0.5rem 0rem" }}>導師 : {course.instructor.username}</p>
                <a href="#" className="card-text btn btn-primary" id={course._id} onClick={handleEnroll}>註冊課程</a>

              </div>
            </div>
            )
          })}
        </div>
      }
    </div>
  );
};

export default EnrollComponent;
