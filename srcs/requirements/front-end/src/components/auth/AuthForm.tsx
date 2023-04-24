import { useCallback, useEffect, useRef, useState } from "react";
import { InputForm } from "./InputForm";
import { AuthButton } from "./AuthButton";
import { useSearchParams } from "react-router-dom";

export const AuthForm = () => {

    /* Refs */
    const email = useRef<string>("");
    const username = useRef<string>("");
    const password = useRef<string>("");
    const passwordConfirm = useRef<string>("");
    
    /* States */
    const [variant, setVariant] = useState<'signin' | 'register'>('signin');
    
    /* Callback to switch between sign and register in one click*/
    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant === 'signin' ? 'register' : 'signin');
    }, []);
    
    /* Code to switch between register and sign pages if a query parameter 'type' is in the URL */
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        if (searchParams.get('type') === 'signin' || searchParams.get('type') === 'register') {
            setVariant(searchParams.get('type') as 'signin' | 'register');
        }
    }, [])

    const handleSubmit = () => {
        console.log(email.current, username.current, password.current, passwordConfirm.current);
    }

    const handleFortyTwo = () => {}

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
                            id="username"
                            label="Username"
                            type="text"
                            onChange={(event) => username.current = event.target.value}
                        />
                    )}
                    <InputForm
                        id="email"
                        label="Email"
                        type="email"
                        onChange={(event) => email.current = event.target.value}
                    />
                    <InputForm
                        id="password"
                        label="Password"
                        type="password"
                        onChange={(event) => password.current = event.target.value}

                    />
                    { variant === 'register' && (
                        <InputForm
                            id="confirm-password"
                            label="Confirm Password"
                            type="password"
                            onChange={(event) => passwordConfirm.current = event.target.value}
                        />
                    )}
                </div>
                <AuthButton
                    title={variant === 'signin' ? 'Log In' : 'Register'}
                    onClick={() => handleSubmit()}
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
                <div className="inline-flex items-center justify-center w-full">
                    <hr className="w-64 h-1 bg-gray-200 border-0 rounded mb-5"/>
                </div>
                <AuthButton
                    title="Connect with 42 Intra"
                    onClick={(event) => console.log('Google')}
                />
            </form>
    </>
    )
}