import { TableChartOutlined } from "@mui/icons-material";
import { Box, Table, TableBody, TableContainer } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useCallback, useEffect, useState } from "react";
import {
  FinancialTableRow,
  Order,
} from "../interfaces/FinancialTableInterfaces";
import {
  FinancialTableHeader,
  getComparator,
  stableSort,
} from "./FinancialTableHeader";
import { FinancialTableRowComponent } from "./FinancialTableRowComponent";

export interface FinancialsTableProps {
  rows: FinancialTableRow[];

  positiveTechCompanies: string[];
}

export function FinancialsTable(props: FinancialsTableProps) {
  const { rows, positiveTechCompanies } = props;

  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof FinancialTableRow>(
    "FIIsDataPercentChange"
  );
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [goodCompanies, setGoodCompanies] = useState<FinancialTableRow[]>([]);
  const [poorCompanies, setPoorCompanies] = useState<FinancialTableRow[]>([]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof FinancialTableRow
  ) => {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.companyNo);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const isCompanyGood = useCallback(
    (row: FinancialTableRow): { value: boolean | null; title?: string } => {
      if (row.FIIsDataPercentChange < 0 && row.DIIsDataPercentChange < 0) {
        return {
          title: "Institution share is decreasing or not present",
          value: false,
        };
      }
      if (positiveTechCompanies.indexOf(row.companyNo) !== -1) {
        return {
          value: true,
          title: "Technicals are good",
        };
      }
      return {
        value: null,
      };
    },
    []
  );

  useEffect(() => {
    const _poorCompanies = rows.filter(
      (data) => isCompanyGood(data).value === false
    );
    const _goodCompanies = rows.filter(
      (data) =>
        isCompanyGood(data).value === true || isCompanyGood(data).value === null
    );
    setGoodCompanies(_goodCompanies);
    setPoorCompanies(_poorCompanies);
  }, [rows]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: window.innerHeight }}>
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
            <FinancialTableHeader
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={goodCompanies.length}
            />
            <TableBody>
              {stableSort(goodCompanies, getComparator(order, orderBy)).map(
                (row) => {
                  return (
                    <FinancialTableRowComponent
                      row={row}
                      key={row.companyNo}
                      isCompanyGood={isCompanyGood}
                    />
                  );
                }
              )}
              {poorCompanies.map((row) => (
                <FinancialTableRowComponent
                  row={row}
                  key={row.companyNo}
                  isCompanyGood={isCompanyGood}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
