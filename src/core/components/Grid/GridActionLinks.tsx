interface Props {
  id: number;
  onClick: (paramId: number) => void;
  children?: React.ReactNode;
}

export const GridActionLinks: React.FC<Props> = ({ id, onClick, children }) => {
  return (
    <>
      <span
        className="bg block pl-3 pr-16 py-1 text-sm text-gray-700 hover:text-gray-900 cursor-pointer hover:bg-gray-50"
        onClick={() => onClick(id)}
      >
        {children}
      </span>
    </>
  );
};
