interface Props {
  children?: React.ReactNode;
}

export const TableTitle: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-gray-100 rounded-md px-2 text-sm text-center text-black italic py-4">
      {children}
    </div>
  );
};
