import { APIConstants } from "../APIConstants";
import { BreakoutCompany } from "../interfaces/BreakoutCompany";
import { BreakoutWatchListCompany } from "../interfaces/BreakoutWatchListCompany";
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

export async function getStoredBreakoutCompanies() {
  try {
    const response = await fetch(
      `${origin}/${APIConstants.STORED_BREAKOUT_COMPANIES}`
    );
    if (response.status != 200) {
      throw new Error(`Failed to get response - status ${response.status}`);
    }
    const data = await response.json();
    return Promise.resolve(data);
  } catch (err) {
    throw err;
  }
}

export async function updateBreakoutCompanies() {
  try {
    const response = await fetch(
      `${origin}/${APIConstants.UPDATE_BREAKOUT_COMPANIES}`
    );
    if (response.status != 200) {
      throw new Error(`Failed to get response - status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export async function updateTradingViewForBreakouts(
  payload: BreakoutCompany[],
  emailId: string
) {
  try {
    console.log(JSON.stringify(payload));
    const response = await fetch(
      `${origin}/${APIConstants.UPDATE_TRADING_VIEW_FOR_BREAKOUT_COMPANIES}?emailId=${emailId}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.status != 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (err) {
    throw err;
  }
}

export async function addOrUpdateBreakoutWatchListCompany(
  company: BreakoutWatchListCompany
) {
  try {
    const response = await fetch(
      `${origin}/${APIConstants.BREAKOUT_WATCHLIST_COMPANY}`,
      {
        method: "POST",
        body: JSON.stringify(company),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (response.status != 200) {
      throw new Error(`Failed to get response - status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export async function getBreakoutWatchListCompany() {
  try {
    const response = await fetch(
      `${origin}/${APIConstants.BREAKOUT_WATCHLIST_COMPANY}`,
      {
        method: "GET",
      }
    );
    if (response.status != 200) {
      throw new Error(`Failed to get response - status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export async function removeBreakoutWatchListCompany(
  company: BreakoutWatchListCompany
) {
  try {
    console.log("request sent");
    const response = await fetch(
      `${origin}/${APIConstants.BREAKOUT_WATCHLIST_COMPANY}`,
      {
        method: "DELETE",
        body: JSON.stringify(company),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (response.status != 200) {
      throw new Error(`Failed to get response - status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export async function updateCompanyDetails(
  companyNos: { companyNo: string }[]
) {
  try {
    const response = await fetch(
      `${origin}/${APIConstants.UPDATE_COMPANY_DETAILS}`,
      {
        method: "POST",
        body: JSON.stringify(companyNos),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (response.status != 200) {
      throw new Error(`Failed to get response - status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}
