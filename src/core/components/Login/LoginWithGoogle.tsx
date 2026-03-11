interface Props {
    children?: React.ReactNode;
    onClick: () => void;
    disabled?: any;
}

export const LoginWithGoogle: React.FC<Props> = ({onClick, children, disabled}) => {
    return (
      <button
        className="border-2 w-full rounded-md border-black px-4 py-2 hover:bg-primary-400 hover:border-primary-400 hover:text-white"
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
}
