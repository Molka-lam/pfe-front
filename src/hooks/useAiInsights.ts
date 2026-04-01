import { License, UsageStats } from "@/types";

export interface AiInsight {
  level: "info" | "warning" | "critical";
  title: string;
  description: string;
}

export interface AiInsightsResult {
  anomalies: AiInsight[];
  predictions: AiInsight[];
  recommendation: AiInsight;
  topFeatures: Array<{ key: string; label: string; usageScore: number }>;
}

const FEATURE_LABELS: Record<string, string> = {
  advanced_ai: "IA avancée",
  export_pdf: "Export PDF",
  multi_user: "Multi-utilisateurs",
  api_access: "Accès API",
};

export function buildAiInsights(license: License, usage: UsageStats): AiInsightsResult {
  const apiRate = usage.api_calls_limit > 0 ? usage.api_calls_used / usage.api_calls_limit : 0;
  const userRate = usage.users_limit > 0 ? usage.users_count / usage.users_limit : 0;
  const storageRate = usage.storage_limit_gb > 0 ? usage.storage_used_gb / usage.storage_limit_gb : 0;

  const anomalies: AiInsight[] = [];
  if (apiRate >= 0.9) {
    anomalies.push({
      level: "critical",
      title: "Anomalie: appels API très élevés",
      description: "Le tenant dépasse 90% du quota API mensuel, un risque de blocage est imminent.",
    });
  } else if (apiRate >= 0.75) {
    anomalies.push({
      level: "warning",
      title: "Pic d'usage API détecté",
      description: "La consommation API est plus élevée que la normale pour ce plan.",
    });
  }

  if (storageRate >= 0.85) {
    anomalies.push({
      level: "warning",
      title: "Stockage proche de la limite",
      description: "Le stockage utilisé dépasse 85% de la capacité allouée.",
    });
  }

  if (userRate >= 1) {
    anomalies.push({
      level: "critical",
      title: "Capacité utilisateurs atteinte",
      description: "Le nombre d'utilisateurs actifs atteint la limite autorisée.",
    });
  }

  if (anomalies.length === 0) {
    anomalies.push({
      level: "info",
      title: "Aucune anomalie majeure",
      description: "Les indicateurs d'usage actuels sont dans une plage normale.",
    });
  }

  const daysToLimitApi =
    usage.api_calls_used > 0
      ? Math.max(
          0,
          Math.round(((usage.api_calls_limit - usage.api_calls_used) / usage.api_calls_used) * 30)
        )
      : 30;
  const daysToExpiry = Math.max(
    0,
    Math.ceil(
      (new Date(license.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  const predictions: AiInsight[] = [
    {
      level: daysToLimitApi <= 7 ? "warning" : "info",
      title: "Prédiction de dépassement quota API",
      description:
        daysToLimitApi <= 0
          ? "Le quota API semble déjà dépassé selon le rythme actuel."
          : `Dépassement estimé dans ${daysToLimitApi} jour(s) au rythme actuel.`,
    },
    {
      level: daysToExpiry <= 15 ? "warning" : "info",
      title: "Prédiction d'expiration licence",
      description: `La licence expire dans ${daysToExpiry} jour(s).`,
    },
  ];

  const recommendationPlan: License["plan"] =
    apiRate > 0.85 || storageRate > 0.85 || userRate > 0.85
      ? license.plan === "BASIC"
        ? "PRO"
        : "ENTERPRISE"
      : license.plan;

  const recommendation: AiInsight =
    recommendationPlan === license.plan
      ? {
          level: "info",
          title: "Recommandation de plan",
          description: `Le plan ${license.plan} reste adapté à votre usage actuel.`,
        }
      : {
          level: "warning",
          title: "Recommandation de plan",
          description: `Un upgrade vers ${recommendationPlan} est conseillé pour absorber la croissance d'usage.`,
        };

  const topFeatures = Object.entries(license.features)
    .filter(([, enabled]) => enabled)
    .map(([key]) => {
      let usageScore = 50;
      if (key === "api_access") usageScore = Math.round(apiRate * 100);
      if (key === "multi_user") usageScore = Math.round(userRate * 100);
      if (key === "advanced_ai") usageScore = Math.round((apiRate + storageRate) * 50);
      if (key === "export_pdf") usageScore = Math.round((storageRate + 0.25) * 80);
      return {
        key,
        label: FEATURE_LABELS[key] ?? key,
        usageScore: Math.max(1, Math.min(100, usageScore)),
      };
    })
    .sort((a, b) => b.usageScore - a.usageScore)
    .slice(0, 3);

  return {
    anomalies,
    predictions,
    recommendation,
    topFeatures,
  };
}
