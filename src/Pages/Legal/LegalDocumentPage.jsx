import { useEffect, useState } from "react";
import { apiGet } from "../../lib/api";

const fallbackCopy = {
  terms: {
    title: "Terms and Conditions",
    content: "Kidport terms are managed from the admin dashboard. Check back soon."
  },
  "privacy-policy": {
    title: "Privacy Policy",
    content: "Kidport privacy terms are managed from the admin dashboard. Check back soon."
  }
};

export default function LegalDocumentPage({ documentKey }) {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await apiGet(`/legal/${documentKey}`);
        if (!cancelled) setDocument(response.data);
      } catch (err) {
        if (!cancelled) {
          setDocument(fallbackCopy[documentKey]);
          setError(err.message || "Unable to load this document right now.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [documentKey]);

  if (loading) {
    return <p className="text-sm font-medium text-[#64748b]">Loading...</p>;
  }

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748b]">Kidport</p>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">{document?.title || fallbackCopy[documentKey].title}</h1>
      {document?.version ? (
        <p className="mb-6 text-sm text-[#64748b]">Version {document.version}</p>
      ) : null}
      {error ? <p className="mb-4 text-sm text-amber-700">{error}</p> : null}
      <div className="whitespace-pre-wrap text-[15px] leading-7 text-[#334155]">
        {document?.content || fallbackCopy[documentKey].content}
      </div>
    </article>
  );
}
