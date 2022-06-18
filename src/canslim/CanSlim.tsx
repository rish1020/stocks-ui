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

enum Section {
  CompaniesThisWeek = "CompaniesThisWeek",
  CompaniesFinancials = "CompaniesFinancials",
}

export function CanSlim() {
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails[]>([]);

  const [section, setSection] = useState<Section>(Section.CompaniesFinancials);

  const [canSlimList, setCanSlimList] = useState<any[]>([]);

  const [companyDetailsMap, setCompanyDetailsMap] = useState(
    new Map<string, CompanyDetails>()
  );

  useEffect(() => {
    console.log("inside effect", canSlimList);
    if (canSlimList.length === 0) {
      getCanSlimList()
        .then((data) => {
          // Set only last 2 weeks data
          const noOfWeeks = 2;
          const sortedData = data.sort(
            (a: CanSlimCompanies, b: CanSlimCompanies) => {
              return new Date(a.date).getTime() - new Date(b.date).getTime() >=
                0
                ? -1
                : 1;
            }
          );
          const newData = sortedData.splice(0, noOfWeeks);
          setCanSlimList(newData);
        })
        .catch((err) => alert(err));
    }
  }, []);

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
    updateCanSlim().then(() => {
      console.log("done updating companies");
    });
    console.log(canSlimList);
  }

  return (
    <>
      <section>
        <button onClick={() => setSection(Section.CompaniesThisWeek)}>
          Companies this week
        </button>
        <button onClick={() => setSection(Section.CompaniesFinancials)}>
          Companies Details
        </button>
      </section>

      {section === Section.CompaniesThisWeek && companyDetailsMap.size > 0 && (
        <section>
          <section>
            <button onClick={updateCanSlimCompanies}>Update</button>
          </section>
          <section>
            <CompaniesThisWeek
              canSlimList={canSlimList}
              companyDetailsMap={companyDetailsMap}
            />
          </section>
        </section>
      )}

      {section === Section.CompaniesFinancials && (
        <section>
          <CompaniesFinancialsComponent companyDetails={companyDetails} />
        </section>
      )}
    </>
  );
}
