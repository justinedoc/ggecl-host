import { Link } from "react-router";

interface ListContainerTypes {
  header: string;
  render: JSX.Element[];
  path: string;
}

function ListContainer({ header, render, path }: ListContainerTypes) {
  return (
    <section className="dark:bg-gray-900 md:px-12 px-4 py-10 space-y-7">
      <header className="w-full flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{header}</h1>
        <Link to={path} className="font-light text-blue-500 text-md">
          See All
        </Link>
      </header>

      <main className="flex gap-5 flex-wrap justify-center">{render}</main>
    </section>
  );
}

export default ListContainer;
