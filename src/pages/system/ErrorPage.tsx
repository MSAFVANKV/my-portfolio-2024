import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
  const error: any = useRouteError();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-center px-6">
      
      <h1 className="text-6xl font-bold text-red-500">Oops!</h1>

      <p className="mt-4 text-gray-600">
        Something went wrong.
      </p>

      <p className="text-sm text-gray-400 mt-2">
        {error?.statusText || error?.message}
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Return Home
      </Link>
    </div>
  );
};

export default ErrorPage;
