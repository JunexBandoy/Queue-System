interface Props {
    children?: React.ReactNode;
    onClick: () => void;
    disabled?: any;
}

export const SignInButton: React.FC<Props> = ({onClick, children, disabled}) => {
    return (
        <button className="border-2 w-full rounded-md px-4 py-2 border-black hover:bg-black hover:text-white"
            onClick={onClick}
            disabled={disabled}>
            {children}
        </button>
    )
}
