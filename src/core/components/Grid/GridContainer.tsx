interface Props {
  children?: React.ReactNode;
}

export const GridContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex justify-evenly bg-gray-50 max-w-full">
      <ul className="grid grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-4 xl:gap-x-6 mx-6 my-6 w-full">
        {children}
      </ul>
    </div>
  );
};
