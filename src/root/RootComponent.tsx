import { Box, Button, Tab, Tabs } from "@mui/material";
import { Component } from "react";
import { CanSlim } from "../canslim/CanSlim";
import { TabPanel } from "../material-ui/TabPanel";
import { WeekBreakoutComponent } from "../weekbreakout/WeekBreakoutComponent";

export class RootComponent extends Component<{}, { value: number }> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  componentDidMount() {
    console.log("inside component did moudn");
  }

  handleChange = (event: React.SyntheticEvent, newValue: number) => {
    this.setState({
      ...this.state,
      value: newValue,
    });
  };

  render() {
    return (
      <div key="root">
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Breakouts" />
              <Tab label="CAN SLIM" />
            </Tabs>
          </Box>
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
