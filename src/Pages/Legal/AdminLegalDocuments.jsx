import { useEffect, useState } from "react";
import { Loader2, Save, FileText } from "lucide-react";
import { apiGet, apiPost } from "../../lib/api";

const documents = [
  { key: "privacy-policy", title: "Privacy Policy", path: "/privacy-policy" },
  { key: "terms", title: "Terms and Conditions", path: "/termsandcondition" }
];

export default function AdminLegalDocuments() {
  const [forms, setForms] = useState({
    "privacy-policy": { title: "Privacy Policy", content: "", version: "" },
    terms: { title: "Terms of Use", content: "", version: "" }
  });
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [privacy, terms] = await Promise.all([
          apiGet("/legal/privacy-policy"),
          apiGet("/legal/terms")
        ]);
        setForms({
          "privacy-policy": {
            title: privacy.data?.title || "Privacy Policy",
            content: privacy.data?.content || "",
            version: privacy.data?.version || ""
          },
          terms: {
            title: terms.data?.title || "Terms of Use",
            content: terms.data?.content || "",
            version: terms.data?.version || ""
          }
        });
      } catch (err) {
        setError(err.message || "Unable to load legal documents");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateField = (key, field, value) => {
    setForms((current) => ({
      ...current,
      [key]: { ...current[key], [field]: value }
    }));
  };

  const handleSave = async (key) => {
    const current = forms[key];
    if (!current.content.trim()) {
      setError("Content is required.");
      return;
    }
    setSavingKey(key);
    setNotice("");
    setError("");
    try {
      const response = await apiPost(`/legal/${key}`, {
        title: current.title,
        content: current.content,
        version: current.version || undefined
      });
      setForms((items) => ({
        ...items,
        [key]: {
          title: response.data.title,
          content: response.data.content,
          version: response.data.version
        }
      }));
      setNotice(`${current.title} published. The public page now shows this version.`);
    } catch (err) {
      setError(err.message || "Unable to publish this document");
    } finally {
      setSavingKey("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-sans text-[#1e293b]">
      <div className="mb-8">
        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Legal</p>
        <h1 className="text-3xl font-bold tracking-tight">Privacy & Terms</h1>
        <p className="mt-2 text-sm text-[#64748b]">
          Publish the documents shown on the public /privacy-policy and /termsandcondition pages.
        </p>
      </div>

      {notice ? <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{notice}</p> : null}
      {error ? <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p> : null}

      {loading ? (
        <div className="flex items-center gap-2 text-[#64748b]">
          <Loader2 className="animate-spin" size={18} />
          Loading documents...
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {documents.map((item) => {
            const form = forms[item.key];
            return (
              <section key={item.key} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-[#06b6d4]" />
                  <h2 className="text-lg font-bold">{item.title}</h2>
                </div>
                <label className="mb-3 block text-[13px] font-semibold text-[#475569]">
                  Title
                  <input
                    value={form.title}
                    onChange={(event) => updateField(item.key, "title", event.target.value)}
                    className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-4 text-[14px] outline-none focus:border-[#06b6d4]"
                  />
                </label>
                <label className="mb-3 block text-[13px] font-semibold text-[#475569]">
                  Version
                  <input
                    value={form.version}
                    onChange={(event) => updateField(item.key, "version", event.target.value)}
                    placeholder="YYYY-MM-DD"
                    className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-4 text-[14px] outline-none focus:border-[#06b6d4]"
                  />
                </label>
                <label className="mb-4 block text-[13px] font-semibold text-[#475569]">
                  Content
                  <textarea
                    rows={14}
                    value={form.content}
                    onChange={(event) => updateField(item.key, "content", event.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-[14px] outline-none focus:border-[#06b6d4]"
                  />
                </label>
                <div className="flex items-center justify-between">
                  <a href={item.path} target="_blank" rel="noreferrer" className="text-[13px] font-semibold text-[#06b6d4]">
                    View public page
                  </a>
                  <button
                    type="button"
                    onClick={() => handleSave(item.key)}
                    disabled={Boolean(savingKey)}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#06b6d4] px-4 text-[13px] font-bold text-white hover:bg-[#0891b2] disabled:opacity-70"
                  >
                    {savingKey === item.key ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Publish
                  </button>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
