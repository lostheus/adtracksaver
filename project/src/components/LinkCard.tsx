import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, ExternalLink, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import type { MonitoredLink } from "./FormAdicionarLink";
import { predefinedNiches } from "./FormAdicionarLink";

interface LinkCardProps {
  link: MonitoredLink;
  index: number;
  editingIndex: number | null;
  editData: MonitoredLink | null;
  predefinedTags: string[];
  nicheColorMap: Record<string, string>;
  startEdit: (index: number) => void;
  saveEdit: () => void;
  setEditData: (data: MonitoredLink) => void;
  onDelete: (index: number) => void;
}

export function LinkCard({ 
  link, 
  index, 
  editingIndex, 
  editData, 
  predefinedTags, 
  nicheColorMap, 
  startEdit, 
  saveEdit, 
  setEditData, 
  onDelete 
}: LinkCardProps) {
  const isEditing = editingIndex === index;

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-6 space-y-4">
        {isEditing && editData ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Link da Biblioteca</label>
              <Input value={editData.url} onChange={(e) => setEditData({ ...editData, url: e.target.value })} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quantidade de Ads</label>
              <Input value={editData.adsCount} type="number" onChange={(e) => setEditData({ ...editData, adsCount: parseInt(e.target.value) })} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tag</label>
              <select 
                value={editData.tags} 
                onChange={(e) => setEditData({ ...editData, tags: e.target.value })} 
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {predefinedTags.map((tag: string) => <option key={tag} value={tag}>{tag}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Site do Anunciante</label>
              <Input value={editData.site} onChange={(e) => setEditData({ ...editData, site: e.target.value })} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nichos</label>
              <div className="flex flex-wrap gap-2">
                {predefinedNiches.map((niche) => (
                  <button
                    key={niche.key}
                    type="button"
                    onClick={() => {
                      const exists = editData.niches.includes(niche.key);
                      setEditData({
                        ...editData,
                        niches: exists ? editData.niches.filter((n) => n !== niche.key) : [...editData.niches, niche.key]
                      });
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors duration-200 ${
                      editData.niches.includes(niche.key) 
                        ? nicheColorMap[niche.key] 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {niche.label}
                  </button>
                ))}
              </div>
            </div>
            
            <Button onClick={saveEdit} className="w-full">Salvar Alterações</Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  {link.tags}
                </span>
                {link.niches.map((nicheKey: string, i: number) => (
                  <span 
                    key={i} 
                    className={`px-2.5 py-1 rounded-full text-sm font-medium ${nicheColorMap[nicheKey] || 'bg-slate-100 text-slate-800'}`}
                  >
                    {predefinedNiches.find(n => n.key === nicheKey)?.label || nicheKey}
                  </span>
                ))}
              </div>
              
              <div className="space-y-2 w-full">
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  Biblioteca de Anúncios
                </a>
                
                <a 
                  href={link.site} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  Site do Anunciante
                </a>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-600" />
                {link.adsCount} anúncios ativos
              </div>
              
              {link.adsHistory && link.adsHistory.length > 1 && (
                <ul className="space-y-2 text-sm">
                  {link.adsHistory.map((entry, i) => {
                    const previous = link.adsHistory[i - 1]?.count ?? entry.count;
                    const trend = entry.count > previous ? 'text-emerald-600' : entry.count < previous ? 'text-rose-600' : 'text-gray-600';
                    const TrendIcon = entry.count > previous ? TrendingUp : entry.count < previous ? TrendingDown : ArrowRight;
                    return (
                      <li key={i} className={`${trend} flex items-center gap-1`}>
                        <TrendIcon className="h-4 w-4" />
                        <span>{entry.count} ads em {entry.changedAt}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 italic">
                  Adicionado em: {link.addedAt}
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => startEdit(index)}
                    className="flex items-center gap-1"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => onDelete(index)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}