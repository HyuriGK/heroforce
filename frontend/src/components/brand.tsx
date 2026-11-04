import { ShieldCheck } from "lucide-react";

export function Brand() {
  return (
    <div className="brand" aria-label="HeroForce">
      <span className="brand-mark" aria-hidden="true">
        <ShieldCheck size={24} strokeWidth={2.5} />
      </span>
      <span>
        <strong>Hero</strong>Force
      </span>
    </div>
  );
}
