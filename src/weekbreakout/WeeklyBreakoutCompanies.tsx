import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
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

  breakoutCompaniesStatus: any;
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
    breakoutCompaniesStatus,
  } = props;

  const [filteredBreakoutCompanies, setFilteredBreakoutCompanies] = useState<
    BreakoutCompany[]
  >([]);
  const [tradingViewDialog] = useState(false);

  const [searchedCompanies, setSearchedCompanies] = useState<BreakoutCompany[]>(
    []
  );
  const [exchange, setExchange] = React.useState("All");
  const [dialogContent, setDialogContent] = React.useState<{
    content: string;
    callback: () => void;
  }>({ content: "", callback: () => {} });

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

  useEffect(() => {
    if (exchange === "All") {
      setSearchedCompanies(filteredBreakoutCompanies);
    } else {
      const exchangeCompanies = filteredBreakoutCompanies.filter(
        (company) => company.Exch.toLowerCase() === exchange.toLowerCase()
      );
      setSearchedCompanies(exchangeCompanies);
    }
  }, [exchange, filteredBreakoutCompanies]);

  function updateTradingView() {
    if (exchange === "BSE") {
      setDialogContent({
        content: `BSE companies will not be updated in trading view.`,
        callback: () => {
          setDialogContent({ content: "", callback: () => {} });
        },
      });
    } else if (exchange === "NSE") {
      setDialogContent({
        content: `The trading view will be updated for ${exchange} exchange`,
        callback: () => {
          setDialogContent({ content: "", callback: () => {} });
          updateTradingViewForBreakouts(filteredBreakoutCompanies);
        },
      });
    } else {
      setDialogContent({
        content: `The trading view will be updated for NSE exchange only`,
        callback: () => {
          setDialogContent({ content: "", callback: () => {} });
          updateTradingViewForBreakouts(filteredBreakoutCompanies);
        },
      });
    }
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
    let exchangeCompanies = [];
    if (exchange === "All") {
      exchangeCompanies = filteredBreakoutCompanies;
    } else {
      exchangeCompanies = filteredBreakoutCompanies.filter(
        (company) => company.Exch.toLowerCase() === exchange.toLowerCase()
      );
    }
    const newCompanies = exchangeCompanies.filter(
      (data) => data.Name.toLowerCase().indexOf(curValue) !== -1
    );
    setSearchedCompanies(newCompanies);
  };

  const handleDialogClose = () => {
    setDialogContent({ content: "", callback: () => {} });
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
            <div style={{ margin: 10 }}>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={exchange}
                onChange={(ev) => setExchange(ev.target.value)}
              >
                <FormControlLabel value="All" control={<Radio />} label="All" />
                <FormControlLabel value="NSE" control={<Radio />} label="NSE" />
                <FormControlLabel value="BSE" control={<Radio />} label="BSE" />
              </RadioGroup>
            </div>

            <div style={{ float: "right", margin: "10px" }}>
              <div>
                <span style={{ fontWeight: "bold" }}>Last Updated: </span>
                {new Date(breakoutCompaniesStatus.lastUpdatedAt).toDateString()}
              </div>
              <div>
                <span style={{ fontWeight: "bold" }}>Last Trading day : </span>

                {new Date(
                  breakoutCompaniesStatus.latestTradingDay
                ).toDateString()}
              </div>
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
          <Dialog
            open={dialogContent.content.length > 0}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {dialogContent.content}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Disagree</Button>
              <Button onClick={dialogContent.callback} autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
}
