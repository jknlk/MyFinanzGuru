export type BinaryOperator = "+" | "-" | "*" | "/";

export function applyBinaryOperator(a: number, operator: BinaryOperator, b: number): number {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? NaN : a / b;
  }
}

export type UnaryFunction =
  | "square"
  | "sqrt"
  | "reciprocal"
  | "abs"
  | "factorial"
  | "sin"
  | "cos"
  | "tan"
  | "ln"
  | "log10"
  | "negate";

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity; // overflow guard, matches Number's double range
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

const toRadians = (deg: number) => (deg * Math.PI) / 180;

/** Scientific-mode unary functions; trig functions operate in degrees. */
export function applyUnaryFunction(fn: UnaryFunction, value: number): number {
  switch (fn) {
    case "square":
      return value * value;
    case "sqrt":
      return value < 0 ? NaN : Math.sqrt(value);
    case "reciprocal":
      return value === 0 ? NaN : 1 / value;
    case "abs":
      return Math.abs(value);
    case "factorial":
      return factorial(value);
    case "sin":
      return Math.sin(toRadians(value));
    case "cos":
      return Math.cos(toRadians(value));
    case "tan":
      return Math.tan(toRadians(value));
    case "ln":
      return value <= 0 ? NaN : Math.log(value);
    case "log10":
      return value <= 0 ? NaN : Math.log10(value);
    case "negate":
      return -value;
  }
}

export function applyPercent(value: number): number {
  return value / 100;
}
