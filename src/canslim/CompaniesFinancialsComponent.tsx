import { useCallback, useEffect, useState } from "react";
import {
  CompanyDetails,
  QuarterData,
  ShareHolderType,
  ShareHoldingPattern,
} from "../interfaces/CompanyDetails";
import { MaterialUITable } from "../material-ui/MaterialUITable";
import {
  FinancialsTable,
  FinancialTableRow,
  GrowthRateKeys,
} from "./FinancialsTable";

export interface CompanyDetailsProps {
  companyDetails: CompanyDetails[];
}

export function CompaniesFinancialsComponent(props: CompanyDetailsProps) {
  const { companyDetails } = props;

  const [financialRows, setFinancialRows] = useState<any[]>([]);

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

    function convertToNum(value: string) {
      return Number(value.split(",").join(""));
    }

    const getEPSGrowthRate = (
      curData: { eps: string },
      prevData: { eps: string }
    ) => {
      let curValue;
      let prevValue;
      if (curData && prevData) {
        curValue = curData.eps;
        prevValue = prevData.eps;
      } else {
        return 0;
      }
      if (curValue && prevValue) {
        prevValue = convertToNum(prevValue);
        curValue = convertToNum(curValue);
        let finalValue;
        if (prevValue === 0) {
          finalValue = curValue ? "Infinity" : 0;
        } else if (prevValue > 0) {
          finalValue = Number(((curValue - prevValue) / prevValue).toFixed(2));
        } else if (prevValue < 0) {
          finalValue = -Number(((curValue - prevValue) / prevValue).toFixed(2));
        }
        return Math.round(Number(finalValue) * 100);
      }
      return 0;
    };

    const getSalesGrowthRate = (
      curData: { sales: string },
      prevData: { sales: string }
    ) => {
      let curValue;
      let prevValue;
      if (curData && prevData) {
        curValue = curData.sales;
        prevValue = prevData.sales;
      } else {
        return "NA";
      }
      if (curValue && prevValue) {
        const latestSales = convertToNum(curValue);
        const previousSales = convertToNum(prevValue);
        const salesPrecentage = Number(
          ((latestSales - previousSales) / previousSales).toFixed(2)
        );
        if (isNaN(salesPrecentage)) {
          return "NA";
        }
        if (salesPrecentage === Number.POSITIVE_INFINITY) {
          return "Infinity";
        }
        if (salesPrecentage === Number.NEGATIVE_INFINITY) {
          return "-Infinity";
        }
        return Math.round(Number(salesPrecentage) * 100);
      }
      return "NA";
    };

    const getInstitutionGrowthRate = (
      curData: ShareHoldingPattern,
      prevData: ShareHoldingPattern,
      shareholderType: ShareHolderType
    ) => {
      if (!curData || !prevData) return "No data";
      let curValue = curData[shareholderType]
        ? Number(curData[shareholderType])
        : 0;
      let prevValue = prevData[shareholderType]
        ? Number(prevData[shareholderType])
        : 0;

      if (prevValue !== curValue) {
        if (prevValue === 0) {
          return "Infinity";
        } else {
          return Number(
            (((curValue - prevValue) / prevValue) * 100).toFixed(2)
          );
        }
      } else {
        return "No Change";
      }
    };

    return {
      companyNo,
      companyName,
      latestQuarter: quartersData[0].quarterName,
      quarterlyEPS: new Map([
        [
          GrowthRateKeys.Latest,
          getEPSGrowthRate(quartersData[0], quartersData[4]),
        ],
        [
          GrowthRateKeys.Previous,
          getEPSGrowthRate(quartersData[1], quartersData[5]),
        ],
        [
          GrowthRateKeys.SecondPrevious,
          getEPSGrowthRate(quartersData[2], quartersData[6]),
        ],
      ]),
      yearlyEPS: new Map([
        [GrowthRateKeys.Latest, getEPSGrowthRate(yearsData[0], yearsData[1])],
        [GrowthRateKeys.Previous, getEPSGrowthRate(yearsData[1], yearsData[2])],
        [
          GrowthRateKeys.SecondPrevious,
          getEPSGrowthRate(yearsData[2], yearsData[3]),
        ],
      ]),
      yearlySales: new Map([
        [GrowthRateKeys.Latest, getSalesGrowthRate(yearsData[0], yearsData[1])],
        [
          GrowthRateKeys.Previous,
          getSalesGrowthRate(yearsData[1], yearsData[2]),
        ],
        [
          GrowthRateKeys.SecondPrevious,
          getSalesGrowthRate(yearsData[2], yearsData[3]),
        ],
      ]),
      yoyQuarterlySales: new Map([
        [
          GrowthRateKeys.Latest,
          getSalesGrowthRate(quartersData[0], quartersData[4]),
        ],
        [
          GrowthRateKeys.Previous,
          getSalesGrowthRate(quartersData[1], quartersData[5]),
        ],
        [
          GrowthRateKeys.SecondPrevious,
          getSalesGrowthRate(quartersData[2], quartersData[6]),
        ],
      ]),
      DIIsData: {
        latest:
          shareholdingPattern[0] &&
          shareholdingPattern[0][ShareHolderType.DIIs],
        percentChange: getInstitutionGrowthRate(
          shareholdingPattern[0],
          shareholdingPattern[1],
          ShareHolderType.DIIs
        ),
      },
      FIIsData: {
        latest:
          shareholdingPattern[0] &&
          shareholdingPattern[0][ShareHolderType.FIIs],
        percentChange: getInstitutionGrowthRate(
          shareholdingPattern[0],
          shareholdingPattern[1],
          ShareHolderType.FIIs
        ),
      },
    };
  };

  return (
    <>
      {financialRows.length > 0 && (
        <div>
          <FinancialsTable rows={financialRows} />
        </div>
      )}
    </>
  );
}
