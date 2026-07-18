/**
 * All figures below are simplified, education-only approximations for the
 * 2026 assessment period. Every value is a placeholder that MUST be
 * verified against the official source before the site goes live.
 * Search this file for "CLIENT MUST VERIFY" before launch.
 */

// ---------------------------------------------------------------------------
// Grunderwerbsteuer (real estate transfer tax) by federal state, in %.
// Source: state finance ministries, rates last changed at various dates.
// CLIENT MUST VERIFY all rates before launch.
// ---------------------------------------------------------------------------
export const GRUNDERWERBSTEUER: Record<string, number> = {
  "Baden-Württemberg": 5.0,
  Bayern: 3.5,
  Berlin: 6.0,
  Brandenburg: 6.5,
  Bremen: 5.0,
  Hamburg: 5.5,
  Hessen: 6.0,
  "Mecklenburg-Vorpommern": 6.0,
  Niedersachsen: 5.0,
  "Nordrhein-Westfalen": 6.5,
  "Rheinland-Pfalz": 5.0,
  Saarland: 6.5,
  Sachsen: 5.5,
  "Sachsen-Anhalt": 5.0,
  "Schleswig-Holstein": 6.5,
  Thüringen: 5.0,
};

export const FEDERAL_STATES = Object.keys(GRUNDERWERBSTEUER);

// ---------------------------------------------------------------------------
// Health insurance (GKV) constants — 2026, CLIENT MUST VERIFY.
// ---------------------------------------------------------------------------
export const GKV = {
  // Beitragsbemessungsgrenze (contribution ceiling), health insurance.
  BBG_HEALTH_MONTHLY: 5812.5, // CLIENT MUST VERIFY
  BBG_HEALTH_YEARLY: 69750, // CLIENT MUST VERIFY
  // Versicherungspflichtgrenze / Jahresarbeitsentgeltgrenze — income above
  // this lets an employee opt out of GKV into PKV.
  JAEG_YEARLY: 77400, // CLIENT MUST VERIFY
  GENERAL_RATE: 14.6, // %, statutory general contribution rate
  DEFAULT_ZUSATZBEITRAG: 3.13, // %, market-average additional contribution, Jan 2026
  CARE_RATE: 3.6, // %, Pflegeversicherung base rate
  CARE_CHILDLESS_SURCHARGE: 0.6, // %, surcharge for childless members age 23+
  CARE_CHILD_DISCOUNT_PER_CHILD: 0.25, // %, discount per child (2nd-5th child), capped
  BBG_PENSION_UNEMPLOYMENT_MONTHLY: 8050, // CLIENT MUST VERIFY (West/uniform value assumed)
  PENSION_RATE: 18.6, // %, Rentenversicherung total rate
  UNEMPLOYMENT_RATE: 2.6, // %, Arbeitslosenversicherung total rate
};

// ---------------------------------------------------------------------------
// PKV (private health insurance) — transparent illustrative model only.
// This is NOT a real insurer tariff; it exists to give users a directional
// comparison. CLIENT MUST VERIFY or replace with real tariff data.
// ---------------------------------------------------------------------------
export const PKV_MODEL = {
  BASE_PREMIUM: 280, // €/month base for a healthy adult, employee status
  AGE_FACTOR_PER_YEAR: 4.2, // € added per year of age above 30
  SELF_EMPLOYED_MULTIPLIER: 1.35,
  CIVIL_SERVANT_MULTIPLIER: 0.55, // Beihilfe covers roughly half
  BAND: 0.2, // +/-20% illustrative bandwidth
};

// ---------------------------------------------------------------------------
// §32a EStG 2026 income tax zones — simplified progressive formula.
// CLIENT MUST VERIFY every threshold and coefficient before launch.
// Zones use the official piecewise formula:
//   Zone 1 (bis Grundfreibetrag): 0
//   Zone 2: (a * y + b) * y      where y = (zvE - GFB) / 10000
//   Zone 3: (c * z + d) * z + e  where z = (zvE - zone3start) / 10000
//   Zone 4: g * zvE - h
//   Zone 5 (Reichensteuer): i * zvE - j
// ---------------------------------------------------------------------------
export const EST_2026 = {
  GRUNDFREIBETRAG: 12096, // CLIENT MUST VERIFY
  ZONE2_END: 17443, // CLIENT MUST VERIFY
  ZONE3_END: 68480, // CLIENT MUST VERIFY
  ZONE4_END: 277825, // CLIENT MUST VERIFY
  ZONE2_A: 954.8, // CLIENT MUST VERIFY
  ZONE2_B: 1400, // CLIENT MUST VERIFY
  ZONE3_C: 181.19, // CLIENT MUST VERIFY
  ZONE3_D: 2397, // CLIENT MUST VERIFY
  ZONE3_E: 966.53, // CLIENT MUST VERIFY
  ZONE4_RATE: 0.42,
  ZONE4_SUBTRAHEND: 10911.92, // CLIENT MUST VERIFY
  ZONE5_RATE: 0.45,
  ZONE5_SUBTRAHEND: 19811.14, // CLIENT MUST VERIFY
};

export const SOLI = {
  RATE: 5.5, // % of income tax
  // Exemption threshold on the income tax amount itself (Milderungszone
  // simplified away in v1 — a flat threshold is used as an approximation).
  EXEMPT_TAX_THRESHOLD_SINGLE: 19950, // €/yr income tax, CLIENT MUST VERIFY
  EXEMPT_TAX_THRESHOLD_MARRIED: 39900, // CLIENT MUST VERIFY
};

export const CHURCH_TAX_RATE: Record<string, number> = {
  "Baden-Württemberg": 8,
  Bayern: 8,
  Berlin: 9,
  Brandenburg: 9,
  Bremen: 9,
  Hamburg: 9,
  Hessen: 9,
  "Mecklenburg-Vorpommern": 9,
  Niedersachsen: 9,
  "Nordrhein-Westfalen": 9,
  "Rheinland-Pfalz": 9,
  Saarland: 9,
  Sachsen: 9,
  "Sachsen-Anhalt": 9,
  "Schleswig-Holstein": 9,
  Thüringen: 9,
};

export const KINDERFREIBETRAG_PER_CHILD_YEARLY = 9600; // combined (both parents), CLIENT MUST VERIFY
