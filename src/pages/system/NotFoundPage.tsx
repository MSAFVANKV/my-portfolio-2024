import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-center px-6">
      
      {/* Big 404 */}
      <h1 className="text-7xl font-bold text-blue-600">404</h1>

      <h2 className="text-2xl font-semibold mt-4">
        Page not found
      </h2>

      <p className="text-gray-500 mt-2 max-w-md">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFoundPage;
