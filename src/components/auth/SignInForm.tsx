import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Label from "../form/Label";
import Input from "../form/input/InputField";

export default function SignInForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("token/", { username, password });
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      navigate("/", { replace: true });
    } catch (requestError: any) {
      const detail = requestError?.response?.data?.detail;
      setError(detail || "Sign in failed. Check your username and password, then try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">
          Back to portal
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Student sign in</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Use your YSCMT username and password.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Username</Label>
            <Input id="username" name="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter your username" />
          </div>
          <div>
            <Label>Password</Label>
            <Input id="password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading || !username.trim() || !password} className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-5 text-sm text-gray-600 dark:text-gray-400">
          New to YSCMT? <Link to="/signup" className="text-brand-500 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
