import { Link } from "react-router-dom";
import { Heart, Flame, Smile, Droplet, Laugh } from "lucide-react";

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700 dark:bg-slate-800 dark:text-pink-300">
      {children}
    </span>
  );
}

export default function ConfessionCard({ item }) {
  return (
    <div
      className="rounded-3xl border bg-white shadow-sm hover:shadow-md transition-shadow p-5 cursor-pointer dark:bg-slate-900 dark:border-slate-800"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge>{item.category}</Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">📅 {item.createdAt}</span>
        </div>
        <Link
          to={`/c/${item.id}`}
          className="text-sm font-medium text-pink-700 hover:underline dark:text-pink-400"
        >
          Open →
        </Link>
      </div>

      <p className="mt-3 text-slate-800 leading-relaxed line-clamp-3 dark:text-slate-200">
        {item.message}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium dark:text-slate-300">To:</span> {item.to} &nbsp;•&nbsp;
          <span className="font-medium dark:text-slate-300">From:</span> {item.from}
        </div>

        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 text-xs text-red-500">
            <Heart className="h-4 w-4" />
            {item.reactions?.heart ?? 0}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-yellow-500">
            <Smile className="h-4 w-4" />
            {item.reactions?.wow ?? 0}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-blue-500">
            <Laugh className="h-4 w-4" />
            {item.reactions?.laugh ?? 0}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-cyan-500">
            <Droplet className="h-4 w-4" />
            {item.reactions?.cry ?? 0}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-orange-500">
            <Flame className="h-4 w-4" />
            {item.reactions?.fire ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}
