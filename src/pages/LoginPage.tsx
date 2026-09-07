import { Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    try {
      const signedInUser = await login(String(data.get("email")), String(data.get("password")));
      const requestedPage = (location.state as { from?: string } | null)?.from;
      navigate(signedInUser.role === "admin" ? "/admin" : requestedPage || "/history", { replace: true });
    }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to sign in."); }
    finally { setBusy(false); }
  }
  return <div className="auth-page"><section className="auth-form-side"><div className="auth-box"><Logo /><span className="kicker">Student account</span><h1>Welcome back.</h1><p>Sign in to submit lodge reviews and see everything you have shared.</p>{error && <div className="notice error">{error}</div>}<form onSubmit={submit}><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label><label>Password<div className="password-field"><input name="password" type={show ? "text" : "password"} autoComplete="current-password" required /><button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff /> : <Eye />}</button></div></label><button className="button primary full" disabled={busy}>{busy ? "Signing in…" : <><LogIn size={18} />Sign in</>}</button></form><p className="auth-switch">No account yet? <Link to="/register">Create one</Link></p></div></section><aside className="auth-photo"><img src="/lodges/prince-and-princess.jpg" alt="Student lodge building" /><div><ShieldCheck /><h2>Your contributions stay connected to your account.</h2><p>Submit once, return anytime, and review your complete lodge history.</p></div></aside></div>;
}
