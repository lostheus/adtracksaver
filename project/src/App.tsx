import { useState } from "react";
import { FormAdicionarLink, type MonitoredLink, predefinedNiches, predefinedTags } from "@/components/FormAdicionarLink";
import { LinkCard } from "@/components/LinkCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const nicheColorMap: Record<string, string> = {
  emagrecimento: "bg-emerald-100 text-emerald-800",
  ed: "bg-violet-100 text-violet-800",
  diabetes: "bg-rose-100 text-rose-800",
  prostata: "bg-amber-100 text-amber-800",
  neuropatia: "bg-blue-100 text-blue-800",
  receitas: "bg-pink-100 text-pink-800",
  low_ticket: "bg-slate-100 text-slate-800"
};

export default function Dashboard() {
  const [links, setLinks] = useState<MonitoredLink[]>([]);
  const [search, setSearch] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<MonitoredLink | null>(null);

  const onAddLink = (data: Omit<MonitoredLink, 'addedAt' | 'adsHistory'>) => {
    const now = new Date();
    const timestamp = now.toLocaleString();
    setLinks(prev => [
      ...prev,
      {
        ...data,
        addedAt: timestamp,
        adsHistory: [{ count: data.adsCount, changedAt: timestamp }]
      }
    ]);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditData({ ...links[index] });
  };

  const saveEdit = () => {
    if (editData && editingIndex !== null) {
      const now = new Date();
      const timestamp = now.toLocaleString();
      const original = links[editingIndex];
      const updatedHistory =
        editData.adsCount !== original.adsCount
          ? [...original.adsHistory, { count: editData.adsCount, changedAt: timestamp }]
          : original.adsHistory;

      const updatedLinks = [...links];
      updatedLinks[editingIndex] = {
        ...editData,
        adsHistory: updatedHistory
      };

      setLinks(updatedLinks);
      setEditingIndex(null);
      setEditData(null);
    }
  };

  const handleDelete = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };

  const filteredLinks = search.trim()
    ? links.filter(
        (link) =>
          link.tags.toLowerCase().includes(search.toLowerCase()) ||
          link.niches.some((niche) =>
            predefinedNiches.find((n) => n.key === niche)?.label.toLowerCase().includes(search.toLowerCase())
          )
      )
    : links;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                AdTrackSaver
              </h1>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar por tag ou nicho..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
            </div>
            <p className="text-gray-600">Monitoramento de Anúncios</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Adicionar Novo Link</h2>
            <FormAdicionarLink onAddLink={onAddLink} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLinks.map((link, index) => (
              <LinkCard
                key={index}
                link={link}
                index={index}
                editingIndex={editingIndex}
                editData={editData}
                predefinedTags={predefinedTags}
                nicheColorMap={nicheColorMap}
                startEdit={startEdit}
                saveEdit={saveEdit}
                setEditData={setEditData}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}