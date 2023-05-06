import { useSearchParams } from "react-router-dom";
import { AuthForm } from "../components/auth/AuthForm";
import { TFAForm } from "../components/auth/TFAForm";

export const Authentification = () => {

    const [p] = useSearchParams();

    return (
    <>
        <div
            className="
                fixed
                h-full
                w-full
                top-0
                left-0
                md:bg-background-blur
                bg-zinc-900
                bg-no-repeat
                bg-cover
                flex
                justify-center
                items-center
            "
            translate="yes"  // check this part
        >
            <div
                className="
                relative
                bg-zinc-900
                bg-opacity-90
                px-12
                py-12
                rounded-md
                w-full
                md:w-auto
                md:max-w-md
            "
            >
                {
                p.get('username') && p.get('qrcode') ? <>
                    <TFAForm
                        username={p.get('username') as string}
                        qrcode={p.get('qrcode') as string}
                    />
                </>
                :
                <>
                    <AuthForm />
                </>
                }
            </div>
        </div>    



    </>
    );
}