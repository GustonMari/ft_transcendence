import { Navigate, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import API from "../../api/api";

import '../../styles/Buttons/LogOutButton.css'
import { Http2ServerRequest } from "http2";

export default function LogOutButton() {
    const navigate = useNavigate();

  return (
    <div className="div-log-out-button">
      <button
        className="log-out-button"
        onClick={() => {
            API.logOut(
                () => {
                    navigate('/signin');
                },
                () => {
                    console.log('error');
                }
            );
        }}
      >
        Log out
      </button>
    </div>
  );
}
