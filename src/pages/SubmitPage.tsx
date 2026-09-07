import { Building2, Camera, CheckCircle2, FileText, Info, MapPin, Star, UploadCloud, X } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { areas, roomTypes } from "../lib/format";
import type { Lodge, Ratings } from "../lib/types";

const ratingLabels: { key: keyof Ratings; label: string }[] = [
  { key: "security", label: "Security" }, { key: "water", label: "Water supply" },
  { key: "electricity", label: "Electricity" }, { key: "cleanliness", label: "Cleanliness" },
  { key: "management", label: "Management" }, { key: "value", label: "Value for money" },
];

export default function SubmitPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Ratings>({ security: 0, water: 0, electricity: 0, cleanliness: 0, management: 0, value: 0 });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { const urls = files.map((file) => URL.createObjectURL(file)); setPreviews(urls); return () => urls.forEach(URL.revokeObjectURL); }, [files]);
  function chooseImages(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    if (selected.some((file) => file.size > 5 * 1024 * 1024)) { setError("Each image must be 5 MB or smaller."); return; }
    if (files.length + selected.length > 5) { setError("You can upload a maximum of five images."); return; }
    setFiles((current) => [...current, ...selected]); setError(""); event.target.value = "";
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!files.length) { setError("Upload at least one clear lodge photo."); return; }
    if (Object.values(ratings).some((value) => value === 0)) { setError("Rate all six lodge categories."); return; }
    setBusy(true);
    const raw = new FormData(event.currentTarget);
    const form = new FormData();
    ["name","area","address","distance","roomType","annualRent","waterSupply","powerSupply","security","academicSession","reviewText"].forEach((key) => form.append(key, String(raw.get(key) || "")));
    form.append("ratings", JSON.stringify(ratings));
    files.forEach((file) => form.append("images", file));
    try {
      await api<Lodge>("/lodges", { method: "POST", body: form });
      navigate("/history", { replace: true, state: { submitted: true } });
    }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to submit the lodge."); window.scrollTo({ top: 0, behavior: "smooth" }); }
    finally { setBusy(false); }
  }

  return <div className="page submit-page"><div className="container"><div className="submit-heading"><span className="kicker"><CheckCircle2 size={15} />Registered contribution</span><h1>Share a lodge experience.</h1><p>Give students specific, fair information based on what you personally observed.</p></div><div className="notice moderation-note"><Info size={18} /><span><strong>Administrator review required.</strong> Your submission will remain private until an administrator verifies and approves it.</span></div>{error && <div className="notice error">{error}</div>}<form className="submission-form" onSubmit={submit}><section className="form-section"><div className="form-section-head"><span><Building2 /></span><div><h2>Lodge details</h2><p>Help students identify the exact property.</p></div></div><div className="form-grid"><label>Lodge name<input name="name" required minLength={2} placeholder="Example: Grace Court Lodge" /></label><label>Area<select name="area" required defaultValue=""><option value="" disabled>Select area</option>{areas.slice(1).map((area) => <option key={area}>{area}</option>)}</select></label><label className="wide">Street or full address<div className="input-icon"><MapPin size={17} /><input name="address" required minLength={4} placeholder="Street, landmark and area" /></div></label><label>Distance to main gate<input name="distance" required placeholder="Example: 5 minutes on foot" /></label><label>Room type<select name="roomType" defaultValue="Self-contained">{roomTypes.slice(1).map((type) => <option key={type}>{type}</option>)}</select></label><label>Approximate annual rent<input name="annualRent" type="number" min="0" step="1000" required placeholder="Amount in naira" /></label><label>Academic session<input name="academicSession" required placeholder="Example: 2025/2026" /></label></div></section><section className="form-section"><div className="form-section-head"><span><Info /></span><div><h2>Facilities and safety</h2><p>Use short, factual descriptions.</p></div></div><div className="form-grid"><label>Water supply<input name="waterSupply" required placeholder="Example: Borehole, morning and evening" /></label><label>Power supply<input name="powerSupply" required placeholder="Example: NEPA and generator" /></label><label className="wide">Security arrangements<input name="security" required placeholder="Example: Gateman, fence and locked gate" /></label></div></section><section className="form-section"><div className="form-section-head"><span><Star /></span><div><h2>Rate your experience</h2><p>Select one to five for every category.</p></div></div><div className="ratings-grid">{ratingLabels.map(({ key, label }) => <div className="rating-control" key={key}><span>{label}</span><div>{[1,2,3,4,5].map((value) => <button type="button" key={value} className={value <= ratings[key] ? "selected" : ""} onClick={() => setRatings((current) => ({ ...current, [key]: value }))} aria-label={`Rate ${label} ${value} out of 5`}><Star fill="currentColor" /></button>)}</div><strong>{ratings[key] ? `${ratings[key]}/5` : "Not rated"}</strong></div>)}</div></section><section className="form-section"><div className="form-section-head"><span><Camera /></span><div><h2>Photos and written review</h2><p>Images are uploaded to Cloudinary and remain available after refresh.</p></div></div><label className="upload-zone"><UploadCloud /><strong>Choose lodge photos</strong><span>JPEG, PNG or WebP · Up to five files · 5 MB each</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={chooseImages} /></label>{previews.length > 0 && <div className="preview-grid">{previews.map((preview,index) => <div key={preview}><img src={preview} alt={`Selected lodge photo ${index + 1}`} /><button type="button" onClick={() => setFiles((current) => current.filter((_,itemIndex) => itemIndex !== index))} aria-label="Remove image"><X /></button></div>)}</div>}<label className="review-field"><FileText size={18} />Your review<textarea name="reviewText" required minLength={30} maxLength={2000} rows={7} placeholder="Describe water, power, security, room condition, management and anything a new tenant should know." /><span>Minimum 30 characters. Keep it honest and respectful.</span></label></section><div className="submit-actions"><p>By submitting, you confirm this review reflects your own experience.</p><button className="button primary" disabled={busy}>{busy ? "Uploading and saving…" : <><UploadCloud size={18} />Send for admin approval</>}</button></div></form></div></div>;
}
