export default function AccountDeletionPage() {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748b]">Kidport</p>
      <h1 className="mb-4 text-3xl font-bold tracking-tight">Account and Data Deletion (Kidport)</h1>
      <p className="mb-8 text-[15px] leading-7 text-[#334155]">
        At Seymore Kidport, we respect your privacy and give you full control over your personal and child data.
      </p>

      <h2 className="mb-3 text-xl font-bold">How to Delete Your Account and Data:</h2>
      <div className="mb-8 space-y-4 text-[15px] leading-7 text-[#334155]">
        <div>
          <p className="font-semibold">1. Directly within the App (Fastest):</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Open the <strong>Kidport</strong> app.</li>
            <li>Go to <strong>Settings</strong> &gt; <strong>Account Settings</strong>.</li>
            <li>Tap <strong>Delete Account</strong> and confirm. Your account and data will be deleted immediately.</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">2. Web / Email Request (If App is Uninstalled):</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              If you have uninstalled the app or cannot access your device, send an email to{" "}
              <a className="font-semibold text-[#06b6d4]" href="mailto:seymourgregorio@gmail.com">
                seymourgregorio@gmail.com
              </a>{" "}
              with the subject line <em>"Account Deletion Request"</em>.
            </li>
            <li>Please send the request from the email address associated with your Kidport account.</li>
          </ul>
        </div>
      </div>

      <h2 className="mb-3 text-xl font-bold">What Data is Permanently Deleted:</h2>
      <p className="mb-3 text-[15px] leading-7 text-[#334155]">
        When an account deletion request is processed, the following data is permanently purged:
      </p>
      <ul className="mb-8 list-disc space-y-1 pl-6 text-[15px] leading-7 text-[#334155]">
        <li><strong>Account Information:</strong> Name, email address, password hash, and profile details.</li>
        <li><strong>Child Profiles:</strong> Names, birthdates, ages, and profile images.</li>
        <li><strong>Observations & Media:</strong> All recorded milestone notes, photos, videos, and voice recordings.</li>
        <li><strong>Care Circle & Classroom Data:</strong> All associations with family members, teachers, and classrooms.</li>
      </ul>

      <h2 className="mb-3 text-xl font-bold">Data Retention Period:</h2>
      <p className="text-[15px] leading-7 text-[#334155]">
        Once requested, all account records and associated media will be completely and permanently deleted from our active servers and backup databases within <strong>30 days</strong>.
      </p>
    </article>
  );
}
