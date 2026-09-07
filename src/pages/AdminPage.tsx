import {
  BadgeCheck,
  Ban,
  Building2,
  Check,
  Clock3,
  ExternalLink,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Star,
  UserRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { money } from "../lib/format";
import type { AdminStats, Lodge, LodgeList } from "../lib/types";
import "./AdminPage.css";

type Filter = "pending" | "published" | "rejected" | "all";

const filters: { value: Filter; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "published", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All submissions" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminPage() {
  const [filter, setFilter] = useState<Filter>("pending");
  const [stats, setStats] = useState<AdminStats>({ total: 0, pending: 0, published: 0, rejected: 0 });
  const [submissions, setSubmissions] = useState<Lodge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");
  const [rejectingId, setRejectingId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextStats, list] = await Promise.all([
        api<AdminStats>("/admin/stats"),
        api<LodgeList>(`/admin/submissions?status=${filter}`),
      ]);
      setStats(nextStats);
      setSubmissions(list.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load the admin dashboard.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  async function moderate(id: string, status: "published" | "rejected", reason = "") {
    setBusyId(id);
    setError("");
    setMessage("");
    try {
      await api<Lodge>(`/admin/submissions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, reason }),
      });
      setMessage(status === "published" ? "Submission approved and published successfully." : "Submission rejected successfully.");
      setRejectingId("");
      setRejectionReason("");
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update the submission.");
    } finally {
      setBusyId("");
    }
  }

  const statCards = [
    { label: "All submissions", value: stats.total, icon: Building2, tone: "blue" },
    { label: "Awaiting review", value: stats.pending, icon: Clock3, tone: "amber" },
    { label: "Published", value: stats.published, icon: BadgeCheck, tone: "green" },
    { label: "Rejected", value: stats.rejected, icon: Ban, tone: "red" },
  ];

  return (
    <div className="admin-page">
      <section className="admin-hero">
        <div className="container admin-hero-inner">
          <div>
            <span className="admin-eyebrow"><ShieldCheck size={15} />Administrator workspace</span>
            <h1>Review before it goes public.</h1>
            <p>Verify student lodge submissions, approve reliable information and keep unsuitable content off the public directory.</p>
          </div>
          <button className="admin-refresh" onClick={() => void loadDashboard()} disabled={loading}>
            <RefreshCw size={17} className={loading ? "spinning" : ""} />Refresh
          </button>
        </div>
      </section>

      <div className="container admin-content">
        <section className="admin-stats" aria-label="Submission statistics">
          {statCards.map(({ label, value, icon: Icon, tone }) => (
            <article key={label}>
              <span className={`admin-stat-icon ${tone}`}><Icon /></span>
              <div><strong>{value}</strong><span>{label}</span></div>
            </article>
          ))}
        </section>

        <section className="admin-worklist">
          <div className="admin-worklist-head">
            <div><span className="kicker">Moderation queue</span><h2>Lodge submissions</h2></div>
            <div className="admin-tabs" role="tablist" aria-label="Filter submissions">
              {filters.map((item) => (
                <button key={item.value} role="tab" aria-selected={filter === item.value} className={filter === item.value ? "active" : ""} onClick={() => setFilter(item.value)}>
                  {item.label}{item.value === "pending" && stats.pending > 0 && <span>{stats.pending}</span>}
                </button>
              ))}
            </div>
          </div>

          {message && <div className="notice success"><Check size={18} />{message}</div>}
          {error && <div className="notice error">{error}</div>}

          {loading ? <div className="admin-loading">Loading submissions…</div> : submissions.length === 0 ? (
            <div className="empty-card"><BadgeCheck /><h3>Nothing in this queue</h3><p>There are currently no {filter === "all" ? "" : filter} submissions to review.</p></div>
          ) : (
            <div className="admin-submission-list">
              {submissions.map((lodge) => (
                <article className="admin-submission" key={lodge.id}>
                  <div className="admin-submission-image">
                    <img src={lodge.photos[0]} alt={lodge.name} />
                    {lodge.photos.length > 1 && <span>+{lodge.photos.length - 1} photos</span>}
                  </div>
                  <div className="admin-submission-body">
                    <div className="admin-submission-title">
                      <div><span className={`submission-status ${lodge.status}`}>{lodge.status}</span><h3>{lodge.name}</h3></div>
                      <strong><Star size={15} fill="currentColor" />{lodge.overallRating.toFixed(1)}</strong>
                    </div>
                    <div className="admin-meta-row">
                      <span><MapPin />{lodge.address}</span>
                      <span><Building2 />{lodge.roomType}</span>
                      <span>{money(lodge.annualRent)} yearly</span>
                    </div>
                    <p className="admin-review-text">“{lodge.reviewText}”</p>
                    <div className="admin-reviewer">
                      <span><UserRound /></span>
                      <div><strong>{lodge.author.name}</strong><small>{lodge.author.level} · Submitted {formatDate(lodge.createdAt)}</small></div>
                    </div>
                    {lodge.status === "rejected" && lodge.rejectionReason && <div className="admin-rejection"><Ban size={16} /><span><strong>Reason:</strong> {lodge.rejectionReason}</span></div>}

                    {rejectingId === lodge.id && (
                      <div className="admin-reject-form">
                        <label htmlFor={`reason-${lodge.id}`}>Reason for rejection</label>
                        <textarea id={`reason-${lodge.id}`} rows={3} maxLength={300} value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} placeholder="Explain what must be corrected before this can be published." />
                        <div><button className="button secondary" onClick={() => { setRejectingId(""); setRejectionReason(""); }}><X size={16} />Cancel</button><button className="button danger" disabled={!rejectionReason.trim() || busyId === lodge.id} onClick={() => void moderate(lodge.id, "rejected", rejectionReason.trim())}><Ban size={16} />Confirm rejection</button></div>
                      </div>
                    )}
                  </div>
                  <footer className="admin-submission-actions">
                    {lodge.status === "published" && <Link to={`/lodges/${lodge.id}`} target="_blank">View public page<ExternalLink size={15} /></Link>}
                    {lodge.status !== "published" && <button className="button approve" disabled={busyId === lodge.id} onClick={() => void moderate(lodge.id, "published")}><Check size={17} />{busyId === lodge.id ? "Approving…" : "Approve and publish"}</button>}
                    {lodge.status !== "rejected" && <button className="button reject" disabled={busyId === lodge.id} onClick={() => { setRejectingId(lodge.id); setRejectionReason(""); }}><Ban size={17} />Reject</button>}
                  </footer>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
