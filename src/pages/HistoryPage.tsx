import { AlertCircle, BadgeCheck, Ban, Clock3, History, MapPin, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { money } from "../lib/format";
import type { LodgeList } from "../lib/types";

const statusDetails = {
  pending: { label: "Awaiting admin review", icon: Clock3 },
  published: { label: "Approved and public", icon: BadgeCheck },
  rejected: { label: "Needs correction", icon: Ban },
};

export default function HistoryPage() {
  const { user } = useAuth();
  const location = useLocation();
  const submitted = Boolean((location.state as { submitted?: boolean } | null)?.submitted);
  const [data, setData] = useState<LodgeList>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api<LodgeList>("/users/me/submissions")
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page container">
      <div className="page-heading-row">
        <div><span className="kicker">Your account</span><h1>Submission history</h1><p>{user?.fullName}, track the approval status of every lodge review you submit.</p></div>
        <Link to="/submit" className="button primary"><PlusCircle size={18} />New submission</Link>
      </div>
      {submitted && <div className="notice success"><Clock3 size={18} /><span><strong>Submission received.</strong> It is private while an administrator checks it. You will see the updated status here.</span></div>}
      {error && <div className="notice error">{error}</div>}
      {loading ? <div className="page-loading">Loading your submissions…</div> : data.items.length ? (
        <div className="history-list">
          {data.items.map((lodge) => {
            const status = statusDetails[lodge.status];
            const StatusIcon = status.icon;
            return (
              <article className="history-item" key={lodge.id}>
                <img src={lodge.photos[0]} alt={lodge.name} />
                <div className="history-item-body">
                  <span className={`history-status ${lodge.status}`}><StatusIcon />{status.label}</span>
                  <h2>{lodge.name}</h2>
                  <p className="history-location"><MapPin />{lodge.address}</p>
                  <p className="history-review">{lodge.reviewText}</p>
                  {lodge.status === "rejected" && lodge.rejectionReason && <div className="history-reason"><AlertCircle /><span><strong>Administrator feedback:</strong> {lodge.rejectionReason}</span></div>}
                  <div className="history-item-foot"><span>{money(lodge.annualRent)} per year</span><span>Submitted {new Date(lodge.createdAt).toLocaleDateString("en-NG", { dateStyle: "medium" })}</span>{lodge.status === "published" && <Link to={`/lodges/${lodge.id}`}>View public page</Link>}</div>
                </div>
              </article>
            );
          })}
        </div>
      ) : <div className="empty-card"><History /><h3>No submissions yet</h3><p>Once you share a lodge review, its approval status will appear here.</p><Link to="/submit" className="button primary">Submit your first lodge</Link></div>}
    </div>
  );
}
