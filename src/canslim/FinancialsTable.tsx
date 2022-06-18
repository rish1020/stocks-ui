import styled from "@emotion/styled";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";

export interface FinancialsTableProps {
  rows: FinancialTableRow[];
}

export enum GrowthRateKeys {
  Latest = "Latest",

  Previous = "Previous",

  SecondPrevious = "SecondPrevious",
}

type FinancialTableGrowthRate = Map<GrowthRateKeys, number | string>;

interface FinancialTableInstitutionType {
  latest: string;

  percentChange: string | number;
}

export interface FinancialTableRow {
  companyNo: string;

  companyName: string;

  latestQuarter: string;

  quarterlyEPS: FinancialTableGrowthRate;

  yearlyEPS: FinancialTableGrowthRate;

  yoyQuarterlySales: FinancialTableGrowthRate;

  yearlySales: FinancialTableGrowthRate;

  FIIsData: FinancialTableInstitutionType;

  DIIsData: FinancialTableInstitutionType;
}

export function FinancialsTable(props: FinancialsTableProps) {
  const { rows } = props;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 800 }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align="center" colSpan={3}>
                EPS % (Quarterly)
              </TableCell>
              <TableCell align="center" colSpan={3}>
                EPS % (Annually)
              </TableCell>
              <TableCell align="center" colSpan={3}>
                YOY Quarterly Sales %
              </TableCell>
              <TableCell align="center" colSpan={3}>
                Yearly Sales %
              </TableCell>
              <TableCell align="center" colSpan={2}>
                FIIs Data (Quarterly)
              </TableCell>
              <TableCell align="center" colSpan={2}>
                DIIs Data (Quarterly)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Latest Quarter</TableCell>
              {/* EPS % (Quarterly) */}
              <TableCell>Second Previous</TableCell>
              <TableCell>Previous</TableCell>
              <TableCell>Latest</TableCell>

              {/* EPS % (Annually) */}
              <TableCell>Second Previous</TableCell>
              <TableCell>Previous</TableCell>
              <TableCell>Latest</TableCell>

              {/* YOY Quarterly Sales % */}
              <TableCell>Second Previous</TableCell>
              <TableCell>Previous</TableCell>
              <TableCell>Latest</TableCell>

              {/* Yearly Sales % */}
              <TableCell>Second Previous</TableCell>
              <TableCell>Previous</TableCell>
              <TableCell>Latest</TableCell>

              {/* FIIs Data (Quarterly) */}
              <TableCell>Latest</TableCell>
              <TableCell>% change</TableCell>

              {/* DIIs Data (Quarterly) */}
              <TableCell>Latest</TableCell>
              <TableCell>% change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.companyNo}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.companyName}
                </TableCell>
                <TableCell>{row.latestQuarter}</TableCell>

                <TableCell>
                  {row.quarterlyEPS.get(GrowthRateKeys.SecondPrevious)}
                </TableCell>
                <TableCell>
                  {row.quarterlyEPS.get(GrowthRateKeys.Previous)}
                </TableCell>
                <TableCell>
                  {row.quarterlyEPS.get(GrowthRateKeys.Latest)}
                </TableCell>

                <TableCell>
                  {row.yearlyEPS.get(GrowthRateKeys.SecondPrevious)}
                </TableCell>
                <TableCell>
                  {row.yearlyEPS.get(GrowthRateKeys.Previous)}
                </TableCell>
                <TableCell>
                  {row.yearlyEPS.get(GrowthRateKeys.Latest)}
                </TableCell>

                <TableCell>
                  {row.yoyQuarterlySales.get(GrowthRateKeys.SecondPrevious)}
                </TableCell>
                <TableCell>
                  {row.yoyQuarterlySales.get(GrowthRateKeys.Previous)}
                </TableCell>
                <TableCell>
                  {row.yoyQuarterlySales.get(GrowthRateKeys.Latest)}
                </TableCell>

                <TableCell>
                  {row.yearlySales.get(GrowthRateKeys.SecondPrevious)}
                </TableCell>
                <TableCell>
                  {row.yearlySales.get(GrowthRateKeys.Previous)}
                </TableCell>
                <TableCell>
                  {row.yearlySales.get(GrowthRateKeys.Latest)}
                </TableCell>

                <TableCell>{row.FIIsData.latest}</TableCell>
                <TableCell>{row.FIIsData.percentChange}</TableCell>

                <TableCell>{row.DIIsData.latest}</TableCell>
                <TableCell>{row.DIIsData.percentChange}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

type Order = "asc" | "desc";

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Dessert (100g serving)",
  },
  {
    id: "calories",
    numeric: true,
    disablePadding: false,
    label: "Calories",
  },
  {
    id: "fat",
    numeric: true,
    disablePadding: false,
    label: "Fat (g)",
  },
  {
    id: "carbs",
    numeric: true,
    disablePadding: false,
    label: "Carbs (g)",
  },
  {
    id: "protein",
    numeric: true,
    disablePadding: false,
    label: "Protein (g)",
  },
];

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell align="center" colSpan={3}>
          EPS % (Quarterly)
        </TableCell>
        <TableCell align="center" colSpan={3}>
          EPS % (Annually)
        </TableCell>
        <TableCell align="center" colSpan={3}>
          YOY Quarterly Sales %
        </TableCell>
        <TableCell align="center" colSpan={3}>
          Yearly Sales %
        </TableCell>
        <TableCell align="center" colSpan={2}>
          FIIs Data (Quarterly)
        </TableCell>
        <TableCell align="center" colSpan={2}>
          DIIs Data (Quarterly)
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Latest Quarter</TableCell>
        {/* EPS % (Quarterly) */}
        <TableCell>Second Previous</TableCell>
        <TableCell>Previous</TableCell>
        <TableCell>Latest</TableCell>

        {/* EPS % (Annually) */}
        <TableCell>Second Previous</TableCell>
        <TableCell>Previous</TableCell>
        <TableCell>Latest</TableCell>

        {/* YOY Quarterly Sales % */}
        <TableCell>Second Previous</TableCell>
        <TableCell>Previous</TableCell>
        <TableCell>Latest</TableCell>

        {/* Yearly Sales % */}
        <TableCell>Second Previous</TableCell>
        <TableCell>Previous</TableCell>
        <TableCell>Latest</TableCell>

        {/* FIIs Data (Quarterly) */}
        <TableCell>Latest</TableCell>
        <TableCell>% change</TableCell>

        {/* DIIs Data (Quarterly) */}
        <TableCell>Latest</TableCell>
        <TableCell>% change</TableCell>
      </TableRow>
    </TableHead>
  );
}
