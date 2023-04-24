interface IAuthFormProps {
    title: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const AuthButton : React.FC<IAuthFormProps> = ({
    title,
    onClick
}) => {
    return (
    <>
        <button
            className="
                w-full
                py-3
                rounded-md
                bg-[#d4909f]
                text-white
                hover:bg-[#a36472]
            "
            onClick={onClick}
        >
            {title}
        </button>
    </>
    );
}