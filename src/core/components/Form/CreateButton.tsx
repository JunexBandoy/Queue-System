interface Props {
  onClick: () => void;
  children?: React.ReactNode;
}

export const CreateButton: React.FC<Props> = ({ onClick, children }) => {
  return (
    <div className="flex justify-end">
      <button
        className="bg-[#03D79A] text-white shadow-md rounded-md py-2 px-8"
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
};
