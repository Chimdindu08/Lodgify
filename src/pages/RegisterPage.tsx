import { Eye, EyeOff, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { studentLevels } from "../lib/format";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password"));
    if (password !== String(data.get("confirmPassword"))) { setError("The passwords do not match."); setBusy(false); return; }
    try { await register({ fullName: String(data.get("fullName")), email: String(data.get("email")), password, level: String(data.get("level")) }); navigate("/submit", { replace: true }); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to create your account."); }
    finally { setBusy(false); }
  }
  return <div className="auth-page"><section className="auth-form-side"><div className="auth-box wide"><Logo /><span className="kicker">Join the community</span><h1>Create your account.</h1><p>Registration is required before submitting a lodge or review.</p>{error && <div className="notice error">{error}</div>}<form onSubmit={submit}><div className="form-two"><label>Full name<input name="fullName" autoComplete="name" required minLength={2} /></label><label>Year of study<select name="level" defaultValue="200 Level">{studentLevels.map((level) => <option key={level}>{level}</option>)}</select></label></div><label>Email address<input name="email" type="email" autoComplete="email" required /></label><div className="form-two"><label>Password<div className="password-field"><input name="password" type={show ? "text" : "password"} autoComplete="new-password" required minLength={8} /><button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff /> : <Eye />}</button></div></label><label>Confirm password<input name="confirmPassword" type={show ? "text" : "password"} autoComplete="new-password" required minLength={8} /></label></div><button className="button primary full" disabled={busy}>{busy ? "Creating account…" : <><UserPlus size={18} />Create account</>}</button></form><p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p></div></section><aside className="auth-photo"><img src="/lodges/PA-Fabin.jpg" alt="Student lodge near campus" /><div><UserPlus /><h2>Help students make a more informed choice.</h2><p>Your review can save someone from an expensive accommodation mistake.</p></div></aside></div>;
}
