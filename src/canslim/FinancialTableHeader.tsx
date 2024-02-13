import {
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import {
  FinancialTableRow,
  Order,
} from "../interfaces/FinancialTableInterfaces";
import { visuallyHidden } from "@mui/utils";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (orderBy === "badge") {
    const aLength = (a as any).badge.split(",").join().length;
    const bLength = (b as any).badge.split(",").join().length;
    if (bLength < aLength) {
      return -1;
    }
    if (bLength > aLength) {
      return 1;
    }
    return 0;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
export function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof FinancialTableRow
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof FinancialTableRow;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "companyName",
    numeric: false,
    disablePadding: false,
    label: "Company Name",
  },
  {
    id: "badge",
    numeric: false,
    disablePadding: true,
    label: "Badge",
  },
  {
    id: "latestQuarter",
    numeric: true,
    disablePadding: true,
    label: "Latest Quarter",
  },
  {
    id: "quarterlyEPSSecondPrevious",
    numeric: true,
    disablePadding: true,
    label: "Q EPS % (2nd Prev)",
  },
  {
    id: "quarterlyEPSPrevious",
    numeric: true,
    disablePadding: true,
    label: "Q EPS % (Prev)",
  },
  {
    id: "quarterlyEPSLatest",
    numeric: true,
    disablePadding: true,
    label: "Q EPS % (Cur)",
  },
  {
    id: "yearlyEPSSecondPrevious",
    numeric: true,
    disablePadding: true,
    label: "Y EPS % (2nd Prev)",
  },
  {
    id: "yearlyEPSPrevious",
    numeric: true,
    disablePadding: true,
    label: "Y EPS % (Prev)",
  },
  {
    id: "yearlyEPSLatest",
    numeric: true,
    disablePadding: true,
    label: "Y EPS % (Cur)",
  },
  {
    id: "yoyQuarterlySalesSecondPrevious",
    numeric: true,
    disablePadding: true,
    label: "YOY Q Sales% (2nd Prev)",
  },
  {
    id: "yoyQuarterlySalesPrevious",
    numeric: true,
    disablePadding: true,
    label: "YOY Q Sales% (Prev)",
  },
  {
    id: "yoyQuarterlySalesLatest",
    numeric: true,
    disablePadding: true,
    label: "YOY Q Sales% (Cur)",
  },
  {
    id: "yearlySalesSecondPrevious",
    numeric: true,
    disablePadding: true,
    label: "Y Sales% (2nd Prev)",
  },
  {
    id: "yearlySalesPrevious",
    numeric: true,
    disablePadding: true,
    label: "Y Sales% (Prev)",
  },
  {
    id: "yearlySalesLatest",
    numeric: true,
    disablePadding: true,
    label: "Y Sales% (Cur)",
  },
  {
    id: "FIIsDataLatest",
    numeric: true,
    disablePadding: true,
    label: "FIIs Latest",
  },
  {
    id: "FIIsDataPercentChange",
    numeric: true,
    disablePadding: true,
    label: "FIIs % change",
  },
  {
    id: "DIIsDataLatest",
    numeric: true,
    disablePadding: true,
    label: "DIIs Latest",
  },
  {
    id: "DIIsDataPercentChange",
    numeric: true,
    disablePadding: true,
    label: "DIIs % change",
  },
];

export function FinancialTableHeader(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof FinancialTableRow) =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "center" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
