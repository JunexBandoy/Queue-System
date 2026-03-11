interface Props {
  children?: React.ReactNode;
}

export const Box: React.FC<Props> = ({ children }) => {
  return (
    <div className="w-full sm:w-1/2 md:w-11/12 mx-auto mb-4 pt-2 pb-4 rounded-lg shadow-md">
      {children}
    </div>
  );
};
