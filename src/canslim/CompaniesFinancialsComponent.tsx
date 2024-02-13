import { useCallback, useEffect, useState } from "react";
import {
  CompanyDetails,
  ShareHolderType,
  ShareHoldingPattern,
} from "../interfaces/CompanyDetails";
import { FinancialTableRow } from "../interfaces/FinancialTableInterfaces";
import { FinancialsTable } from "./FinancialsTable";
import {
  getBadgesForCompany,
  getEPSGrowthRate,
  getInstitutionGrowthRate,
  getSalesGrowthRate,
} from "./utils/CompaniesFinancialUtils";
import { BreakoutWatchListCompany } from "../interfaces/BreakoutWatchListCompany";
import { BreakoutCompany } from "../interfaces/BreakoutCompany";
import { WatchlistClickOperation } from "../weekbreakout/WeeklyBreakoutCompanies";

export interface CompanyDetailsProps {
  companyDetails: CompanyDetails[];

  positiveTechCompanies: string[];

  watchListCompanies: BreakoutWatchListCompany[];

  updateWatchListCompany: (
    company: BreakoutCompany,
    clickOp: WatchlistClickOperation
  ) => void;

  breakoutCompanies: BreakoutCompany[];
}

export function CompaniesFinancialsComponent(props: CompanyDetailsProps) {
  const {
    companyDetails,
    positiveTechCompanies,
    watchListCompanies,
    updateWatchListCompany,
    breakoutCompanies,
  } = props;

  const [financialRows, setFinancialRows] = useState<any[]>([]);

  const removePercentFromShareholdings = useCallback(
    (shareholdingPatterns: ShareHoldingPattern[]) => {
      for (const shareholdingPattern of shareholdingPatterns) {
        for (const type of [
          ShareHolderType.DIIs,
          ShareHolderType.FIIs,
          ShareHolderType.Government,
          ShareHolderType.Promoters,
          ShareHolderType.Public,
        ]) {
          const typePattern = shareholdingPattern[type];
          if (typePattern && typePattern.indexOf("%") !== -1) {
            shareholdingPattern[type] = typePattern.split("%")[0];
          }
        }
      }
      return shareholdingPatterns;
    },
    []
  );

  useEffect(() => {
    const rows = companyDetails.map((data) => getFinancialRow(data));
    setFinancialRows(rows);
  }, [companyDetails]);

  const getFinancialRow = (company: CompanyDetails): FinancialTableRow => {
    const {
      companyNo,
      companyName,
      quartersData,
      yearsData,
      shareholdingPattern,
    } = company;
    const newShareholdingPattern: ShareHoldingPattern[] =
      removePercentFromShareholdings(shareholdingPattern);
    return {
      companyNo,
      companyName,
      latestQuarter: quartersData[0]?.quarterName,
      quarterlyEPSSecondPrevious: getEPSGrowthRate(
        quartersData[2],
        quartersData[6]
      ),
      quarterlyEPSPrevious: getEPSGrowthRate(quartersData[1], quartersData[5]),
      quarterlyEPSLatest: getEPSGrowthRate(quartersData[0], quartersData[4]),
      yearlyEPSSecondPrevious: getEPSGrowthRate(yearsData[2], yearsData[3]),
      yearlyEPSPrevious: getEPSGrowthRate(yearsData[1], yearsData[2]),
      yearlyEPSLatest: getEPSGrowthRate(yearsData[0], yearsData[1]),
      yearlySalesSecondPrevious: getSalesGrowthRate(yearsData[2], yearsData[3]),
      yearlySalesPrevious: getSalesGrowthRate(yearsData[1], yearsData[2]),
      yearlySalesLatest: getSalesGrowthRate(yearsData[0], yearsData[1]),
      yoyQuarterlySalesSecondPrevious: getSalesGrowthRate(
        quartersData[2],
        quartersData[6]
      ),
      yoyQuarterlySalesPrevious: getSalesGrowthRate(
        quartersData[1],
        quartersData[5]
      ),
      yoyQuarterlySalesLatest: getSalesGrowthRate(
        quartersData[0],
        quartersData[4]
      ),
      DIIsDataLatest:
        newShareholdingPattern[0] &&
        newShareholdingPattern[0][ShareHolderType.DIIs]
          ? Number(newShareholdingPattern[0][ShareHolderType.DIIs])
          : 0,
      DIIsDataPercentChange: getInstitutionGrowthRate(
        newShareholdingPattern[0],
        newShareholdingPattern[1],
        ShareHolderType.DIIs
      ),
      FIIsDataLatest:
        newShareholdingPattern[0] &&
        newShareholdingPattern[0][ShareHolderType.FIIs]
          ? Number(newShareholdingPattern[0][ShareHolderType.FIIs])
          : 0,
      FIIsDataPercentChange: getInstitutionGrowthRate(
        newShareholdingPattern[0],
        newShareholdingPattern[1],
        ShareHolderType.FIIs
      ),
      badge: getBadgesForCompany(company),
    };
  };

  return (
    <>
      {financialRows.length > 0 && (
        <div>
          <FinancialsTable
            rows={financialRows}
            positiveTechCompanies={positiveTechCompanies}
            watchListCompanies={watchListCompanies}
            updateWatchListCompany={updateWatchListCompany}
            breakoutCompanies={breakoutCompanies}
          />
        </div>
      )}
    </>
  );
}
