import axios from "axios";
import { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [login, setLogin] = useState("");
  const [pw, setPW] = useState("");

  const navigate = useNavigate();

  return (
    <section>
      <div className="auth_form">
        <div className="left">
          <h2>Sign In</h2>
          <form
            className="form"
            onSubmit={async (e) => {
              e.preventDefault();
              const data = await API.signIn(
                {
                  login: login,
                  password: pw,
                },
                () => {
                  navigate("/home");
                  // successFunc();
                },
                (err: any) => {
                  console.log(err);
                }
              );
            }}
          >
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

            <br></br>
            <button className="button_login" type="submit">
              Sign In
            </button>
          </form>
        </div>
        <div className="right">
          <h2>You don't have an account ?</h2>
          <button
            onClick={() => {
              navigate("/register");
            }}
            className="btn_redirect"
          >
            Sign Up
          </button>
        </div>
      </div>
    </section>
  );
}
