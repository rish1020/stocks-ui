import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { BreakoutCompany } from "../interfaces/BreakoutCompany";
import { BreakoutWatchListCompany } from "../interfaces/BreakoutWatchListCompany";
import { getStoredBreakoutCompanies } from "../services/ApiService";

export interface WeekBreakoutCompaniesProps {
  breakoutCompanies: BreakoutCompany[];

  loading: boolean;

  smallMidCapLowDebtCompanies: string[];

  updateBreakoutCompanies: () => void;

  updateTradingViewForBreakouts: (data: BreakoutCompany[]) => void;

  watchListCompanies: BreakoutWatchListCompany[];

  updateWatchListCompany: (
    company: BreakoutCompany,
    clickOp: WatchlistClickOperation
  ) => void;
}

export type WatchlistClickOperation = "Add" | "Remove" | "Update";

type Color =
  | "primary"
  | "error"
  | "inherit"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | undefined;

export function WeekBreakoutCompanies(props: WeekBreakoutCompaniesProps) {
  const {
    breakoutCompanies,
    loading,
    smallMidCapLowDebtCompanies,
    updateBreakoutCompanies,
    updateTradingViewForBreakouts,
    watchListCompanies,
    updateWatchListCompany,
  } = props;

  const [filteredBreakoutCompanies, setFilteredBreakoutCompanies] = useState<
    BreakoutCompany[]
  >([]);

  const [searchedCompanies, setSearchedCompanies] = useState<BreakoutCompany[]>(
    []
  );

  let indexNo = 1;
  const [watchlistCompaniesNameList, setWatchListCompaniesNameList] = useState<
    string[]
  >([]);

  useEffect(() => {
    const companiesAfterFilter1 = breakoutCompanies.filter((company) => {
      return company.Info.C1 >= 30 && company.Info.C1 <= 500;
    });

    const companiesAfterFilter2 = companiesAfterFilter1.filter((company) => {
      return smallMidCapLowDebtCompanies.indexOf(company.Symb) != -1
        ? true
        : false;
    });

    companiesAfterFilter2.sort((company1, company2) => {
      if (company1.Info.NYHZG >= company2.Info.NYHZG) {
        return -1;
      }
      return 1;
    });

    setFilteredBreakoutCompanies(companiesAfterFilter2);
    setSearchedCompanies(companiesAfterFilter2);
  }, [breakoutCompanies]);

  useEffect(() => {
    const list = watchListCompanies.map((data) => data.Symb);

    list.length && setWatchListCompaniesNameList(list);
  }, [watchListCompanies]);

  function updateTradingView() {
    updateTradingViewForBreakouts(filteredBreakoutCompanies);
  }

  const getWatchlistModel = useCallback(
    (
      company: BreakoutCompany
    ): { label: string; clickOp: WatchlistClickOperation; color: Color } => {
      if (watchlistCompaniesNameList.indexOf(company.Symb) === -1) {
        return {
          label: "Add to watchlist",
          clickOp: "Add",
          color: "primary",
        };
      }
      return {
        label: "Remove from Watchlist",
        clickOp: "Remove",
        color: "error",
      };
    },
    [watchlistCompaniesNameList]
  );

  const onTextChanged = (elem: React.ChangeEvent<HTMLInputElement>) => {
    const curValue = elem.currentTarget.value.toLowerCase();
    const newCompanies = filteredBreakoutCompanies.filter(
      (data) => data.Name.toLowerCase().indexOf(curValue) !== -1
    );
    setSearchedCompanies(newCompanies);
  };

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
        <div>
          <div style={{ float: "right", margin: "10px" }}>
            <Button
              onClick={updateBreakoutCompanies}
              variant="contained"
              style={{ margin: "5px" }}
            >
              Update Companies
            </Button>
            <Button
              onClick={updateTradingView}
              variant="contained"
              style={{ margin: "5px" }}
            >
              Update Tradingview
            </Button>
          </div>
          <div id="breakout-companies">
            <div id="filter-labels" style={{ margin: "6px" }}>
              <Chip
                label="Price between 30-500"
                color="default"
                style={{ margin: "3px" }}
              />
              <Chip
                label="Small-Mid Cap"
                color="default"
                style={{ margin: "3px" }}
              />
              <Chip
                label="Low Debt"
                color="default"
                style={{ margin: "3px" }}
              />
            </div>

            <div style={{ margin: "6px" }}>
              <TextField
                id="standard-basic"
                label="Search "
                variant="standard"
                onChange={onTextChanged}
                style={{ width: "25%" }}
              />
            </div>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>S. No</TableCell>
                    <TableCell>Company No.</TableCell>
                    <TableCell>Company Name</TableCell>
                    <TableCell>Current Price</TableCell>
                    <TableCell>52W High</TableCell>
                    <TableCell>Gap from 52W High</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchedCompanies.map((company) => (
                    <TableRow
                      key={company.ID}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{indexNo++}</TableCell>
                      <TableCell component="th" scope="row">
                        {company.Symb}
                      </TableCell>
                      <TableCell>{company.Name}</TableCell>
                      <TableCell>{company.Info.C1}</TableCell>
                      <TableCell>{company.Info.NYH}</TableCell>
                      <TableCell>{company.Info.NYHZG.toFixed(1)}</TableCell>
                      <TableCell>
                        <Button
                          color={getWatchlistModel(company).color}
                          onClick={() =>
                            updateWatchListCompany(
                              company,
                              getWatchlistModel(company).clickOp
                            )
                          }
                        >
                          {getWatchlistModel(company).label}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      )}
    </>
  );
}
