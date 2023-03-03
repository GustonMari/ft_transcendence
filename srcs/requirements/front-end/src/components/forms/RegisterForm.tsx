import { useContext, useEffect, useState } from "react";
import s from "../../styles/forms/RegisterForm.module.css";
import API from "../../network/api";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../../contexts/Alert.context";

export default function RegisterForm() {
  const [login, setLogin] = useState("");
  const [mail, setMail] = useState("");
  const [pw, setPW] = useState("");
  const [cpw, setCPW] = useState("");
  const { handleError, handleSuccess }: any = useContext(AlertContext);
  const navigate = useNavigate();

  const valid_charset = /^[a-zA-Z0-9_]*$/;

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

  function handleSubmit(e: any) {
    e.preventDefault();
    if (login === "" || mail === "" || pw === "" || cpw === "") {
      handleError("Please fill all the fields");
      return;
    }
    if (pw.length < 8) {
      handleError("Password must be at least 8 characters long");
      return;
    }
    if (pw !== cpw) {
      handleError("Passwords do not match");
      return;
    }
    if (!valid_charset.test(login)) {
      handleError(
        "Username must only contain letters, numbers and underscores"
      );
      return;
    }
    if (!valid_charset.test(pw)) {
      handleError(
        "Password must only contain letters, numbers and underscores"
      );
      return;
    }

    API.register(
      {
        login: login,
        email: mail,
        password: pw,
      },
      () => {
        navigate("/home");
        handleSuccess("You are now registered");
      },
      (err: any) => {
        handleError("Error while registering");
      }
    );
  }

  return (
    <>
      <form className={s.form} onSubmit={handleSubmit}>
        <h2 className={s.form_title}>Create an account</h2>
        <label className={s.labels}>Username</label>
        <input
          className={s.inputs}
          type="text"
          onChange={(e) => setLogin(e.target.value)}
          name="login"
          placeholder="Username"
        />
        <label className={s.labels}>Email</label>
        <input
          className={s.inputs}
          type="text"
          onChange={(e) => setMail(e.target.value)}
          name="email"
          placeholder="Email"
        />
        <label className={s.labels}>Password</label>
        <input
          className={s.inputs}
          type="password"
          onChange={(e) => setPW(e.target.value)}
          name="password"
          placeholder="Password"
        />
        <label className={s.labels}>Confirm Password</label>
        <input
          className={s.inputs}
          type="password"
          onChange={(e) => setCPW(e.target.value)}
          name="confirm password"
          placeholder="Confirm Password"
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
              window.location.href = "/signin";
            }}
          >
            <div className={s.signup_btn}>Sign In</div>
          </a>
        </div>
      </form>
    </>
  );
}
