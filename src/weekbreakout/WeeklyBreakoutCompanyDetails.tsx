import { useEffect, useState } from "react";
import { CompaniesFinancialsComponent } from "../canslim/CompaniesFinancialsComponent";
import { BreakoutWatchListCompany } from "../interfaces/BreakoutWatchListCompany";
import { CompanyDetails } from "../interfaces/CompanyDetails";
import { getCompanies } from "../services/ApiService";
import { BreakoutCompany } from "../interfaces/BreakoutCompany";
import { WatchlistClickOperation } from "./WeeklyBreakoutCompanies";
import { Chip } from "@mui/material";

export interface WeeklyBreakoutCompanyDetailsProps {
  loading: boolean;

  companyDetailsCompanies: BreakoutWatchListCompany[];

  watchListCompanies: BreakoutWatchListCompany[];

  updateWatchListCompany: (
    company: BreakoutCompany,
    clickOp: WatchlistClickOperation
  ) => void;

  breakoutCompanies: BreakoutCompany[];
}

export function WeeklyBreakoutCompanyDetails(
  props: WeeklyBreakoutCompanyDetailsProps
) {
  const {
    companyDetailsCompanies,
    watchListCompanies,
    updateWatchListCompany,
    breakoutCompanies,
  } = props;

  const [companyDetails, setCompanyDetails] = useState<CompanyDetails[]>([]);

  useEffect(() => {
    const companyNos = companyDetailsCompanies.map((data) => data.Symb);
    getCompanies(companyNos)
      .then((data) => {
        setCompanyDetails(data);
      })
      .catch((err) => alert("Error while fetching companies"));
  }, []);

  return (
    <>
      <div id="filter-labels" style={{ margin: "6px" }}>
        <Chip
          label="Q - YoY Quarterly EPS greater than 30 for last 2 quarters"
          color="default"
          style={{ margin: "3px" }}
        />
        <Chip
          label="A - Annual EPS greater than 20 for last 2 years"
          color="default"
          style={{ margin: "3px" }}
        />
        <Chip
          label="S - YoY sales growth greater than 25"
          color="default"
          style={{ margin: "3px" }}
        />
        <Chip
          label="I - FIIs & DIIs share greater than 0"
          color="default"
          style={{ margin: "3px" }}
        />
      </div>
      <CompaniesFinancialsComponent
        companyDetails={companyDetails}
        positiveTechCompanies={[]}
        watchListCompanies={watchListCompanies}
        updateWatchListCompany={updateWatchListCompany}
        breakoutCompanies={breakoutCompanies}
      />
    </>
  );
}
