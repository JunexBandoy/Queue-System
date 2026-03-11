interface Props {
    children?: React.ReactNode;
}

export const FormsContainer: React.FC<Props> = ({children}) => {
  return (
    <div className="pt-4 pb-8 space-y-4 w-full justify-center">{children}</div>
  );
}
