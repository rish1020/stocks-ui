import { Box, Button, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { TabPanel } from "../material-ui/TabPanel";
import * as ApiService from "../services/ApiService";
import { WeekBreakoutCompanies } from "./WeeklyBreakoutCompanies";

export interface WeekBreakoutComponentProps {}

export function WeekBreakoutComponent(props: WeekBreakoutComponentProps) {
  const [value, setValue] = useState(0);
  const [breakoutCompanies, setBreakoutCompanies] = useState([]);

  useEffect(() => {
    fetchLatestCompanies();
  }, []);

  function fetchLatestCompanies() {
    ApiService.getStoredBreakoutCompanies()
      .then((data) => {
        setBreakoutCompanies(data);
      })
      .catch((error) => {
        alert(error);
      });
  }

  async function updateBreakoutCompanies() {
    await ApiService.updateBreakoutCompanies();
    fetchLatestCompanies();
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Companies" />
            <Tab label="Companies Details" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <div>
            <div style={{ float: "right", margin: "10px" }}>
              <Button onClick={updateBreakoutCompanies} variant="contained">
                Update Companies
              </Button>
              <WeekBreakoutCompanies breakoutCompanies={breakoutCompanies} />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}></TabPanel>
      </Box>
    </>
  );
}
