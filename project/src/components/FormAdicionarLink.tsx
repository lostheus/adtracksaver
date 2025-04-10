import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus } from "lucide-react";

interface MonitoredLink {
  url: string;
  adsCount: number;
  adsHistory: { count: number; changedAt: string }[];
  tags: string;
  site: string;
  addedAt: string;
  niches: string[];
}

const predefinedTags = [
  "Muito escalado",
  "Testando",
  "Novo criativo",
  "Campanha antiga",
  "Top 1 concorrente"
];

const predefinedNiches = [
  { label: "Emagrecimento 🥗", key: "emagrecimento" },
  { label: "ED 🍆", key: "ed" },
  { label: "Diabetes 🩸", key: "diabetes" },
  { label: "Próstata 👴", key: "prostata" },
  { label: "Neuropatia ⚡", key: "neuropatia" },
  { label: "Receitas 🍽️", key: "receitas" },
  { label: "Low Ticket 💸", key: "low_ticket" }
];

interface FormAdicionarLinkProps {
  onAddLink: (data: Omit<MonitoredLink, 'addedAt' | 'adsHistory'>) => void;
}

export function FormAdicionarLink({ onAddLink }: FormAdicionarLinkProps) {
  const [input, setInput] = useState("");
  const [adsCount, setAdsCount] = useState("");
  const [tags, setTags] = useState("");
  const [site, setSite] = useState("");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);

  const toggleNiche = (key: string) => {
    setSelectedNiches((prev) =>
      prev.includes(key) ? prev.filter((n) => n !== key) : [...prev, key]
    );
  };

  const handleSubmit = () => {
    if (input && !isNaN(Number(adsCount))) {
      onAddLink({
        url: input,
        adsCount: Number(adsCount),
        tags,
        site,
        niches: selectedNiches,
      });
      setInput("");
      setAdsCount("");
      setTags("");
      setSite("");
      setSelectedNiches([]);
    }
  };

  const nicheColorMap: Record<string, string> = {
    emagrecimento: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
    ed: "bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-200",
    diabetes: "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200",
    prostata: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
    neuropatia: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    receitas: "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200",
    low_ticket: "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200"
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Link da Biblioteca</label>
          <Input 
            placeholder="Cole o link da biblioteca de anúncios" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Quantidade de Ads</label>
          <Input 
            placeholder="Número de anúncios ativos" 
            value={adsCount} 
            onChange={(e) => /^\d*$/.test(e.target.value) && setAdsCount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Site do Anunciante</label>
          <Input 
            placeholder="Link do site do anunciante" 
            value={site} 
            onChange={(e) => setSite(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Tag</label>
        <select 
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
          value={tags} 
          onChange={(e) => setTags(e.target.value)}
        >
          <option value="">Selecione uma tag</option>
          {predefinedTags.map((tag, idx) => (
            <option key={idx} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Nichos</label>
        <div className="flex flex-wrap gap-2">
          {predefinedNiches.map((n) => (
            <button
              key={n.key}
              type="button"
              onClick={() => toggleNiche(n.key)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors duration-200 ${
                selectedNiches.includes(n.key) 
                  ? nicheColorMap[n.key]
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      <Button 
        onClick={handleSubmit}
        className="w-full sm:w-auto flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Adicionar Link
      </Button>
    </div>
  );
}

export { predefinedNiches, predefinedTags };
export type { MonitoredLink };