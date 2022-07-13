export interface BreakoutCompany {
  ID: string;
  Date: string;
  AlertType: number;
  ListingID: number;
  SecurityID: number;
  Name: string;
  Symb: string;
  Exch: string;
  SortValue: number;
  Info: BreakoutCompanyInfo;
  Slug: string;
}

export interface BreakoutCompanyInfo {
  /**
   * 52 week high
   */
  NYH: number;

  /**
   * Gap from 52 week high
   */
  NYHZG: number;

  /**
   * Current close price
   */
  C1: number;

  /**
   * Latest change in stock price.
   */
  C1ZG: number;
}
