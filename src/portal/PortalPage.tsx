import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  createEnrollment,
  getMyIdentity,
  hasPortalConfiguration,
  listCourses,
  PortalCourse,
  PortalIdentity,
  signIn,
  signOut,
} from "./supabase";

export default function PortalPage() {
  const [identity, setIdentity] = useState<PortalIdentity | null>(null);
  const [courses, setCourses] = useState<PortalCourse[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPortal = useCallback(async () => {
    const user = await getMyIdentity();
    if (user.role !== "student") {
      setIdentity(user);
      setCourses([]);
      return;
    }
    const available = await listCourses();
    setIdentity(user);
    setCourses(available);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function initialise() {
      if (!hasPortalConfiguration()) {
        setError("Portal setup is waiting for its Supabase public environment settings.");
        setLoading(false);
        return;
      }
      try {
        await loadPortal();
      } catch {
        if (mounted) setIdentity(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void initialise();
    return () => { mounted = false; };
  }, [loadPortal]);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const user = await signIn(email, password);
      setIdentity(user);
      if (user.role === "student") setCourses(await listCourses());
      else setCourses([]);
      setPassword("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function handleEnrol(courseId: string) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await createEnrollment(courseId);
      setCourses((current) => current.map((course) =>
        course.id === courseId ? { ...course, enrollment_status: result.status } : course
      ));
      setMessage("Your enrolment request has been submitted and is awaiting approval.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to submit enrolment.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    setIdentity(null);
    setCourses([]);
    setMessage("");
    setError("");
  }

  if (loading) {
    return <main className="min-h-screen grid place-items-center bg-slate-50 p-6 text-slate-600">Loading YSCMT Student Portal…</main>;
  }

  if (!identity) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white p-8 text-slate-900 shadow-2xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-blue-700">YSCMT COMMUNITY</p>
          <h1 className="mt-3 text-3xl font-bold">Student Portal</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in with the account provided by YSCMT.</p>
          {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <form onSubmit={handleSignIn} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">Email
              <input required type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600" />
            </label>
            <label className="block text-sm font-medium">Password
              <input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600" />
            </label>
            <button disabled={busy} className="w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
          </form>
          <p className="mt-6 text-xs leading-5 text-slate-500">New student accounts are issued by YSCMT administrators. Public self-registration is not enabled in this portal preview.</p>
        </div>
      </main>
    );
  }

  if (identity.role !== "student") {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-sm font-semibold text-blue-700">YSCMT PORTAL</p><h1 className="mt-2 text-2xl font-bold">Staff account detected</h1><p className="mt-2 text-slate-600">You are signed in as {identity.role}. The staff dashboard and its protected management APIs are being migrated separately.</p></div>
            <button onClick={() => void handleSignOut()} className="rounded-lg border px-4 py-2 text-sm">Sign out</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm font-semibold tracking-[0.2em] text-blue-700">YSCMT COMMUNITY</p><h1 className="mt-2 text-3xl font-bold">Student Portal</h1><p className="mt-1 text-slate-600">Welcome, {identity.full_name || identity.email}</p></div>
          <button onClick={() => void handleSignOut()} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100">Sign out</button>
        </header>
        {message && <p role="status" className="mt-6 rounded-xl bg-green-50 p-4 text-green-800">{message}</p>}
        {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between"><div><h2 className="text-xl font-bold">Available courses</h2><p className="mt-1 text-sm text-slate-500">Choose a course to request enrolment.</p></div><span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">{courses.length} courses</span></div>
          {courses.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">No active courses are available at the moment.</div> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const status = course.enrollment_status;
              return <article key={course.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{course.level || "YSCMT course"}</p>
                <h3 className="mt-2 text-lg font-bold">{course.title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{course.description || "Course details will be provided by the instructor."}</p>
                <p className="mt-4 font-semibold">{course.fee_amount == null ? "Contact YSCMT" : new Intl.NumberFormat("en-NG", { style: "currency", currency: course.fee_currency || "NGN", maximumFractionDigits: 0 }).format(Number(course.fee_amount))}</p>
                {status ? <span className="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold capitalize text-slate-700">{status}</span> : <button disabled={busy} onClick={() => void handleEnrol(course.id)} className="mt-5 w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60">Request enrolment</button>}
              </article>;
            })}
          </div>}
        </section>
      </div>
    </main>
  );
}
