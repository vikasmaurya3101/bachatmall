"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "@/providers/SessionProvider";
import Loader from "@/components/ui/Loader";

const FIELDS = [
  { key: "contact_email",   label: "Support Email",        placeholder: "support@shopka.in",                type: "email" },
  { key: "contact_phone",   label: "Support Phone",        placeholder: "+91 99999 99999",                  type: "tel" },
  { key: "whatsapp_number", label: "WhatsApp Number",      placeholder: "919999999999 (no + or spaces)",    type: "tel" },
  { key: "instagram_url",   label: "Instagram URL",        placeholder: "https://instagram.com/shopka.in",  type: "url" },
  { key: "facebook_url",    label: "Facebook URL",         placeholder: "https://facebook.com/shopka.in",   type: "url" },
  { key: "youtube_url",     label: "YouTube URL",          placeholder: "https://youtube.com/@shopka.in",   type: "url" },
  { key: "twitter_url",     label: "Twitter / X URL",      placeholder: "https://x.com/shopka_in",          type: "url" },
  { key: "address",         label: "Business Address",     placeholder: "City, State, India",               type: "text" },
] as const;

type SettingKey = (typeof FIELDS)[number]["key"];

export default function AdminSettingsPage() {
  const { user, isLoading } = useSession();
  const [values, setValues] = useState<Partial<Record<SettingKey, string>>>({});
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setValues(json.data);
      })
      .finally(() => setIsFetching(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Settings saved!");
      } else {
        toast.error(json.message ?? "Unable to save.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || isFetching) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <Loader size="lg" />
      </main>
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center">
        <p className="text-lg text-gray-600">Admin access required.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Contact info and social links shown to customers on the Contact &amp; Profile pages.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Contact info */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Contact Info</h2>
            <div className="space-y-4">
              {FIELDS.slice(0, 3).map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
                  <input
                    type={type}
                    value={values[key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Business Address</label>
                <input
                  type="text"
                  value={values["address"] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))}
                  placeholder="City, State, India"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>
          </div>

          {/* Social links */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Social Media Links</h2>
            <div className="space-y-4">
              {FIELDS.slice(3, 7).map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
                  <input
                    type={type}
                    value={values[key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            💡 Changes take effect immediately on the Contact Us and Profile pages.
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-xl bg-brand py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </main>
  );
}
