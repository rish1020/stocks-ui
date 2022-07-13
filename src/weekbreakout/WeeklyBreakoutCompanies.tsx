import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect } from "react";
import { BreakoutCompany } from "../interfaces/BreakoutCompany";
import { getStoredBreakoutCompanies } from "../services/ApiService";

export interface WeekBreakoutCompaniesProps {
  breakoutCompanies: BreakoutCompany[];

  loading: boolean;
}

export function WeekBreakoutCompanies(props: WeekBreakoutCompaniesProps) {
  const { breakoutCompanies, loading } = props;

  useEffect(() => {}, []);

  return (
    <>
      {loading && (
        <Box
          sx={{
            width: "100%",
            position: "absolute",
            left: window.innerWidth / 2,
            top: window.innerHeight / 2,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {!loading && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>S. No</TableCell>
                <TableCell>Company No.</TableCell>
                <TableCell>Latest Quarter</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {breakoutCompanies.map((data) => (
                <TableRow
                  key={companyDetailsMap.get(data)?._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{indexNo++}</TableCell>
                  <TableCell component="th" scope="row">
                    {companyDetailsMap.get(data)?.companyNo}
                  </TableCell>
                  <TableCell>
                    {companyDetailsMap.get(data)?.quartersData[0].quarterName}
                  </TableCell>
                  <TableCell>
                    {companyDetailsMap.get(data)?.companyName}
                  </TableCell>
                  <TableCell>
                    <Chip label="Newly Added" color="success" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
