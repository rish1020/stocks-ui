import { Chip, Link, Stack, TableCell, TableRow } from "@mui/material";
import {
  FinancialBadge,
  FinancialTableRow,
} from "../interfaces/FinancialTableInterfaces";
import FlagIcon from "@mui/icons-material/Flag";
import { CompanyDetails } from "../interfaces/CompanyDetails";
import { useCallback, useEffect, useState } from "react";
import { StringConstants } from "../StringConstants";

export interface FinancialTableRowProps {
  row: FinancialTableRow;

  isCompanyGood: any;
}

export function FinancialTableRowComponent(props: FinancialTableRowProps) {
  const { row, isCompanyGood } = props;

  const [companyPerformace, setCompanyPerformance] = useState<{
    value: boolean | null;
    title?: string;
  }>({ value: null, title: "" });

  useEffect(() => {
    const companyPerf = isCompanyGood(row);
    setCompanyPerformance(companyPerf);
  }, [row]);

  let keyNumber = 1;

  const getBadgeTitle = (data: string) => {
    if (data == FinancialBadge.Q) {
      return "Showing quarterly growth";
    }
    if (data == FinancialBadge.S) {
      return "Showing sales growth";
    }
    if (data == FinancialBadge.I) {
      return "Institution backing";
    }
    if (data == FinancialBadge.A) {
      return "Showing annual growth";
    }
    return "";
  };

  return (
    <TableRow
      key={row.companyNo}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell
        padding="normal"
        component="th"
        scope="row"
        title={
          companyPerformace.value === null
            ? row.companyNo
            : `${companyPerformace.title} for ${row.companyNo}`
        }
      >
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: companyPerformace.value !== null ? "block" : "none",
              marginRight: "5px",
            }}
          >
            <FlagIcon
              sx={{ color: companyPerformace.value ? "green" : "#ff3838" }}
            />
          </div>
          <Link
            href={`${StringConstants.ScreenerCompany}${row.companyNo}`}
            underline="none"
          >
            {row.companyName}
          </Link>
        </div>
      </TableCell>
      <TableCell padding="none" align="center">
        <Stack direction="row">
          {row.badge.split(",").map((data) => (
            <Chip
              label={data}
              size="small"
              title={getBadgeTitle(data)}
              key={keyNumber++}
            />
          ))}
        </Stack>
      </TableCell>
      <TableCell padding="none" align="center">
        {row.latestQuarter}
      </TableCell>
      <TableCell padding="none" align="center">
        {row.quarterlyEPSSecondPrevious}
      </TableCell>
      <TableCell padding="none" align="center">
        {row.quarterlyEPSPrevious}
      </TableCell>
      <TableCell padding="none" align="center">
        {row.quarterlyEPSLatest}
      </TableCell>

      <TableCell padding="none" align="center">
        {row.yearlyEPSSecondPrevious}
      </TableCell>
      <TableCell padding="none" align="center">
        {row.yearlyEPSPrevious}
      </TableCell>
      <TableCell padding="none" align="center">
        {row.yearlyEPSLatest}
      </TableCell>

      <TableCell padding="none" align="center">
        {row.yoyQuarterlySalesSecondPrevious}
      </TableCell>
      <TableCell padding="none" align="center">
        {row.yoyQuarterlySalesPrevious}
      </TableCell>
      <TableCell padding="none" align="center">
        {row.yoyQuarterlySalesLatest}
      </TableCell>

      <TableCell padding="none" align="center">
        {row.yearlySalesSecondPrevious}
      </TableCell>
      <TableCell padding="none" align="center">
        {row.yearlySalesPrevious}
      </TableCell>
      <TableCell padding="none" align="center">
        {row.yearlySalesLatest}
      </TableCell>

      <TableCell padding="none" align="center">
        {row.FIIsDataLatest}
      </TableCell>
      <TableCell padding="none" align="center">
        {row.FIIsDataPercentChange}
      </TableCell>

      <TableCell padding="none" align="center">
        {row.DIIsDataLatest}
      </TableCell>
      <TableCell padding="none" align="center">
        {row.DIIsDataPercentChange}
      </TableCell>
    </TableRow>
  );
}
