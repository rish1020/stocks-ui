import { useEffect, useState } from "react";
import {
  getCanSlimList,
  getCompanies,
  updateCanSlim,
} from "../services/ApiService";
import { Company } from "../interfaces/Company";
import { CompaniesThisWeek } from "./CompaniesThisWeek";
import { CanSlimCompanies } from "../interfaces/CanSlim";
import { CompanyDetails } from "../interfaces/CompanyDetails";
import { CompaniesFinancialsComponent } from "./CompaniesFinancialsComponent";
import { AppBar, Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { TabPanel } from "../material-ui/TabPanel";

export function CanSlim() {
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails[]>([]);

  const [value, setValue] = useState(0);

  const [canSlimList, setCanSlimList] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [positiveTechnicalCompanies, setPositiveTechnicalCompanies] = useState<
    string[]
  >([]);

  const [companyDetailsMap, setCompanyDetailsMap] = useState(
    new Map<string, CompanyDetails>()
  );

  useEffect(() => {
    if (canSlimList.length === 0) {
      setLoading(true);
      getCanSlimData();
    }
  }, []);

  function getCanSlimData() {
    getCanSlimList()
      .then((data) => {
        // Set only last 2 weeks data
        const noOfWeeks = 2;
        const sortedData = data.sort(
          (a: CanSlimCompanies, b: CanSlimCompanies) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime() >= 0
              ? -1
              : 1;
          }
        );
        const newData = sortedData.splice(0, noOfWeeks);
        const postiveTechCompanies = newData[0].positiveTechnicals;
        setPositiveTechnicalCompanies(postiveTechCompanies);
        setCanSlimList(newData);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        alert(err);
      });
  }

  useEffect(() => {
    canSlimList.length && getLastNWeeksCanSlimCompanyDetails(canSlimList);
  }, [canSlimList]);

  useEffect(() => {
    const map = new Map();
    for (let company of companyDetails) {
      map.set(company.companyNo, company);
    }
    map.size && setCompanyDetailsMap(map);
  }, [companyDetails]);

  function getLastNWeeksCanSlimCompanyDetails(data: CanSlimCompanies[]) {
    const set = new Set(data[0].companies);
    if (data[1]) {
      for (let company of data[1].companies) {
        set.add(company);
      }
    }
    const companyNos = Array.from(set);
    getCompanies(companyNos)
      .then((data) => {
        setCompanyDetails(data);
      })
      .catch((err) => alert("Error while fetching companies"));
  }

  function updateCanSlimCompanies() {
    setLoading(true);
    updateCanSlim().then(() => {
      setLoading(false);
      getCanSlimData();
    });
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
            <Tab label="Companies this week" />
            <Tab label="Companies Details" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <div>
            <div style={{ float: "right", margin: "10px" }}>
              <Button onClick={updateCanSlimCompanies} variant="contained">
                Update Companies
              </Button>
            </div>
            <div>
              <CompaniesThisWeek
                canSlimList={canSlimList}
                companyDetailsMap={companyDetailsMap}
                loading={loading}
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div>
            <CompaniesFinancialsComponent
              companyDetails={companyDetails}
              positiveTechCompanies={positiveTechnicalCompanies}
            />
          </div>
        </TabPanel>
      </Box>
    </>
  );
}
