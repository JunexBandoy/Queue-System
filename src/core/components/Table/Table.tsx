interface Props {
  children?: React.ReactNode;
}

export const Table: React.FC<Props> = ({ children }) => {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="inline-block min-w-full py-2 align-middle">
        <div className="overflow-hidden min-h-[500px]">{children}</div>
      </div>
    </div>
  );
};
