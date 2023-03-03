import React, { useContext, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertContext } from "../../contexts/Alert.context";
import API from "../../network/api";
import s from "../../styles/forms/TFAForm.module.css";

export default function TFAForm({ code, username }: any) {
  const [tfaCode, setTfaCode] = useState<string>("");

  const navigate = useNavigate();
  const { handleError, handleSuccess }: any = useContext(AlertContext);

  function handleSubmit(e: any) {
    e.preventDefault();
    API.tfaCheck(
      tfaCode,
      username,
      () => {
        navigate("/home");
        handleSuccess('TFA Code Validated, Welcome Back!')
      },
      (err: any) => {
        handleError('Invalid TFA Code')
      }
    );
  }

  return (
    <>
      <form className={s.form} onSubmit={handleSubmit}>
        <h2 className={s.form_title}>Two-Factor Authentication</h2>
        <div className={s.qrcode}>
            <QRCode value={code} />
        </div>
        <input
          className={s.inputs}
          type="text"
          onChange={(e) => setTfaCode(e.target.value)}
          name="code"
          placeholder="TFA Code"
        />
        <button className={s.button_login} type="submit">
          Sign In
        </button>
      </form>
    </>
  );
}
