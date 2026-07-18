import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Privacy policy for MyFinanzGuru pursuant to Art. 13 GDPR.",
};

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 lg:px-10">
      <h1 className="font-serif text-3xl text-ink-900">Datenschutzerklärung</h1>
      <div className="mt-8 flex flex-col gap-6 text-sm text-ink-700 leading-relaxed">
        <section>
          <h2 className="font-medium text-ink-900 mb-1">1. Verantwortlicher</h2>
          <p>{"{{CLIENT_LEGAL_TEXT — data controller name and address}}"}</p>
        </section>
        <section>
          <h2 className="font-medium text-ink-900 mb-1">2. Hosting</h2>
          <p>
            Diese Website wird bei Vercel Inc. gehostet. Details zur Datenverarbeitung durch den
            Hosting-Anbieter finden Sie in dessen Datenschutzerklärung.{" "}
            {"{{CLIENT_LEGAL_TEXT — hosting provider details, data processing agreement}}"}
          </p>
        </section>
        <section>
          <h2 className="font-medium text-ink-900 mb-1">3. Cookies</h2>
          <p>
            Wir verwenden standardmäßig nur technisch notwendige Cookies. Optionale Inhalte wie
            der Calendly-Buchungskalender werden erst nach Ihrer ausdrücklichen Zustimmung
            geladen.
          </p>
        </section>
        <section>
          <h2 className="font-medium text-ink-900 mb-1">4. Kontaktaufnahme &amp; Terminbuchung (Calendly)</h2>
          <p>
            Wenn Sie den Buchungskalender aktivieren, werden Daten an Calendly Inc. übertragen.
            Dies geschieht ausschließlich nach Ihrer Zustimmung.{" "}
            {"{{CLIENT_LEGAL_TEXT — Calendly data processing details, legal basis}}"}
          </p>
        </section>
        <section>
          <h2 className="font-medium text-ink-900 mb-1">5. Finanz-Tools</h2>
          <p>
            Alle Berechnungen unserer Finanz-Tools erfolgen ausschließlich lokal in Ihrem
            Browser. Es werden keine eingegebenen Daten an unsere Server übertragen oder
            gespeichert.
          </p>
        </section>
        <section>
          <h2 className="font-medium text-ink-900 mb-1">6. Ihre Rechte</h2>
          <p>{"{{CLIENT_LEGAL_TEXT — rights under Art. 15-21 GDPR, contact for exercising rights}}"}</p>
        </section>
        <section>
          <h2 className="font-medium text-ink-900 mb-1">7. Beschwerderecht</h2>
          <p>{"{{CLIENT_LEGAL_TEXT — competent supervisory authority}}"}</p>
        </section>
      </div>
    </div>
  );
}
