interface Prop {
  children?: React.ReactNode;
}

export const SideBarMenuContainer: React.FC<Prop> = ({ children }) => {
  return <div className="flex-1 px-1.5 pb-4">{children}</div>;
};
