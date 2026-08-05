// src/app/lists/page.tsx – My Lists: saved product lists for quick reordering
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEMO_LISTS, type SavedList } from "@/lib/lists";

function slugify(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function ListsPage() {
  const [lists, setLists] = useState<SavedList[]>(DEMO_LISTS);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  // "Create a list" in the Account dropdown links here with ?create=1 to
  // open the form immediately. Read via plain window.location rather than
  // next/navigation's useSearchParams, which never resolves when wrapped in
  // Suspense on this Next.js build (see CatalogView.tsx for the same fix).
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("create") === "1") {
      setCreating(true);
    }
  }, []);

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const id = slugify(name) || `list-${lists.length + 1}`;
    setLists((prev) => [...prev, { id, name, items: [] }]);
    setNewName("");
    setCreating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl uppercase text-gray-900">
            My Lists
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Saved product lists for one-click reordering.
          </p>
        </div>
        <button
          onClick={() => setCreating((v) => !v)}
          className="text-sm font-bold text-navy hover:text-navy-dark"
        >
          + Create new list
        </button>
      </div>

      {creating && (
        <div className="border border-gray-200 p-5 mb-8 flex items-end gap-3">
          <label className="flex-1">
            <span className="block text-xs font-semibold text-gray-500 mb-1">
              List name
            </span>
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="e.g. Weekend Catering Order"
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-navy"
            />
          </label>
          <button
            onClick={handleCreate}
            className="px-5 py-2 bg-navy text-white text-sm font-bold hover:bg-navy-dark transition-colors"
          >
            Create
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists.map((list) => (
          <Link
            key={list.id}
            href={`/lists/${list.id}`}
            className="group border border-gray-200 p-6 hover:border-navy hover:shadow-sm transition-all"
          >
            <h2 className="text-base font-bold text-gray-900 group-hover:text-navy transition-colors">
              {list.name}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {list.items.length} item{list.items.length === 1 ? "" : "s"}
            </p>
            <span className="mt-4 inline-block text-sm font-bold text-navy">
              View →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
