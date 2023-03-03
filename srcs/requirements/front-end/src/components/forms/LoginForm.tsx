import { useContext, useEffect, useRef, useState } from "react";
import API from "../../network/api";
import { useNavigate } from "react-router-dom";
import s from "../../styles/forms/LoginForm.module.css";
import { AlertContext } from "../../contexts/Alert.context";
import { BackGroundForm } from "./BackGroundForm";

export default function LoginForm() {
  const [login, setLogin] = useState("");
  const [pw, setPW] = useState("");
  const navigate = useNavigate();
  const { handleError, handleSuccess }: any = useContext(AlertContext);

  const valid_charset = /^[a-zA-Z0-9_]*$/;

  function handleSubmit(e: any) {
    e.preventDefault();
    if (login === "" || pw === "") {
      handleError("Please fill all the fields");
      return;
    }
    API.signIn(
      {
        login: login,
        password: pw,
      },
      () => {
        navigate("/home");
        handleSuccess("You are now connected");
      },
      (err: any) => {
        handleError("Wrong login or password");
      }
    );
  }

  function connectWith42(e: any) {
    e.preventDefault();
    API.ftConnect(
      (url: string) => {
        window.location.href = url;
        handleSuccess("Successfully redirected to 42");
      },
      () => {
        handleError("Error while connecting to 42");
      }
    );
  }

  return (
    <>
      <form className={s.form} onSubmit={handleSubmit}>
        <h2 className={s.form_title}>Connect to your profile</h2>
        <label className={s.labels}>Username</label>
        <input
          className={s.inputs}
          type="text"
          onChange={(e) => setLogin(e.target.value)}
          name="login"
          placeholder="Username"
        />
        <label className={s.labels}>Password</label>
        <input
          className={s.inputs}
          type="password"
          onChange={(e) => setPW(e.target.value)}
          name="password"
          placeholder="Password"
        />
        <button className={s.button_login} type="submit">
          Sign In
        </button>
        <div className={s.clickables}>
          <a onClick={connectWith42}>
            <div className={s.connect_42_btn}>Intra</div>
          </a>

          <a
            onClick={() => {
              window.location.href = "/register";
            }}
          >
            <div className={s.signup_btn}>Register</div>
          </a>
        </div>
      </form>
    </>
  );
}
