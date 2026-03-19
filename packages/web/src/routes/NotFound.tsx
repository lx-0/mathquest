import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <h1 className="mb-2 text-6xl font-bold text-gray-300">404</h1>
        <p className="mb-6 text-lg text-gray-600">Page not found</p>
        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center rounded-xl bg-primary px-6 py-3 text-white hover:bg-blue-600"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
