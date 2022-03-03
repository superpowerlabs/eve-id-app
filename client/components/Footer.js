import Base from "./Base";
import { isMobile } from "react-device-detect";

export default class Footer extends Base {
  render() {
    // const { loaded } = this.state;

    return (
      <div className={"footer2 centered mb100"}>
        Copyright © 2022 Eve.ID - All right reserved
      </div>
    );
  }
}
