import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText } from "lucide-react";

const mockEvents = [
  { id: 1, event: "License created", actor: "admin@avaxia.com", at: "2026-03-20 09:12" },
  { id: 2, event: "License suspended", actor: "admin@avaxia.com", at: "2026-03-21 14:40" },
  { id: 3, event: "Usage anomaly detected", actor: "ai-engine", at: "2026-03-22 11:05" },
];

export default function AuditPage() {
  return (
    <div className="w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-blue-600" />
          Audit et Historique
        </h1>
        <p className="text-slate-500 mt-1">Evenements critiques de licences et actions administratives.</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Derniers evenements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockEvents.map((event) => (
            <div key={event.id} className="rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-semibold text-slate-800">{event.event}</p>
              <p className="text-slate-500">{event.actor} • {event.at}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
