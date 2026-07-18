import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Legal notice for MyFinanzGuru pursuant to § 5 TMG.",
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 lg:px-10">
      <h1 className="font-serif text-3xl text-ink-900">Impressum</h1>
      <div className="mt-8 flex flex-col gap-6 text-sm text-ink-700 leading-relaxed">
        <section>
          <h2 className="font-medium text-ink-900 mb-1">Angaben gemäß § 5 TMG</h2>
          <p>{"{{CLIENT_LEGAL_TEXT — company name, legal form, registered address}}"}</p>
        </section>
        <section>
          <h2 className="font-medium text-ink-900 mb-1">Vertreten durch</h2>
          <p>{"{{CLIENT_LEGAL_TEXT — managing director(s) / authorized representative}}"}</p>
        </section>
        <section>
          <h2 className="font-medium text-ink-900 mb-1">Kontakt</h2>
          <p>{"{{CLIENT_LEGAL_TEXT — phone, email}}"}</p>
        </section>
        <section>
          <h2 className="font-medium text-ink-900 mb-1">Registereintrag</h2>
          <p>{"{{CLIENT_LEGAL_TEXT — register court, registration number}}"}</p>
        </section>
        <section>
          <h2 className="font-medium text-ink-900 mb-1">Umsatzsteuer-ID</h2>
          <p>{"{{CLIENT_LEGAL_TEXT — VAT ID per §27a UStG}}"}</p>
        </section>
        <section>
          <h2 className="font-medium text-ink-900 mb-1">Aufsichtsbehörde / Zulassung</h2>
          <p>
            {"{{CLIENT_LEGAL_TEXT — §34f/§34h GewO registration details, IHK registration number, competent supervisory authority}}"}
          </p>
        </section>
        <section>
          <h2 className="font-medium text-ink-900 mb-1">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>{"{{CLIENT_LEGAL_TEXT}}"}</p>
        </section>
        <section>
          <h2 className="font-medium text-ink-900 mb-1">EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
            bereit: {"{{OS_PLATFORM_LINK}}"}. Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>
        </section>
      </div>
    </div>
  );
}
