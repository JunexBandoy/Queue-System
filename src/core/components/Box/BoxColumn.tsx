interface Props {
  children?: React.ReactNode;
}
/**
 * BoxColumn is a full width component that organize the children in a column.
 *
 * Use this inside Box, BoxMedium, BoxNarrow
 */

export const BoxColumn: React.FC<Props> = ({ children }) => {
  return <div className="flex flex-col w-full space-y-4">{children}</div>;
};
