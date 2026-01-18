import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";

export default function NotFound() {
  return (
    <Container>
      <div className="rounded-3xl border bg-white p-7 dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-2xl font-bold dark:text-white">404 - Page not found</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">តំណភ្ជាប់មិនត្រឹមត្រូវ ឬទំព័រមិនមាន។</p>
        <Link to="/" className="inline-block mt-4 text-pink-700 hover:underline dark:text-pink-400">
          Back to Home
        </Link>
      </div>
    </Container>
  );
}
