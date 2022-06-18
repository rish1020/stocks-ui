import { useEffect, useState } from "react";
import { CanSlimCompanies } from "../interfaces/CanSlim";
import { CompanyDetails } from "../interfaces/CompanyDetails";

interface CompaniesThisWeekProps {
  canSlimList: CanSlimCompanies[];

  companyDetailsMap: Map<string, CompanyDetails>;
}

export function CompaniesThisWeek(props: CompaniesThisWeekProps) {
  const { canSlimList, companyDetailsMap } = props;

  const [categorywiseCompanies, setCategorywiseCompanies] = useState<{
    removedCompanies: string[];
    newCompanies: string[];
    existingCompanies: string[];
  }>();

  useEffect(() => {
    if (canSlimList.length > 0) {
      const currentCompanies = canSlimList[0].companies;
      const previousCompanies = canSlimList[1]?.companies;
      if (!previousCompanies) {
        setCategorywiseCompanies({
          newCompanies: currentCompanies,
          existingCompanies: [],
          removedCompanies: [],
        });
        return;
      }
      let removedCompanies = new Set();
      for (let company of previousCompanies) {
        if (currentCompanies.indexOf(company) === -1) {
          removedCompanies.add(company);
        }
      }
      let newCompanies = new Set();
      for (let company of currentCompanies) {
        if (previousCompanies.indexOf(company) === -1) {
          newCompanies.add(company);
        }
      }
      let existingCompanies = new Set();
      const tmpArr = previousCompanies.concat(currentCompanies);
      for (let company of tmpArr) {
        if (!removedCompanies.has(company) && !newCompanies.has(company)) {
          existingCompanies.add(company);
        }
      }
      setCategorywiseCompanies({
        newCompanies: Array.from(newCompanies) as string[],
        existingCompanies: Array.from(existingCompanies) as string[],
        removedCompanies: Array.from(removedCompanies) as string[],
      });
    }
  }, [companyDetailsMap]);

  return (
    <>
      <div id="newCompanies">
        <h2> New Companies </h2>
        {categorywiseCompanies?.newCompanies &&
        categorywiseCompanies?.newCompanies.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
              </tr>
            </thead>
            <tbody>
              {categorywiseCompanies?.newCompanies.map((data) => {
                return (
                  <tr key={companyDetailsMap.get(data)?._id}>
                    <td>{companyDetailsMap.get(data)?.companyName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div>No Company added</div>
        )}
      </div>

      <div id="existingCompanies">
        <h2> Existing Companies </h2>
        {categorywiseCompanies?.existingCompanies &&
        categorywiseCompanies?.existingCompanies.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
              </tr>
            </thead>
            <tbody>
              {categorywiseCompanies?.existingCompanies.map((data) => {
                return (
                  <tr key={companyDetailsMap.get(data)?._id}>
                    <td>{companyDetailsMap.get(data)?.companyName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div>No Existing company</div>
        )}
      </div>

      <div id="existingCompanies">
        <h2> Removed Companies </h2>
        {categorywiseCompanies?.removedCompanies &&
        categorywiseCompanies?.removedCompanies.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
              </tr>
            </thead>
            <tbody>
              {categorywiseCompanies?.removedCompanies.map((data) => {
                return (
                  <tr key={companyDetailsMap.get(data)?._id}>
                    <td>{companyDetailsMap.get(data)?.companyName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div>No Company removed</div>
        )}
      </div>
    </>
  );
}
