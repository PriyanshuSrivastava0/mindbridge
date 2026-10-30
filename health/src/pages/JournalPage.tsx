import { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Lock, 
  Sparkles, 
  Download, 
  Trash2, 
  Search, 
  ShieldCheck,
} from 'lucide-react';
import { db } from '../services/db/mockDatabase';
import { useAuth } from '../context/AuthContext';
import { JournalEntry } from '../types';
import confetti from 'canvas-confetti';

const AI_PROMPTS = [
  "What is one small thing that brought you comfort or calm today?",
  "Write down the single thought that has been repeating in your head, and then write one gentle counter-argument.",
  "If your best friend were going through the exact stress you are feeling right now, what would you say to them?",
  "What expectations are you currently holding yourself to that you might be ready to soften?"
];

export function JournalPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>(db.journalEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(AI_PROMPTS[0]);

  const handleSave = () => {
    if (!content.trim()) return;

    void db.addJournalEntry({
      userId: user.id,
      title: title.trim() || 'Reflection on ' + new Date().toLocaleDateString(),
      content: content.trim(),
      aiReflectionPrompt: selectedPrompt,
      sentiment: 'reflective',
      tags: ['Personal', 'Mindfulness']
    });

    setEntries([...db.journalEntries]);
    setTitle('');
    setContent('');
    setIsCreating(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this private entry permanently?")) {
      // eslint-disable-next-line react-hooks/immutability
      db.journalEntries = db.journalEntries.filter(e => e.id !== id);
      db.persist();
      setEntries([...db.journalEntries]);
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mindbridge_journal_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filtered = entries.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-[#303F70] text-xs font-bold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Encrypted & Private Journaling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20283D] tracking-tight">
            Personal Reflection Space
          </h1>
          <p className="text-xs sm:text-sm text-[#697386] mt-1">
            Your entries are private to you. They are never shared with employers, universities, or therapists without your active, explicit consent.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportData}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5"
            title="Export all entries to JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Entries</span>
          </button>

          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold shadow-sm flex items-center space-x-1.5 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Reflection</span>
          </button>
        </div>
      </div>

      {/* Editor Modal / Card */}
      {isCreating && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#20283D]">Write Private Reflection</h3>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Cancel
            </button>
          </div>

          {/* AI Writing Prompt helper */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-[#A99CE0] shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <span className="font-bold text-[#303F70] block mb-1">Optional Reflection Prompt:</span>
              <p className="text-[#20283D] mb-2">{selectedPrompt}</p>
              <div className="flex flex-wrap gap-1.5">
                {AI_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPrompt(p)}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-white border border-indigo-200/80 text-[#303F70] hover:bg-[#303F70] hover:text-white transition-colors"
                  >
                    Prompt {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <input
            type="text"
            placeholder="Title (Optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm font-bold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#303F70]/20"
          />

          <textarea
            rows={8}
            placeholder="Let your thoughts flow freely without judgment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-xs sm:text-sm p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#303F70]/20"
          />

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Stored with client-side encryption</span>
            </div>

            <button
              onClick={handleSave}
              disabled={!content.trim()}
              className="px-6 py-2.5 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold disabled:opacity-40 shadow-sm transition-transform active:scale-95"
            >
              Save Private Entry
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search through your entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs py-2.5 pl-10 pr-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#303F70]/20 shadow-xs"
        />
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#20283D]">{entry.title}</h3>
                  <span className="text-[11px] text-[#697386]">
                    {new Date(entry.createdAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {entry.aiReflectionPrompt && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-[#697386] italic">
                  Prompt: "{entry.aiReflectionPrompt}"
                </div>
              )}

              <p className="text-xs sm:text-sm text-[#20283D] whitespace-pre-wrap leading-relaxed">
                {entry.content}
              </p>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h4 className="text-base font-bold text-[#20283D]">Your Journal is Clear</h4>
            <p className="text-xs text-[#697386] max-w-sm mx-auto mt-1 mb-6">
              Writing down your thoughts helps clear cognitive overload and untangle heavy emotions.
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-5 py-2.5 rounded-xl bg-[#303F70] text-white text-xs font-bold shadow-sm"
            >
              Create Your First Entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
