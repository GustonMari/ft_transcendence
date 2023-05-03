import { UpdateProfileForm } from '../components/forms/UpdateProfileForm';
import { NavBar } from '../components/communs/NavBar';

function Profile() {
  return (
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
        "
    >
        <div
            className="
            flex
            flex-col
            md:flex-row
            w-full
            h-full
            "
        >
            <NavBar />
            <div
                className="
                flex
                w-full
                h-full
                justify-center
                items-center
                "
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
                    <UpdateProfileForm />
                </div>
            </div>

        </div>
    </div>
  );
}

export default Profile;