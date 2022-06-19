import { Chip, Stack, TableCell, TableRow } from "@mui/material";
import {
  FinancialBadge,
  FinancialTableRow,
} from "../interfaces/FinancialTableInterfaces";
import FlagIcon from "@mui/icons-material/Flag";
import { CompanyDetails } from "../interfaces/CompanyDetails";
import { useCallback } from "react";

export interface FinancialTableRowProps {
  row: FinancialTableRow;
}

export function FinancialTableRowComponent(props: FinancialTableRowProps) {
  const { row } = props;
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

  const isCompanyGood = useCallback(
    (row: FinancialTableRow): { value: boolean; title?: string } => {
      if (row.FIIsDataPercentChange < 0 && row.DIIsDataPercentChange < 0) {
        return {
          title: "Institution share is decreasing or not present",
          value: false,
        };
      } else {
        return {
          value: true,
        };
      }
    },
    [row]
  );

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
          isCompanyGood(row).value
            ? row.companyNo
            : `${isCompanyGood(row).title} for ${row.companyNo}`
        }
      >
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: !isCompanyGood(row).value ? "block" : "none",
              marginRight: "5px",
            }}
          >
            <FlagIcon sx={{ color: "#ff3838" }} />
          </div>
          <div>{row.companyName}</div>
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
