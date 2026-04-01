import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Settings, Bell, ShieldCheck, Globe, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UiSettings {
  language: "fr" | "en";
  notifyQuota: boolean;
  notifyExpiry: boolean;
  compactMode: boolean;
}

const STORAGE_KEY = "avaxia-ui-settings";

export default function SettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.name ?? "");
  const [email] = useState(user?.email ?? "");
  const [settings, setSettings] = useState<UiSettings>({
    language: "fr",
    notifyQuota: true,
    notifyExpiry: true,
    compactMode: false,
  });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as UiSettings;
      setSettings(parsed);
    } catch {
      // Ignore corrupted local preferences.
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    toast({
      title: "Parametres sauvegardes",
      description: "Vos preferences d'interface ont ete mises a jour.",
    });
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-600" />
          Settings
        </h1>
        <p className="text-slate-500 mt-1">
          Configuration du compte et des preferences de la plateforme.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Profil</CardTitle>
          <CardDescription>Informations d'affichage de votre compte.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Nom affiche</Label>
            <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled />
          </div>
          <p className="text-xs text-slate-500">
            Role: <span className="font-medium">{user?.role ?? "-"}</span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-blue-600" />
            Notifications
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <Label htmlFor="notifyQuota" className="cursor-pointer">Alerte depassement de quota</Label>
            <Checkbox
              id="notifyQuota"
              checked={settings.notifyQuota}
              onCheckedChange={(v) => setSettings((s) => ({ ...s, notifyQuota: !!v }))}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <Label htmlFor="notifyExpiry" className="cursor-pointer">Alerte expiration de licence</Label>
            <Checkbox
              id="notifyExpiry"
              checked={settings.notifyExpiry}
              onCheckedChange={(v) => setSettings((s) => ({ ...s, notifyExpiry: !!v }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-600" />
            Interface
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language">Langue</Label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value as "fr" | "en" }))}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="fr">Francais</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="flex items-end justify-between rounded-lg border border-slate-200 p-3">
            <Label htmlFor="compactMode" className="cursor-pointer">Mode compact</Label>
            <Checkbox
              id="compactMode"
              checked={settings.compactMode}
              onCheckedChange={(v) => setSettings((s) => ({ ...s, compactMode: !!v }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            Securite
          </CardTitle>
          <CardDescription>
            Parametres de securite geres par le service d'authentification.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <p className="text-sm text-slate-600">
            Pour changer votre mot de passe ou activer MFA, utilisez les endpoints du Auth Service.
          </p>
        </CardContent>
      </Card>

      <Button onClick={saveSettings} className="w-full sm:w-auto">
        <Save className="h-4 w-4 mr-2" />
        Enregistrer les settings
      </Button>
    </div>
  );
}
