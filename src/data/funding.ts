// The funding commitment and the record of what Lector actually paid.
//
// Single source of truth for /funding/. The commitment is a promise, so it
// lives in code and changes rarely. The payments are facts, so each one is an
// entry with a date and an amount. Add an entry only after the money leaves.
//
// The repository's FUNDING.md carries the reasoning: which projects can take
// money, which cannot, and why. This file carries the numbers.

export interface FundingPayment {
  /** ISO date the transfer left. Not the date it cleared. */
  date: string;
  recipient: string;
  recipientUrl?: string;
  /** Whole units, USD. */
  amountUsd: number;
  method: string;
  /** What the money is for, in one sentence. */
  purpose: string;
  /**
   * Public evidence. A path under public/ to a receipt with personal details
   * removed, or a URL to a public acknowledgement. Absent means the payment is
   * recorded but not yet evidenced.
   */
  evidence?: string;
}

export interface FundingAllocation {
  recipient: string;
  recipientUrl?: string;
  /** Percentage of the annual total. The shares must add up to 100. */
  share: number;
  channel: string;
  note: string;
}

export const COMMITMENT = {
  /** The floor, paid every month even at a loss. */
  floorUsdPerMonth: 100,
  /** The share of profit that takes over when it beats the floor. */
  profitShare: 0.1,
  /** When the commitment started. */
  since: "2026-08",
} as const;

export const ANNUAL_TOTAL_AT_FLOOR = COMMITMENT.floorUsdPerMonth * 12;

export const ALLOCATIONS: FundingAllocation[] = [
  {
    recipient: "Tatoeba",
    recipientUrl: "https://tatoeba.org",
    share: 50,
    channel: "Bank transfer to Association Tatoeba",
    note: "Every language pack draws its example sentences from Tatoeba. Association Tatoeba is a French non-profit and donations pay for it.",
  },
  {
    recipient: "Directed work fund",
    share: 30,
    channel: "Paid work on upstream projects",
    note: "Some projects Lector depends on have no legal entity and cannot take a donation. eSpeak NG and jieba are two. Paid work on them is possible instead.",
  },
  {
    recipient: "kaikki.org",
    recipientUrl: "https://kaikki.org",
    share: 20,
    channel: "Offered to the maintainer directly",
    note: "kaikki.org supplies the dictionaries for most packs. It asks for nothing, so Lector asked what would help.",
  },
];

/**
 * Every payment Lector has made, newest first.
 *
 * IMPORTANT: add an entry only after the transfer leaves the account. An empty
 * list renders as "no payments yet", which is the honest state. Never seed this
 * with an intended payment.
 */
export const PAYMENTS: FundingPayment[] = [];

export const totalPaidUsd = (): number =>
  PAYMENTS.reduce((sum, payment) => sum + payment.amountUsd, 0);
