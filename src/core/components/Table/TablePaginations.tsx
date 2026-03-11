interface Props {
  dataSource: {
    page: number;
    pageSize: number;
    total: number;
    totalPages?: number;
  };
  onPrevious: () => void;
  onNext: () => void;
}

export const TablePaginations: React.FC<Props> = ({
  dataSource,
  onPrevious,
  onNext,
}) => {
  const { page, pageSize, total, totalPages } = dataSource;
  const totalPage = Math.ceil(total / pageSize);

  return (
    <div className="flex items-center justify-end pt-6 px-4 space-x-2 text-sm">
      <div>
        <span>
          Page {page} of {totalPage}
        </span>
      </div>
      <button
        onClick={onPrevious}
        disabled={page === 1}
        className="px-3 py-1 rounded bg-blue-200 hover:bg-blue-500 disabled:hover:bg-blue-200 disabled:cursor-default"
      >
        Previous
      </button>
      <button
        onClick={onNext}
        disabled={page >= (totalPages ?? totalPage)}
        className="px-3 py-1 rounded bg-blue-200 hover:bg-blue-500 disabled:hover:bg-blue-200 disabled:cursor-default"
      >
        Next
      </button>
    </div>
  );
};
