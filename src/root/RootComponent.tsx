import { Box, Button, Tab, Tabs } from "@mui/material";
import React, { Component } from "react";
import { CanSlim } from "../canslim/CanSlim";
import ResponsiveAppBar from "../material-ui/ResponsiveAppBar";
import { TabPanel } from "../material-ui/TabPanel";
import { WeekBreakoutComponent } from "../weekbreakout/WeekBreakoutComponent";

const selectedPageKey = "selected-page";

export class RootComponent extends Component<{}, { value: number }> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: this.getSelectedIndexValue(),
    };
  }

  private pages: string[] = ["Breakouts", "Can Slim"];
  private settings: string[] = [];
  private responsiveBarRef = React.createRef<HTMLDivElement>();
  private appBarHeight: number = 75;

  componentDidMount() {
    console.log("inside component did moudn");
    console.log(this.responsiveBarRef.current?.offsetHeight);
    this.appBarHeight = this.responsiveBarRef.current?.offsetHeight || 0;
  }

  onPageClicked = (pageName: string) => {
    const newValue = this.pages.indexOf(pageName);
    this.setSelectedIndexValue(newValue);
    this.setState({
      ...this.state,
      value: newValue,
    });
  };

  getSelectedIndexValue = () => {
    return localStorage.getItem(selectedPageKey)
      ? Number(localStorage.getItem(selectedPageKey))
      : 0;
  };

  setSelectedIndexValue = (index: number) => {
    localStorage.setItem(selectedPageKey, String(index));
  };

  render() {
    console.log("inside render");
    return (
      <div key="root">
        <ResponsiveAppBar
          appName="Stocks"
          pages={this.pages}
          settings={this.settings}
          onPageClicked={this.onPageClicked}
          responsiveBarRef={this.responsiveBarRef}
          selected={this.state.value}
        />

        <Box
          sx={{ width: "100%", position: "absolute", top: this.appBarHeight }}
        >
          <TabPanel value={this.state.value} index={0}>
            <div>
              <WeekBreakoutComponent />
            </div>
          </TabPanel>
          <TabPanel value={this.state.value} index={1}>
            <div>
              <CanSlim />
            </div>
          </TabPanel>
        </Box>
      </div>
    );
  }
}
