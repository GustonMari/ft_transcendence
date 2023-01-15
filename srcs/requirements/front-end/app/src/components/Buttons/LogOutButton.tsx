import { Navigate, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import API from "../../api/api";

import '../../styles/Buttons/LogOutButton.css'

export default function LogOutButton() {
    const navigate = useNavigate();

  return (
    <div className="div-log-out-button">
      <button
        className="log-out-button"
        onClick={() => {
            API.delete('/auth/logout').then((res) => {
                navigate('/signin');
            }).catch((err) => {
                console.log(err); // Do something with the error
            });
        }}
      >
        Log out
      </button>
    </div>
  );
}
