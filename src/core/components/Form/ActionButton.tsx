interface Props {
  onClick: () => void;
}

export const ActionButton: React.FC<Props> = ({ onClick }) => {
  return (
    <>
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className=" w-full   font-medium rounded-lg text-sm px-5 py-2.5 text-center  items-center justify-center "
        type="button"
        onClick={onClick}
      >
        <svg
          className="w-2.5 h-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
    </>
  );
};
