import { useState } from "react";
import { X, XCircle } from "lucide-react";

interface DeclineJobModalProps {
  farmerName: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function DeclineJobModal({ farmerName, onClose, onConfirm }: DeclineJobModalProps) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-sm rounded-2xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground font-medium">Decline Job</h3>
          <button onClick={onClose} className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Declining job request from <strong className="text-foreground">{farmerName}</strong>. Please provide a reason (required).
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Schedule conflict, equipment unavailable, distance too far…"
          className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm text-foreground outline-none resize-none h-24 focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 border border-border rounded-xl py-3 text-sm text-foreground hover:bg-secondary">Cancel</button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-destructive text-destructive-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-40"
          >
            <XCircle className="w-4 h-4" /> Decline Job
          </button>
        </div>
      </div>
    </div>
  );
}
