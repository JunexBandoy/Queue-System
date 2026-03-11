interface TableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TableAction: React.FC<TableActionsProps> = ({
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex space-x-3">
      {onView && (
        <button onClick={onView} className="bg-green-500 rounded-md py-1 px-2">
          View
        </button>
      )}

      {onEdit && (
        <button onClick={onEdit} className="bg-blue-500 rounded-md py-1 px-2">
          Edit
        </button>
      )}

      {onDelete && (
        <button onClick={onDelete} className="bg-red-500 rounded-md py-1 px-2">
          Delete
        </button>
      )}
    </div>
  );
};
