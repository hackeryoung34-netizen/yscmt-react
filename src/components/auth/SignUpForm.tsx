import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Label from "../form/Label";
import Input from "../form/input/InputField";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the terms before creating your account.");
      return;
    }

    setLoading(true);
    try {
      await api.post("auth/register/", { username, email, password });
      const login = await api.post("token/", { username, password });
      localStorage.setItem("access", login.data.access);
      localStorage.setItem("refresh", login.data.refresh);
      navigate("/", { replace: true });
    } catch (requestError: any) {
      const data = requestError?.response?.data;
      const message = data?.detail || data?.email?.[0] || data?.username?.[0] || data?.password?.[0];
      setError(message || "Account creation failed. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-1 flex-col overflow-y-auto no-scrollbar">
      <div className="mx-auto mb-5 w-full max-w-md sm:pt-10">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">
          Back to portal
        </Link>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Create your YSCMT account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Register to access your courses and learning progress.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Username</Label>
            <Input id="username" name="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Choose a username" />
          </div>
          <div>
            <Label>Email address</Label>
            <Input id="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" />
          </div>
          <div>
            <Label>Password</Label>
            <Input id="password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a strong password" />
          </div>
          <div>
            <Label>Confirm password</Label>
            <Input id="confirm-password" name="confirmPassword" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Enter your password again" />
          </div>
          <label className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
            <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1" />
            <span>I agree to the YSCMT terms and privacy policy.</span>
          </label>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading || !username.trim() || !email.trim() || !password || !confirmPassword} className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-5 text-sm text-gray-600 dark:text-gray-400">
          Already registered? <Link to="/signin" className="text-brand-500 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
