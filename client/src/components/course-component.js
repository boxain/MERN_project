import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import courseServices from "../services/course.services";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  let redirect = useNavigate();
  let [courseData, setCourseData] = useState();

  useEffect(() => {
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
      if (currentUser.user.role === "instructor") {
        courseServices
          .getByInstructorId(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (currentUser.user.role === "student") {
        courseServices
          .getByStudentId(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, []);

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
      {currentUser && currentUser.user.role === "student" && (
        <h1>歡迎來到學生頁面</h1>
      )}
      {currentUser && currentUser.user.role === "instructor" && (
        <h1>歡迎來到講師頁面</h1>
      )}
      {courseData &&
        courseData.map((course) => {
          return (
            <div className="card" key={course._id} style={{ width: "18rem", margin: "1rem" ,display:"flex", flexWrap:"wrap" }}>
              <div className="card-body">
                <h5 className="card-title">課程名稱 : {course.title}</h5>
                <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                  {course.description}
                </p>
                <p style={{ margin: "0.5rem 0rem" }}>
                  學生人數 : {course.students.length}
                </p>
                <p style={{ margin: "0.5rem 0rem" }}>課程價格 : {course.price}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CourseComponent;
