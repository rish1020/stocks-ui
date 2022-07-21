import { useEffect, useState } from "react";
import { CompaniesFinancialsComponent } from "../canslim/CompaniesFinancialsComponent";
import { BreakoutWatchListCompany } from "../interfaces/BreakoutWatchListCompany";
import { CompanyDetails } from "../interfaces/CompanyDetails";
import { getCompanies } from "../services/ApiService";

export interface WeeklyBreakoutCompanyDetailsProps {
  loading: boolean;

  watchListCompanies: BreakoutWatchListCompany[];
}

export function WeeklyBreakoutCompanyDetails(
  props: WeeklyBreakoutCompanyDetailsProps
) {
  const { watchListCompanies } = props;

  const [companyDetails, setCompanyDetails] = useState<CompanyDetails[]>([]);

  useEffect(() => {
    const companyNos = watchListCompanies.map((data) => data.Symb);
    getCompanies(companyNos)
      .then((data) => {
        setCompanyDetails(data);
      })
      .catch((err) => alert("Error while fetching companies"));
  }, []);

  return (
    <>
      <CompaniesFinancialsComponent
        companyDetails={companyDetails}
        positiveTechCompanies={[]}
      />
    </>
  );
}
