interface Props {
    onClick: () => void;
    children?: React.ReactNode;
}

export const CancelButton: React.FC<Props> = ({onClick, children}) => {
    return (
        <div className="items-end grid">
          <button
            className="bg-white shadow-md rounded-md py-2 px-8"
            onClick={onClick}
          >
            {children}
          </button>
        </div>
    )
}
