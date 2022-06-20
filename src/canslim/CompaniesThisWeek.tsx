import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CanSlimCompanies } from "../interfaces/CanSlim";
import { CompanyDetails } from "../interfaces/CompanyDetails";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";

interface CompaniesThisWeekProps {
  canSlimList: CanSlimCompanies[];

  companyDetailsMap: Map<string, CompanyDetails>;

  loading: boolean;
}

export function CompaniesThisWeek(props: CompaniesThisWeekProps) {
  const { canSlimList, companyDetailsMap, loading } = props;

  let indexNo: number = 1;

  const [categorywiseCompanies, setCategorywiseCompanies] = useState<{
    removedCompanies: string[];
    newCompanies: string[];
    existingCompanies: string[];
  }>();

  useEffect(() => {
    if (canSlimList.length > 0) {
      const currentCompanies = canSlimList[0].companies;
      const previousCompanies = canSlimList[1]?.companies;
      if (!previousCompanies) {
        setCategorywiseCompanies({
          newCompanies: currentCompanies,
          existingCompanies: [],
          removedCompanies: [],
        });
        return;
      }
      let removedCompanies = new Set();
      for (let company of previousCompanies) {
        if (currentCompanies.indexOf(company) === -1) {
          removedCompanies.add(company);
        }
      }
      let newCompanies = new Set();
      for (let company of currentCompanies) {
        if (previousCompanies.indexOf(company) === -1) {
          newCompanies.add(company);
        }
      }
      let existingCompanies = new Set();
      const tmpArr = previousCompanies.concat(currentCompanies);
      for (let company of tmpArr) {
        if (!removedCompanies.has(company) && !newCompanies.has(company)) {
          existingCompanies.add(company);
        }
      }
      setCategorywiseCompanies({
        newCompanies: Array.from(newCompanies) as string[],
        existingCompanies: Array.from(existingCompanies) as string[],
        removedCompanies: Array.from(removedCompanies) as string[],
      });
    }
  }, [companyDetailsMap]);

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
              {categorywiseCompanies?.newCompanies.map((data) => (
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

              {categorywiseCompanies?.removedCompanies.map((data) => (
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
                    <Chip label="Removed" color="error" />
                  </TableCell>
                </TableRow>
              ))}

              {categorywiseCompanies?.existingCompanies.map((data) => (
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
                    <Chip label="No Change" />
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
