import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center mb-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/30">
            <Shield className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div>
          <p className="text-7xl font-black text-blue-400 leading-none">404</p>
          <h1 className="text-2xl font-bold mt-2 text-white">
            Page introuvable
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  );
}
