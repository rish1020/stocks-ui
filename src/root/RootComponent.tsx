import { Component } from "react";
import { CanSlim } from "../canslim/CanSlim";

export class RootComponent extends Component {
  constructor(props: any) {
    super(props);
    console.log("inside cons");
  }

  componentDidMount() {
    console.log("inside component did moudn");
  }

  render() {
    console.log("inside rende3r");
    return (
      <div key={"root"}>
        <CanSlim />
      </div>
    );
  }
}
