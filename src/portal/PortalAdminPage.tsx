import { useEffect, useState } from "react";
import { getMyIdentity, signOut, PortalIdentity } from "./supabase";

export default function PortalAdminPage() {
  const [identity, setIdentity] = useState<PortalIdentity | null>(null);
  const [error, setError] = useState("Checking administrator access…");

  useEffect(() => {
    let mounted = true;
    getMyIdentity()
      .then((user) => {
        if (!mounted) return;
        if (user.role !== "admin") {
          setError("Access denied. This page is only available to a trusted YSCMT administrator.");
          return;
        }
        setIdentity(user);
        setError("");
      })
      .catch((reason) => {
        if (mounted) setError(reason instanceof Error ? reason.message : "Please sign in again.");
      });
    return () => { mounted = false; };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white p-8 text-slate-900">
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-sm font-semibold tracking-widest text-blue-700">YSCMT ADMIN</p><h1 className="mt-2 text-2xl font-bold">Portal administration</h1></div>
          <button onClick={() => void signOut().then(() => window.location.assign("/portal/"))} className="rounded-lg border px-4 py-2 text-sm">Sign out</button>
        </div>
        {identity ? <div className="mt-6"><p className="font-semibold">Administrator identity verified.</p><p className="mt-2 text-sm text-slate-600">{identity.email}</p><p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Admin management actions remain disabled until their server-controlled RPCs, audit logging, and approval workflows have been completed and reviewed. No student records can be changed from this preview.</p></div> : <p role="status" className="mt-6 rounded-xl bg-slate-100 p-4 text-sm text-slate-700">{error}</p>}
      </div>
    </main>
  );
}
