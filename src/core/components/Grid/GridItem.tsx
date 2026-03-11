import { Link } from "react-router";
import { SampleHome } from "../Icons/SampleHome";
import { HeartIcon } from "@heroicons/react/24/outline";

interface Props {
  id: number;
  title: string;
  category?: string;
  to: string;
  // price: number;
  // guest: number;
}

export const GridItem: React.FC<Props> = ({
  id,
  title,
  category,
  to,
  // price,
  // guest,
}) => {
  return (
    <>
      <Link
        to={to}
        className="relative rounded-xl border bg-white  border-gray-400 shadow-md"
      >
        <HeartIcon className="absolute top-4 right-4 z-10 w-6 curser-default transition duration-300 fill-transparent hover:stroke-transparent stroke-white hover:fill-red-500 hover:drop-shadow-md" />

        <div className="aspect-auto w-full overflow-hidden rounded-t-xl">
          <SampleHome />
        </div>
        <li className="overflow-hidden">
          <div className="flex items-center gap-x-4 border-b-2 border-gray-900/5 p-4">
            <div className="space-y-0.5">
              <div className="text-base font-semibold leading-6 text-primary-900">
                {title}
              </div>
              <div className="text-sm font-normal leading-6 text-black text-opacity-60">
                {category ? category : "uncategorized"}
              </div>
            </div>
          </div>
        </li>
        {/* <div className="flex justify-between py-2 px-6 border-t">
          <div className='w-full border-r-2 text-left border-black border-opacity-25'><span className='font-bold text-primary-500'>$</span>{price}</div>
          <div className='w-full border-l-2 text-right border-black border-opacity-25'><span className='font-bold text-primary-500'>Guest: </span>{guest}</div>
        </div> */}
      </Link>
    </>
  );
};
