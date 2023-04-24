import { AuthForm } from "../components/auth/AuthForm";

export const Authentification = () => {

    return (
    <>
        <div
            className="
                absolute
                h-full
                w-full
                top-0
                left-0
                md:bg-background-blur
                bg-zinc-900
                bg-no-repeat
                bg-cover
                bg-fixed
                flex
                justify-center
                items-center
            "
            translate="yes"  // check this part
        >
            <div
                className="
                absolute
                bg-zinc-900
                bg-opacity-90
                px-12
                py-12
                rounded-md
                top-36
                w-full
                md:w-auto
                md:max-w-md
            "
            >
                <AuthForm />
            </div>
        </div>    
    </>
    );
}