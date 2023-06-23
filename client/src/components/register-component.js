import React, { useState } from "react";
import AuthService from "../services/auth.services";
import { useNavigate } from "react-router-dom";

const RegisterComponent = () => {
  const redirect = useNavigate();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState();

  const handleUsername = (e) => {
    setUserName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleRole = (e) => {
    setRole(e.target.value);
  };
  const handleRegister = () => {
    AuthService.register(username, email, password, role)
      .then(() => {
        window.alert(
          "Congraulation register successfully !! Now redirect to login page. "
        );
        redirect("/login");
      })
      .catch((e) => {
        setError(e.response.data);
      });
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      {error && <div className="alert alert-danger">{error}</div>}
      <div>
        <div>
          <label htmlFor="username">用戶名稱:</label>
          <input
            type="text"
            onChange={handleUsername}
            className="form-control"
            name="username"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="email">電子信箱：</label>
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
            placeholder="長度至少超過6個英文或數字"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">身份：</label>
          <input
            type="text"
            onChange={handleRole}
            className="form-control"
            placeholder="只能填入student或是instructor這兩個選項其一"
            name="role"
          />
        </div>
        <br />
        <button className="btn btn-primary" onClick={handleRegister}>
          <span>註冊會員</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterComponent;