import { Bot, AlertTriangle, Sparkles, TrendingUp, BrainCircuit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AiInsightsResult } from "@/hooks/useAiInsights";

interface Props {
  insights: AiInsightsResult;
}

function levelClass(level: "info" | "warning" | "critical") {
  if (level === "critical") return "bg-red-50 text-red-700 border-red-200";
  if (level === "warning") return "bg-orange-50 text-orange-700 border-orange-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export function AiInsightsPanel({ insights }: Props) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Bot className="h-4 w-4 text-blue-600" />
          Insights IA
        </CardTitle>
        <CardDescription>
          Détection d'anomalies, recommandations et prédictions basées sur vos données d'usage.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5 space-y-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500 flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5" />
            Détection d'anomalies
          </p>
          <div className="grid gap-2">
            {insights.anomalies.map((item) => (
              <div key={item.title} className={`rounded-lg border px-3 py-2 ${levelClass(item.level)}`}>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs mt-0.5">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500 flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5" />
            Prédictions
          </p>
          <div className="grid gap-2">
            {insights.predictions.map((item) => (
              <div key={item.title} className={`rounded-lg border px-3 py-2 ${levelClass(item.level)}`}>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs mt-0.5">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <p className="text-xs uppercase tracking-wide text-blue-700 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Recommandation de plan
          </p>
          <p className="text-sm font-semibold text-blue-800">{insights.recommendation.title}</p>
          <p className="text-xs text-blue-700">{insights.recommendation.description}</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500 flex items-center gap-2">
            <BrainCircuit className="h-3.5 w-3.5" />
            Analyse d'usage des features
          </p>
          <div className="flex flex-wrap gap-2">
            {insights.topFeatures.length === 0 ? (
              <Badge variant="outline">Aucune feature active</Badge>
            ) : (
              insights.topFeatures.map((feature) => (
                <Badge key={feature.key} variant="outline" className="bg-white">
                  {feature.label}: {feature.usageScore}%
                </Badge>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
