import { useCallback, useEffect, useState } from "react";
import { BreakoutCompany } from "../interfaces/BreakoutCompany";
import { WatchlistClickOperation } from "../weekbreakout/WeeklyBreakoutCompanies";
import { Button } from "@mui/material";
import { BreakoutWatchListCompany } from "../interfaces/BreakoutWatchListCompany";
import WatchLaterIcon from "@mui/icons-material/WatchLater";

type Color =
  | "primary"
  | "error"
  | "inherit"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | undefined;

interface AddWatchListComponentProps {
  watchListCompanies: BreakoutWatchListCompany[];
  company: BreakoutWatchListCompany;
  updateWatchListCompany: (
    company: BreakoutCompany,
    clickOp: WatchlistClickOperation
  ) => void;
}

export function AddWatchListComponent(props: AddWatchListComponentProps) {
  const { watchListCompanies, company, updateWatchListCompany } = props;
  const [watchlistCompaniesNameList, setWatchListCompaniesNameList] = useState<
    string[]
  >([]);

  useEffect(() => {
    const list = watchListCompanies.map((data) => data.Symb);

    list.length && setWatchListCompaniesNameList(list);
  }, [watchListCompanies]);

  const getWatchlistModel = useCallback(
    (
      company: BreakoutCompany
    ): { label: string; clickOp: WatchlistClickOperation; color: Color } => {
      if (watchlistCompaniesNameList.indexOf(company.Symb) === -1) {
        return {
          label: "Add",
          clickOp: "Add",
          color: "primary",
        };
      }
      return {
        label: "Remove ",
        clickOp: "Remove",
        color: "error",
      };
    },
    [watchlistCompaniesNameList]
  );

  return (
    <Button
      color={getWatchlistModel(company).color}
      onClick={() =>
        updateWatchListCompany(company, getWatchlistModel(company).clickOp)
      }
    >
      <WatchLaterIcon style={{ marginRight: 10 }} />{" "}
      {getWatchlistModel(company).label}
    </Button>
  );
}
