interface Props {
    onClick: () => void;
    children?: React.ReactNode;
}

export const SubmitButton: React.FC<Props> = ({onClick, children}) => {
    return (
      <div className="items-end grid">
        <button
          className="bg-green-500 shadow-md rounded-md py-2 px-8"
          onClick={onClick}
        >
          {children}
        </button>
      </div>
    );
}
