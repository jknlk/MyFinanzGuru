export type VatDirection = "fromNet" | "fromGross";

export interface VatInput {
  amount: number;
  vatRatePct: number;
  direction: VatDirection;
}

export interface VatResult {
  net: number;
  vat: number;
  gross: number;
}

/** German Umsatzsteuer/Mehrwertsteuer conversion between net and gross prices. */
export function calculateVat(input: VatInput): VatResult {
  const { amount, vatRatePct, direction } = input;
  const rate = vatRatePct / 100;

  if (direction === "fromNet") {
    const net = amount;
    const vat = net * rate;
    return { net, vat, gross: net + vat };
  }

  const gross = amount;
  const net = gross / (1 + rate);
  const vat = gross - net;
  return { net, vat, gross };
}
