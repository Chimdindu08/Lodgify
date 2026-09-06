import { History, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LodgeCard from "../components/LodgeCard";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import type { LodgeList } from "../lib/types";

export default function HistoryPage() {
  const { user } = useAuth();
  const [data, setData] = useState<LodgeList>({ items: [], total: 0 });
  const [error, setError] = useState("");
  useEffect(() => { api<LodgeList>("/users/me/submissions").then(setData).catch((err) => setError(err.message)); }, []);
  return <div className="page container"><div className="page-heading-row"><div><span className="kicker">Your account</span><h1>Submission history</h1><p>{user?.fullName}, every lodge review you submit appears here.</p></div><Link to="/submit" className="button primary"><PlusCircle size={18} />New submission</Link></div>{error && <div className="notice error">{error}</div>}{data.items.length ? <div className="lodge-grid">{data.items.map((lodge) => <LodgeCard key={lodge.id} lodge={lodge} />)}</div> : <div className="empty-card"><History /><h3>No submissions yet</h3><p>Once you share a lodge review, it will remain available in this history.</p><Link to="/submit" className="button primary">Submit your first lodge</Link></div>}</div>;
}
