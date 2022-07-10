import {
  CompanyDetails,
  ShareHolderType,
  ShareHoldingPattern,
} from "../../interfaces/CompanyDetails";
import { FinancialBadge } from "../../interfaces/FinancialTableInterfaces";

export function convertToNum(value: string) {
  return Number(value.split(",").join(""));
}

export const getEPSGrowthRate = (
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
      finalValue = curValue ? Infinity : 0;
    } else if (prevValue > 0) {
      finalValue = Number(((curValue - prevValue) / prevValue).toFixed(2));
    } else if (prevValue < 0) {
      finalValue = -Number(((curValue - prevValue) / prevValue).toFixed(2));
    }
    return Math.round(Number(finalValue) * 100);
  }
  return 0;
};

export const getSalesGrowthRate = (
  curData: { sales: string },
  prevData: { sales: string }
) => {
  let curValue;
  let prevValue;
  if (curData && prevData) {
    curValue = curData.sales;
    prevValue = prevData.sales;
  } else {
    return 0;
  }
  if (curValue && prevValue) {
    const latestSales = convertToNum(curValue);
    const previousSales = convertToNum(prevValue);
    const salesPrecentage = Number(
      ((latestSales - previousSales) / previousSales).toFixed(2)
    );
    if (isNaN(salesPrecentage)) {
      return 0;
    }
    if (salesPrecentage === Number.POSITIVE_INFINITY) {
      return Infinity;
    }
    if (salesPrecentage === Number.NEGATIVE_INFINITY) {
      return -Infinity;
    }
    return Math.round(Number(salesPrecentage) * 100);
  }
  return 0;
};

export const getInstitutionGrowthRate = (
  curData: ShareHoldingPattern,
  prevData: ShareHoldingPattern,
  shareholderType: ShareHolderType
) => {
  if (!curData || !prevData) return -Infinity;
  let curValue = curData[shareholderType]
    ? Number(curData[shareholderType])
    : 0;
  let prevValue = prevData[shareholderType]
    ? Number(prevData[shareholderType])
    : 0;

  if (prevValue !== curValue) {
    if (prevValue === 0) {
      return Infinity;
    } else {
      return Number((((curValue - prevValue) / prevValue) * 100).toFixed(2));
    }
  } else {
    return 0;
  }
};

const ifEPSGrowthRateSlowdownHappened = (
  current: number,
  previous: number
): boolean => {
  if (current > previous) {
    return false;
  }

  const slowdownRate = ((previous - current) / previous) * 100;
  if (isNaN(slowdownRate)) {
    return false;
  }
  if (slowdownRate > 67) {
    return true;
  }
  return false;
};

export function getBadgesForCompany(company: CompanyDetails) {
  const { quartersData, yearsData, shareholdingPattern } = company;
  let badges = [];
  const currentQuarterEPS = getEPSGrowthRate(quartersData[0], quartersData[4]);
  const previousQuarterEPS = getEPSGrowthRate(quartersData[1], quartersData[5]);
  const secondPreviousQuarterEPS = getEPSGrowthRate(
    quartersData[2],
    quartersData[6]
  );

  const previousQuarterGrowthSlowdown = ifEPSGrowthRateSlowdownHappened(
    previousQuarterEPS,
    secondPreviousQuarterEPS
  );

  const currentQuarterGrowthSlowdown = ifEPSGrowthRateSlowdownHappened(
    currentQuarterEPS,
    previousQuarterEPS
  );
  if (
    currentQuarterEPS > 40 &&
    previousQuarterEPS > 40 &&
    (!previousQuarterGrowthSlowdown || !currentQuarterGrowthSlowdown)
  ) {
    badges.push(FinancialBadge.Q);
  }

  const currentQuarterSales = getSalesGrowthRate(
    quartersData[0],
    quartersData[4]
  );
  if (currentQuarterSales > 25) {
    badges.push(FinancialBadge.S);
  }

  const yearlyEPS1 = getEPSGrowthRate(yearsData[0], yearsData[1]);
  const yearlyEPS2 = getEPSGrowthRate(yearsData[1], yearsData[2]);
  const yearlyEPS3 = getEPSGrowthRate(yearsData[2], yearsData[3]);

  if (yearlyEPS1 > 20 && yearlyEPS2 > 0 && yearlyEPS3 > 0) {
    badges.push(FinancialBadge.A);
  }

  const FIISChange = getInstitutionGrowthRate(
    shareholdingPattern[0],
    shareholdingPattern[1],
    ShareHolderType.FIIs
  );

  const DIISChange = getInstitutionGrowthRate(
    shareholdingPattern[0],
    shareholdingPattern[1],
    ShareHolderType.DIIs
  );

  if (FIISChange > 0 || DIISChange > 0) {
    badges.push(FinancialBadge.I);
  }
  return badges.join(",");
}
