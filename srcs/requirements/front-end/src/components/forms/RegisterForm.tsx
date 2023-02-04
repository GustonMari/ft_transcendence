import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../../styles/Forms/RegisterForm.module.css";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [login, setLogin] = useState("");
  const [mail, setMail] = useState("");
  const [pw, setPW] = useState("");
  const [cpw, setCPW] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  return (
    <div className={styles.register_form}>
      <div className={styles.left_side}>
        <h2>Sign Up</h2>
        <form
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();
            const data = await API.register({
                login: login,
                email: mail,
                password: pw,
            }, () => {
                navigate("/home");
            }, (err: any) => {
                console.log(err);
            });
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
            //   e.preventDefault;
              setCPW(e.target.value);
            }}
            name="confirmed_password"
            placeholder="confirm password"
          />

          <br></br>
          <button className={styles.button_register} type="submit">
            Sign In
          </button>
        </form>
      </div>
      <div className={styles.right_side}>
        <div className={styles.go_to_signin}>
          <h2>You already have an account ?</h2>
          <button
            onClick={() => {
              navigate("/signin");
            }}
            className="btn_redirect"
          >
            Login
          </button>
        </div>
        <div className={styles.ft_signin}>
            <h2>Or</h2>
          <button
            // TODO request for 42 Auth
          >
            Connect with 42
          </button>
        </div>
      </div>
    </div>
  );
}
