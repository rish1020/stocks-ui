export interface CompanyDetails {
  _id: string;

  companyName: string;

  companyNo: string;

  lastUpdatedAt: string;

  quartersData: QuarterData[];

  ratios: Ratios;

  shareholdingPattern: ShareHoldingPattern[];

  yearsData: YearData[];
}

export interface QuarterData {
  quarterName: string;

  eps: string;

  index: number;

  sales: string;
}

export interface Ratios {
  debtToEquity: string;

  roe: string;
}

export interface ShareHoldingPattern {
  Promoters: string;

  Public: string;

  index: number;

  quarterName: string;

  FIIs: string;

  DIIs: string;

  Government: string;
}

export interface YearData {
  eps: string;

  yearName: string;

  sales: string;

  index: number;
}

export enum ShareHolderType {
  Promoters = "Promoters",
  Public = "Public",
  FIIs = "FIIs",
  DIIs = "DIIs",
  Government = "Government",
}
