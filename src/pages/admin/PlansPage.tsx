import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";

const plans = [
  { name: "BASIC", users: 5, api: 10000, storage: 10, features: ["export_pdf", "api_access"] },
  { name: "PRO", users: 25, api: 100000, storage: 50, features: ["advanced_ai", "export_pdf", "multi_user", "api_access"] },
  { name: "ENTERPRISE", users: 200, api: 1000000, storage: 500, features: ["advanced_ai", "export_pdf", "multi_user", "api_access"] },
] as const;

export default function PlansPage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Layers className="h-6 w-6 text-blue-600" />
          Plans et Abonnements
        </h1>
        <p className="text-slate-500 mt-1">Catalogue des plans et de leurs quotas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card key={plan.name} className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700">
              <p>Utilisateurs max: {plan.users.toLocaleString("fr-FR")}</p>
              <p>API / mois: {plan.api.toLocaleString("fr-FR")}</p>
              <p>Stockage: {plan.storage} Go</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {plan.features.map((feature) => (
                  <Badge key={feature} variant="outline">{feature}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
