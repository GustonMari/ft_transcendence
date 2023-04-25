import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../../contexts/Alert.context";
import QRCode from "react-qr-code";
import { InputForm } from "./InputForm";
import { AuthButton } from "./AuthButton";
import { APP } from "../../network/app";

/**
 * Interface to provide props to the TFAForm component.
 */
interface ITFAFormProps {
    username: string;
    qrcode: string;
}

/**
 * TFAForm component
 * Contains every elements to fill a form to check the TFA code.
 */
export const TFAForm : React.FC<ITFAFormProps> = ({
    username,
    qrcode
}) => {

    /* -- Refs -- */
    const code = useRef<string>("");

    /* -- PopUp for errors and success -- */
    const {handleError, handleSuccess}: any = useContext(AlertContext);

    /* -- Navigate through router -- */
    const navigate = useNavigate();

    /* -- Handle submit of the form - call the API and redirect to /home if the tfa code has been checked -- */
    function handleSubmit(e: any) {
        e.preventDefault();

        APP.get(
            `/auth/tfa/validation`,
            {
                params: {
                    token: code.current,
                    username: username
                }
            }
        ).then(() => {
            navigate("/home");
            handleSuccess('TFA Code Validated, Welcome Back!')
        }).catch((err) => {
            handleError(err.response?.data?.message || 'An error occured, please try again later.')
        });
      }

    return (
    <>
        <h2
            className="
            col-span-2
            text-center
            text-2xl
            font-semibold
            text-white
            mb-12
            break-words
            "
        >Two-Factor Authentication</h2>
        <div
            className="
            flex
            justify-center
            flex-col
            gap-4
            mb-10
            "
        >
            <QRCode
                className="
                md:w-full
                w-full
                p-auto
                mb-4
                "
                value={qrcode}
            />
            <InputForm
                id="code"
                label="Code"
                type="text"
                onChange={(event) => code.current = event.target.value}
                readonly={false}
                value={undefined}
            />
            <AuthButton
                title="Sign In"
                onClick={(event) => handleSubmit(event)}
            />
        </div>
    </>
    );
}