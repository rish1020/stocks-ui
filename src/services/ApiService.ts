import { APIConstants } from "../APIConstants";
import { Company } from "../interfaces/Company";
import { CompanyDetails } from "../interfaces/CompanyDetails";

const origin = "http://localhost:8000";

export async function getCompanies(
  companyNos?: string[]
): Promise<CompanyDetails[]> {
  try {
    console.log(companyNos);
    const response = await fetch(
      `${origin}/${APIConstants.COMPANIES}?companyNos=${companyNos}`
    );
    if (response.status != 200) {
      throw new Error(`Failed to get response - status ${response.status}`);
    }
    const data: CompanyDetails[] = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export async function updateCanSlim() {
  try {
    const response = await fetch(`${origin}/${APIConstants.UPDATE_CAN_SLIM}`);
    if (response.status != 200) {
      throw new Error(`Failed to get response - status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export async function getCanSlimList() {
  try {
    const response = await fetch(`${origin}/${APIConstants.GET_CAN_SLIM}`);
    if (response.status != 200) {
      throw new Error(`Failed to get response - status ${response.status}`);
    }
    const data = await response.json();
    return Promise.resolve(data);
  } catch (err) {
    throw err;
  }
}
