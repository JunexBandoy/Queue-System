interface Prop {
  children?: React.ReactNode;
}

export const SideBarContainer: React.FC<Prop> = ({ children }) => {
  return (
    <div className="col-span-1 h-[100vh] drop-shadow-md w-full">{children}</div>
  );
};
