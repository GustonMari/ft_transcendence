interface IInputFormProps {
    id: string;
    label: string;
    type: string;
    maxLength?: number;
    minLength?: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputForm : React.FC<IInputFormProps> = ({
    id,
    label,
    type,
    onChange,
    maxLength,
    minLength
}) => {

    return (
    <>
        <div
            className="relative"
        >
            <input
                className="
                    w-full
                    rounded-md
                    text-white
                    text-md
                    bg-neutral-600
                    px-4
                    pt-4
                    pb-1.5
                    text-md
                    peer
                    focus:outline-none
                "
                id={id}
                type={type}
                onChange={onChange}
                minLength={minLength}
                maxLength={maxLength}
                placeholder=" "
            />
            <label
                className="
                    absolute
                    text-sm
                    text-neutral-400
                    top-4
                    left-4
                    duration-200
                    tranform
                    -translate-y-3
                    scale-75
                    origin-[0]
                    cursor-text

                    peer-placeholder-shown:scale-100 
                    peer-placeholder-shown:translate-y-0 
                    peer-focus:scale-75
                    peer-focus:-translate-y-3
                "
                htmlFor={id}
            >{label}</label>
        </div>
    </>
    );
}