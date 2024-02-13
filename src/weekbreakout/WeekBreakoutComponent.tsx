import { Box, Button, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { BreakoutCompany } from "../interfaces/BreakoutCompany";
import { BreakoutWatchListCompany } from "../interfaces/BreakoutWatchListCompany";
import { TabPanel } from "../material-ui/TabPanel";
import * as ApiService from "../services/ApiService";
import {
  WatchlistClickOperation,
  WeekBreakoutCompanies,
} from "./WeeklyBreakoutCompanies";
import { WeeklyBreakoutCompanyDetails } from "./WeeklyBreakoutCompanyDetails";
import { WeeklyBreakoutWatchlistComponent } from "./WeeklyBreakoutWatchlistComponent";

export interface WeekBreakoutComponentProps {}

export function WeekBreakoutComponent(props: WeekBreakoutComponentProps) {
  const [value, setValue] = useState(0);
  const [breakoutCompanies, setBreakoutCompanies] = useState([]);
  const [smallMidCapLowDebtCompanies, setSmallMidCapLowDebtCompanies] =
    useState([]);
  const [breakoutCompaniesStatus, setBreakoutCompaniesStatus] = useState({});

  const [loading, setLoading] = useState(false);
  const [companyDetailsCompanies, setCompanyDetailsCompanies] = useState<
    BreakoutCompany[]
  >([]);

  const [watchListCompanies, setWatchListCompanies] = useState<
    BreakoutWatchListCompany[]
  >([]);

  useEffect(() => {
    fetchLatestCompanies();
    getWatchListCompanies();
  }, []);

  function fetchLatestCompanies() {
    setLoading(true);
    ApiService.getStoredBreakoutCompanies()
      .then((data) => {
        setBreakoutCompanies(data.breakoutCompanies);
        setSmallMidCapLowDebtCompanies(
          data.smallMidCapLowDebtCompanies.companies
        );
        setBreakoutCompaniesStatus(data.dateStatus);
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  }

  async function updateBreakoutCompanies() {
    try {
      setLoading(true);
      await ApiService.updateBreakoutCompanies();
      fetchLatestCompanies();
    } catch (error) {
      setLoading(false);
    }
  }

  const updateWatchListCompany = (
    company: BreakoutCompany,
    clickOp: WatchlistClickOperation
  ) => {
    if (clickOp === "Add") {
      console.log(company);
      ApiService.addOrUpdateBreakoutWatchListCompany(company)
        .then((data) => {
          const newCompany: BreakoutWatchListCompany = {
            ...company,
            Notes: "",
          };
          watchListCompanies.push(newCompany);
          const updatedWatchListCompanies = watchListCompanies.map(
            (data) => data
          );
          setWatchListCompanies(updatedWatchListCompanies);
        })
        .catch((error) => {
          alert(error);
        });
    } else if (clickOp === "Remove") {
      const finalCompany = watchListCompanies.filter(
        (data) => data.Symb === company.Symb
      );
      ApiService.removeBreakoutWatchListCompany(finalCompany[0])
        .then((data) => {
          const index = watchListCompanies.indexOf(finalCompany[0]);
          watchListCompanies.splice(index, 1);
          const updatedWatchListCompanies = watchListCompanies.map(
            (data) => data
          );
          setWatchListCompanies(updatedWatchListCompanies);
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const getWatchListCompanies = () => {
    setLoading(true);
    ApiService.getBreakoutWatchListCompany()
      .then((data) => {
        setWatchListCompanies(data);
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  };

  async function updateTradingViewForBreakouts(
    data: BreakoutCompany[],
    emailId: string
  ) {
    try {
      setLoading(true);
      await ApiService.updateTradingViewForBreakouts(data, emailId);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      alert(error);
    }
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const updateNoteForCompany = (note: string, index: number) => {
    const company = watchListCompanies[index];
    company.Notes = note;
    ApiService.addOrUpdateBreakoutWatchListCompany(company)
      .then((data) => {
        const newCompanies = [...watchListCompanies];
        setWatchListCompanies(newCompanies);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const updateCompaniesForCompanyDetails = (companies: BreakoutCompany[]) => {
    setCompanyDetailsCompanies(companies);
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
            <Tab label="Company Details" />
            <Tab label="WatchList" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <div>
            <WeekBreakoutCompanies
              breakoutCompanies={breakoutCompanies}
              loading={loading}
              smallMidCapLowDebtCompanies={smallMidCapLowDebtCompanies}
              updateBreakoutCompanies={updateBreakoutCompanies}
              updateTradingViewForBreakouts={updateTradingViewForBreakouts}
              watchListCompanies={watchListCompanies}
              updateWatchListCompany={updateWatchListCompany}
              breakoutCompaniesStatus={breakoutCompaniesStatus}
              updateCompaniesForCompanyDetails={
                updateCompaniesForCompanyDetails
              }
            />
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div>
            <WeeklyBreakoutCompanyDetails
              breakoutCompanies={breakoutCompanies}
              companyDetailsCompanies={companyDetailsCompanies}
              watchListCompanies={watchListCompanies}
              updateWatchListCompany={updateWatchListCompany}
              loading={loading}
            />
          </div>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div>
            <WeeklyBreakoutWatchlistComponent
              watchListCompanies={watchListCompanies}
              loading={loading}
              updateNoteForCompany={updateNoteForCompany}
              updateWatchListCompany={updateWatchListCompany}
            />
          </div>
        </TabPanel>
      </Box>
    </>
  );
}
