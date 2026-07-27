"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "@/providers/SessionProvider";
import Loader from "@/components/ui/Loader";

interface ParsedRow {
  [key: string]: string;
}

interface ImportResult {
  row: number;
  name: string;
  success: boolean;
  message: string;
}

// Small CSV parser — handles quoted fields with commas inside them.
// Good enough for a simple, self-authored template; not a full RFC 4180
// implementation.
function parseCsv(text: string): ParsedRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  function splitLine(line: string): string[] {
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        cells.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    cells.push(current.trim());
    return cells;
  }

  const headers = splitLine(lines[0]);

  return lines.slice(1).map((line) => {
    const cells = splitLine(line);
    const row: ParsedRow = {};
    headers.forEach((h, i) => {
      row[h] = cells[i] ?? "";
    });
    return row;
  });
}

export default function BulkImportPage() {
  const { user, isAuthenticated, isLoading: isSessionLoading } = useSession();

  const isAuthorized =
    isAuthenticated && (user?.role === "ADMIN" || user?.role === "SELLER");

  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [results, setResults] = useState<ImportResult[] | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setResults(null);

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const parsed = parseCsv(text);

      if (parsed.length === 0) {
        toast.error("Couldn't find any rows in that file.");
        return;
      }

      setRows(parsed);
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (rows.length === 0) return;

    setIsImporting(true);

    try {
      const res = await fetch("/api/admin/products/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });

      const json = await res.json();

      if (!json.success) {
        toast.error(json.message ?? "Import failed.");
        return;
      }

      setResults(json.data);
      toast.success(json.message);
    } finally {
      setIsImporting(false);
    }
  }

  if (isSessionLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <Loader size="lg" />
      </main>
    );
  }

  if (!isAuthorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center">
        <p className="text-lg text-gray-600">
          You don&apos;t have access to this page.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Bulk Import Products
          </h1>
          <Link
            href="/admin/products"
            className="text-sm font-medium text-brand hover:underline"
          >
            ← Back to products
          </Link>
        </div>

        <div className="mb-6 rounded-xl border bg-white p-5">
          <h2 className="mb-2 font-semibold text-gray-800">
            1. Fill the template
          </h2>
          <p className="mb-3 text-sm text-gray-600">
            Columns: <code>name, description, sku, category, mrp,
            sellingPrice, stock, imageUrl, isPublished</code>. The{" "}
            <code>category</code> must match an existing category name
            exactly (e.g. Electronics, Fashion, Home &amp; Kitchen).
          </p>
        </div>

        <div className="mb-6 rounded-xl border bg-white p-5">
          <h2 className="mb-2 font-semibold text-gray-800">
            2. Upload your filled CSV
          </h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="text-sm"
          />
          {fileName && (
            <p className="mt-2 text-sm text-gray-500">
              {fileName} — {rows.length} row(s) found
            </p>
          )}
        </div>

        {rows.length > 0 && (
          <div className="mb-6 overflow-x-auto rounded-xl border bg-white p-5">
            <h2 className="mb-3 font-semibold text-gray-800">3. Preview</h2>
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500">
                <tr>
                  <th className="pr-4">Name</th>
                  <th className="pr-4">Category</th>
                  <th className="pr-4">SKU</th>
                  <th className="pr-4">MRP</th>
                  <th>Selling Price</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-1.5 pr-4">{r.name}</td>
                    <td className="py-1.5 pr-4">{r.category}</td>
                    <td className="py-1.5 pr-4">{r.sku}</td>
                    <td className="py-1.5 pr-4">₹{r.mrp}</td>
                    <td className="py-1.5">₹{r.sellingPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={handleImport}
              disabled={isImporting}
              className="mt-4 w-full rounded-xl bg-brand py-3 font-semibold text-white disabled:opacity-60"
            >
              {isImporting
                ? "Importing..."
                : `Import ${rows.length} product(s)`}
            </button>
          </div>
        )}

        {results && (
          <div className="rounded-xl border bg-white p-5">
            <h2 className="mb-3 font-semibold text-gray-800">Results</h2>
            <ul className="space-y-1.5 text-sm">
              {results.map((r) => (
                <li
                  key={r.row}
                  className={r.success ? "text-green-700" : "text-red-600"}
                >
                  Row {r.row} — {r.name || "(no name)"}: {r.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
