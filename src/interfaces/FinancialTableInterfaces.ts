export interface FinancialTableRow {
  companyNo: string;

  companyName: string;

  latestQuarter: string;

  quarterlyEPSLatest: number;

  quarterlyEPSPrevious: number;

  quarterlyEPSSecondPrevious: number;

  yearlyEPSLatest: number;

  yearlyEPSPrevious: number;

  yearlyEPSSecondPrevious: number;

  yoyQuarterlySalesLatest: number;

  yoyQuarterlySalesPrevious: number;

  yoyQuarterlySalesSecondPrevious: number;

  yearlySalesLatest: number;

  yearlySalesPrevious: number;

  yearlySalesSecondPrevious: number;

  FIIsDataLatest: number;

  FIIsDataPercentChange: number;

  DIIsDataLatest: number;

  DIIsDataPercentChange: number;

  badge: string;
}

export type Order = "asc" | "desc";

export enum FinancialBadge {
  /**
   * Current and previous quarters EPS growth % should be greater than 40%.
   */
  Q = "Q",

  /**
   * Current quarters sales growth % should be atleast 25%.
   */
  S = "S",

  /**
   * Latest year growth rate should be greater than 20% and previous 3 years should
   * show some positive growth rate.
   */
  A = "A",

  /**
   * There should be some positive change in DIIs or FIIs share.
   */
  I = "I",
}
