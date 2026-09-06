import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo() {
  return <Link to="/" className="logo"><span><Building2 size={22} /></span><strong>IfiteLodge</strong><em>NAU</em></Link>;
}
