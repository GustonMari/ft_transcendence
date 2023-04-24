import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TFAForm from "../components/forms/TFAForm";
import { AlertContext } from "../contexts/Alert.context";

export default function TFA () {

    const [params, _setParams] = useSearchParams();
    const [code, setCode] = useState<any>(params.get('qrcode'));
    const [username, setUsername] = useState<any>(params.get('username'));

    const navigate = useNavigate();
    const { handleError, handleSuccess }: any = useContext(AlertContext);

    useEffect(() => {
        if (!username || !code ) {
            navigate('/authentification');
            handleError("Error during the TFA, code or username is invalid");
        }
    })

    return (
        <>
            {username && code &&
                <TFAForm code={code} username={username}/>
            }
        </>
    );
}