import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authServices from "../services/auth.services";

const LoginComponent = (props) => {
  let { setCurrentUser } = props;
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [error, setError] = useState();
  let redirect = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleLogin = (e) => {
    authServices
      .login(email, password)
      .then((result) => {
        localStorage.setItem("user", JSON.stringify(result.data));
        setCurrentUser(authServices.getCurrentUser());
        window.alert("Login successfully ! Now redirect profile page. ");
        redirect("/profile");
      })
      .catch((e) => {
        setError(e.response.data);
      });
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      {error && <div className="alert alert-danger">{error}</div>}
      <div>
        <div className="form-group">
          <label htmlFor="username">電子信箱：</label>
          <input
            type="text"
            onChange={handleEmail}
            className="form-control"
            name="email"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">密碼：</label>
          <input
            type="password"
            onChange={handlePassword}
            className="form-control"
            name="password"
          />
        </div>
        <br />
        <div className="form-group">
          <button className="btn btn-primary btn-block" onClick={handleLogin}>
            <span>登入系統</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
