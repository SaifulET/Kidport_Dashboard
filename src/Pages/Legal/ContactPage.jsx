import { useState } from "react";
import { apiPost } from "../../lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setNotice("");
    setError("");
    try {
      await apiPost("/legal/contact", form);
      setNotice("Your message was sent. We will reply to the email you provided.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.message || "Unable to send your message right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748b]">Kidport</p>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Contact</h1>
      <p className="mb-8 text-sm text-[#64748b]">
        Send a message and it will be delivered to <span className="font-semibold text-[#1e293b]">seymourgregorio@gmail.com</span>.
      </p>

      {notice ? <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{notice}</p> : null}
      {error ? <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p> : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-[13px] font-semibold text-[#475569]">
            Name
            <input
              required
              value={form.name}
              onChange={update("name")}
              className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-4 text-[14px] text-[#1e293b] outline-none focus:border-[#06b6d4] focus:ring-2 focus:ring-[#06b6d4]/20"
            />
          </label>
          <label className="block text-[13px] font-semibold text-[#475569]">
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={update("email")}
              className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-4 text-[14px] text-[#1e293b] outline-none focus:border-[#06b6d4] focus:ring-2 focus:ring-[#06b6d4]/20"
            />
          </label>
        </div>
        <label className="block text-[13px] font-semibold text-[#475569]">
          Subject
          <input
            required
            value={form.subject}
            onChange={update("subject")}
            className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-4 text-[14px] text-[#1e293b] outline-none focus:border-[#06b6d4] focus:ring-2 focus:ring-[#06b6d4]/20"
          />
        </label>
        <label className="block text-[13px] font-semibold text-[#475569]">
          Message
          <textarea
            required
            minLength={10}
            rows={6}
            value={form.message}
            onChange={update("message")}
            className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-[14px] text-[#1e293b] outline-none focus:border-[#06b6d4] focus:ring-2 focus:ring-[#06b6d4]/20"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-lg bg-[#06b6d4] px-5 text-[14px] font-bold text-white hover:bg-[#0891b2] disabled:opacity-70"
        >
          {loading ? "Sending..." : "Send message"}
        </button>
      </form>
    </article>
  );
}
