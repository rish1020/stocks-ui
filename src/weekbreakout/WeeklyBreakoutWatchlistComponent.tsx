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
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { BreakoutWatchListCompany } from "../interfaces/BreakoutWatchListCompany";
import * as ApiService from "../services/ApiService";

export interface WeeklyBreakoutWatchlistComponentProps {
  loading: boolean;

  watchListCompanies: BreakoutWatchListCompany[];

  updateNoteForCompany: (note: string, index: number) => void;
}

export function WeeklyBreakoutWatchlistComponent(
  props: WeeklyBreakoutWatchlistComponentProps
) {
  const { loading, watchListCompanies, updateNoteForCompany } = props;

  const [companies, setCompanies] = useState<BreakoutWatchListCompany[]>([]);

  const [notes, setNotes] = useState<string[]>([]);

  let indexNo = 1;

  const fetchCompanyDetails = () => {
    const companyNos = watchListCompanies.map((data) => {
      return { companyNo: data.Symb };
    });
    ApiService.updateCompanyDetails(companyNos)
      .then((data) => {
        alert("Fetch completed");
      })
      .catch((error) => {
        alert(error);
      });
  };

  useEffect(() => {
    const notes = watchListCompanies.map((data) => data.Notes || "");
    setNotes(notes);
  }, [watchListCompanies]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, id } = e.target;

    // Make a shallow copy of the current `data`.
    const newArray = [...notes];

    // Update the changed item.
    const index = Number(id);
    newArray[index] = value;

    // Call setData to update.
    setNotes(newArray);
  };

  const updateNotes = (index: number) => {
    const note = notes[index];
    updateNoteForCompany(note, index);
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
              onClick={fetchCompanyDetails}
              variant="contained"
              style={{ margin: "5px" }}
            >
              Fetch Company Details
            </Button>
          </div>
          <div id="breakout-companies">
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
                    <TableCell>Notes</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {watchListCompanies.map((company, index) => (
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
                        <TextField
                          id={index.toString()}
                          multiline
                          hiddenLabel
                          maxRows={2}
                          fullWidth
                          value={notes[index]}
                          onChange={handleNotesChange}
                        />
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => updateNotes(index)}>
                          Update
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
