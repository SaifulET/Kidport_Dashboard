import { Link, Outlet, useLocation } from "react-router-dom";

const links = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/termsandcondition", label: "Terms & Conditions" },
  { to: "/contant", label: "Contact" },
  { to: "/account-deletion", label: "Account Deletion" },
];

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-[#1e293b]">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/sign-in" className="flex items-center gap-2">
            <img src="/fulllogo.svg" alt="Kidport" className="h-9 w-auto" />
          </Link>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-semibold text-[#64748b]">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={location.pathname === link.to ? "text-[#06b6d4]" : "hover:text-[#06b6d4]"}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
}
