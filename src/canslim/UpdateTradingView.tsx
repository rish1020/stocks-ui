import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  Select,
  MenuItem,
  DialogActions,
  SelectChangeEvent,
} from "@mui/material";
import { updateTradingViewForBreakouts } from "../services/ApiService";
import { useState } from "react";
import { BreakoutCompany } from "../interfaces/BreakoutCompany";

interface UpdateTradingViewProps {
  companies: BreakoutCompany[];
}

export function UpdateTradingView(props: UpdateTradingViewProps) {
  const { companies } = props;
  const [email, setEmail] = useState("");
  const [dialogContent, setDialogContent] = useState<{
    content: string;
    callback: () => void;
  }>({ content: "", callback: () => {} });
  const handleDialogClose = () => {
    setDialogContent({ content: "", callback: () => {} });
  };

  const handleEmailChange = (event: SelectChangeEvent) => {
    console.log("changing email id", event.target.value);
    setEmail(event.target.value as string);
  };

  function updateTradingView() {
    setDialogContent({
      content: `All the companies will be updated in trading view`,
      callback: () => {},
    });
  }

  return (
    <>
      <Button
        onClick={updateTradingView}
        variant="contained"
        style={{ margin: "5px" }}
      >
        Update Tradingview
      </Button>
      <Dialog
        open={dialogContent.content.length > 0}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ margin: "10px 0" }}
          >
            {dialogContent.content}
          </DialogContentText>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={email}
            label="Age"
            onChange={handleEmailChange}
            style={{
              minWidth: 230,
            }}
          >
            <MenuItem value={"arya.arya.rishab@gmail.com"}>
              arya.arya.rishab@gmail.com
            </MenuItem>
            <MenuItem value={"rishav.arya2720@gmail.com"}>
              rishav.arya2720@gmail.com
            </MenuItem>
            <MenuItem value={"rishav.arya1020@gmail.com"}>
              rishav.arya1020@gmail.com
            </MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Disagree</Button>
          <Button
            onClick={() => {
              setDialogContent({ content: "", callback: () => {} });
              updateTradingViewForBreakouts(companies, email);
            }}
            autoFocus
            disabled={email.length === 0}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
