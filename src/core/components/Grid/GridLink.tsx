import { Link } from 'react-router-dom';

interface Props {
  to: string;
  children?: React.ReactNode;
}

export const GridLink: React.FC<Props> = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="bg block pl-3 pr-16 py-1 text-sm text-gray-700 hover:text-gray-900 cursor-pointer hover:bg-gray-100"
    >
      {children}
    </Link>
  );
};
