import { JSX } from "react";
import { Link } from "react-router";
import GroupLoadingSkeleton from "../skeletons/CardsLoadingSkeleton";

interface ListContainerTypes {
  header: string;
  render: JSX.Element[];
  path: string;
  isLoading?: boolean;
}

function ListContainer({
  header,
  render,
  path,
  isLoading,
}: ListContainerTypes) {
  return (
    <section className="space-y-7 px-4 py-10 md:px-12 dark:bg-gray-900">
      <header className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold">{header}</h1>
        <Link to={path} className="text-md font-light text-blue-500">
          See All
        </Link>
      </header>

      {isLoading ? (
        <GroupLoadingSkeleton />
      ) : (
        <main className="flex flex-wrap justify-center gap-5">{render}</main>
      )}
    </section>
  );
}

export default ListContainer;
