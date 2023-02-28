import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/api";

export default function TFA () {

    const [params, _setParams] = useSearchParams();
    const [code, setCode] = useState(params.get('qrcode') as any);
    const [username, setUsername] = useState(params.get('username') as any);
    const [tfaCode, setTfaCode] = useState('');

    const navigate = useNavigate();

    // useEffect(() => {
    // }, [tfaCode]);

    function handleClick(e: any) {
        API.tfaCheck(
            tfaCode,
            username,
            () => {
                navigate("/home");
            }, (err: any) => {
                console.log(err);
            }
        );
    }



    return (
        <>
            <div>
            <h1>Two Factor Authentication</h1>
            <h1>{code.toString()}</h1>
            <QRCode value={code.toString()}></QRCode>
            <input onChange={(e) => {
                e.preventDefault();
                setTfaCode(e.target.value)
            }}/>
            <button onClick={(e) => {
                e.preventDefault();
                handleClick(e);
            }}>Submit</button>
            </div>
        </>
    )
}