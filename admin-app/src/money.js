import { useEffect, useState } from "react";
import { getCheckoutCurrency } from "./adminApi.js";

const DEFAULT_CURRENCY = "USD";
const formatters = new Map();

const getFormatter = (currency) => {
  if (!formatters.has(currency)) {
    let formatter;

    try {
      formatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
      });
    } catch {
      // Unknown currency code: fall back rather than crash the page.
      formatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: DEFAULT_CURRENCY,
      });
    }

    formatters.set(currency, formatter);
  }

  return formatters.get(currency);
};

export const formatMoney = (value, currency = DEFAULT_CURRENCY) => {
  const amount = Number(value);

  return getFormatter(currency || DEFAULT_CURRENCY).format(
    Number.isFinite(amount) ? amount : 0,
  );
};

// Symbol only (e.g. "R", "$"), for input prefixes.
export const getCurrencySymbol = (currency = DEFAULT_CURRENCY) => {
  const symbolPart = getFormatter(currency || DEFAULT_CURRENCY)
    .formatToParts(0)
    .find((part) => part.type === "currency");

  return symbolPart?.value || currency;
};

// Store currency from GET /api/settings, fetched once and cached in adminApi.js.
export const useCurrency = () => {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);

  useEffect(() => {
    let mounted = true;

    getCheckoutCurrency().then((value) => {
      if (mounted) {
        setCurrency(value);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return currency;
};
