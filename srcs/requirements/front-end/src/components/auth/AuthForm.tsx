    import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { InputForm } from "./InputForm";
import { AuthButton } from "./AuthButton";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { APP } from "../../network/app";
import { AlertContext } from "../../contexts/Alert.context";
import axios from "axios";

/**
 * AuthForm component
 * Contains every elements to fill a form to sign in or register a user.
 */
export const AuthForm = () => {

    /* -- Refs -- */
    const email = useRef<string>("");
    const username = useRef<string>("");
    const password = useRef<string>("");
    const passwordConfirm = useRef<string>("");

    /* -- Navigate through router -- */
    const navigate = useNavigate();

    /* -- PopUp for errors and success -- */
    const {handleError, handleSuccess}: any = useContext(AlertContext);
    
    /* -- States */
    const [variant, setVariant] = useState<'signin' | 'register'>('signin');
    
    /* -- Callback to switch between sign and register in one click -- */
    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant === 'signin' ? 'register' : 'signin');
    }, []);
    
    /* -- Code to switch between register and sign pages if a query parameter 'type' is in the URL -- */
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        if (searchParams.get('type') === 'signin' || searchParams.get('type') === 'register') {
            setVariant(searchParams.get('type') as 'signin' | 'register');
        }
    }, [])

    /* -- Handle submit of the form - call the API and redirect to /home if the connection is a success and /tfa if the TFA is enable on this user -- */
    const handleSubmit = (event: any) => {
        event.preventDefault();

        APP.post(`/auth/${variant}`, {
            email: email.current,
            login: username.current,
            password: password.current,
        }).then((res: any) => {
            if (res.data?.url) {
                navigate('/' + res.data.url);
            } else {
                navigate('/home');
                handleSuccess('You have been successfully connected!')
            }
        }).catch((err) => {
            handleError(err?.message)
        })
    }

    /* -- Rediction to connect with the 42 API -- */
    const handleFortyTwo = async (event: any) => {
        event.preventDefault();
        APP.get('/auth/42/connect')
        .then((res) => {
            window.location.href = res.data.url;
            handleSuccess("Successfully redirected to 42");
        }).catch((err) => {
            handleError(err?.message)
        })
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
            >
                {variant === 'signin' ? 'Log In to your account' : 'Create a new account'}
            </h2>
            <form>
                <div 
                    className="
                    flex
                    justify-center
                    flex-col
                    gap-4
                    mb-10
                    "
                >
                    { variant === 'register' && (
                        <InputForm
                        id="email"
                        label="Email"
                        type="email"
                        onChange={(event) => email.current = event.target.value}
                        readonly={false}
                        value={undefined}
                    />
                    )}
                    <InputForm
                        id="username"
                        label="Username"
                        type="text"
                        onChange={(event) => username.current = event.target.value}
                        readonly={false}
                        value={undefined}
                    />
                    <InputForm
                        id="password"
                        label="Password"
                        type="password"
                        onChange={(event) => password.current = event.target.value}
                        readonly={false}
                        value={undefined}

                    />
                    { variant === 'register' && (
                        <InputForm
                            id="confirm-password"
                            label="Confirm Password"
                            type="password"
                            onChange={(event) => passwordConfirm.current = event.target.value}
                            readonly={false}
                            value={undefined}
                        />
                    )}
                </div>
                <AuthButton
                    title={variant === 'signin' ? 'Log In' : 'Register'}
                    onClick={(event) => handleSubmit(event)}
                />
                <p
                    className="
                    text-[14px]
                    mt-4
                    text-neutral-400
                    max-w-auto
                    md:max-w-[350px]
                    mx-2
                    "
                >
                    {variant === 'signin' ? 'Don\'t have an account? ' : 'Already have an account? '}
                    <span
                        className="
                        text-white
                        hover:underline
                        cursor-pointer
                        "
                        onClick={toggleVariant}
                    >
                        {variant === 'signin' ? 'Create your transcendence account ' : 'Log In to your account'}
                    </span>
                </p>
                <div
                    className="
                    inline-flex
                    items-center
                    justify-center
                    w-full
                    "
                    >
                    <hr
                        className="
                        w-64
                        h-1
                        bg-gray-200
                        border-0
                        rounded
                        mb-4
                        "
                    />
                </div>
                <AuthButton
                    title="Connect with 42 Intra"
                    onClick={(event) => handleFortyTwo(event)}
                />
            </form>
    </>
    )
}
