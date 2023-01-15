import axios from "axios";
import { useEffect, useState } from "react";
import "../../styles/Forms/RegisterForm.css";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";
import bcrypt from 'bcryptjs'

/*

*/

export default function RegisterForm() {
  const [login, setLogin] = useState("");
  const [mail, setMail] = useState("");
  const [pw, setPW] = useState("");
  const [cpw, setCPW] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  return (
    <section>
      <div className="auth_form">
        <div className="left">
          <h2>Sign Up</h2>
          <form
            className="form"
            onSubmit={async (e) => {
              e.preventDefault();
              const data = await API.post("auth/register", {
                login: login,
                email: mail,
                password: bcrypt.hashSync(pw, '$2a$10$CwTycUXWue0Thq9StjUM0u'), // TODO: change hashing code and put it in .env
              }).catch(() => {
                // setError(data.errorMessage);
                return;
              });
              navigate('/home');
            }}
          >
            <input
              type="text"
              onChange={(e) => setMail(e.target.value)}
              name="email"
              placeholder="email"
            />
            <input
              type="text"
              onChange={(e) => setLogin(e.target.value)}
              name="login"
              placeholder="login"
            />
            <input
              type="password"
              onChange={(e) => {
                setPW(e.target.value);
              }}
              name="password"
              placeholder="password"
            />
            <input
              type="password"
              onChange={(e) => {
                e.preventDefault;
                setCPW(e.target.value);
              }}
              name="confirmed_password"
              placeholder="confirm password"
            />

            <br></br>
            <button className="button_register" type="submit">
              Sign In
            </button>
          </form>
        </div>
        <div className="right">
          <h2>You already have an account ?</h2>
          <button onClick={() => {
            navigate('/signin');
          }}className="btn_redirect">Login</button>
        </div>
      </div>
    </section>
  );
}
