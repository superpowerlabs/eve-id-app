import PropTypes from "prop-types";

import Common from "./Common";
import clientApi from "../utils/ClientApi";
import { isMobile } from "react-device-detect";

class Base extends Common {
  constructor(props) {
    super(props);
    this.bindMany([
      "setStore",
      "request",
      "setTimeout",
      "endTimeout",
      "waitForWeb3",
      "waitForContracts",
      "checkIfOperator",
    ]);
    this.Store = this.props.Store;
  }

  async checkIfOperator() {
    // await this.waitForContracts()
    // const {SynCityPasses} = this.Store.contracts
    // const isOperator = await SynCityPasses.operators(this.Store.connectedWallet)
    // this.setState({
    //   isOperator
    // })
  }

  isMobile() {
    return isMobile;
  }

  ellipseAddress(address, size = 6) {
    return `${address.slice(0, size)}...${address.slice(2 - size)}`;
  }

  request(api, method, params = {}, query = {}, multipart, extraHeaders) {
    return clientApi.request(
      api,
      method,
      params,
      query,
      multipart,
      extraHeaders
    );
  }

  setStore(...params) {
    this.props.setStore(...params);
  }

  componentWillUnmount() {
    if (this.timerId !== undefined) {
      clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  }

  async waitForWeb3() {
    while (!this.Store.connectedWallet && !this.Store.notConnected) {
      await this.sleep(100);
    }
  }

  async waitForContracts() {
    await this.waitForWeb3();
    while (!this.Store.contracts) {
      await this.sleep(100);
    }
  }

  setTimeout(func, time) {
    this.timerId = setTimeout(() => this.endTimeout(func), time);
  }

  endTimeout(func, time) {
    clearTimeout(this.timerId);
    this.timerId = null;
    func();
  }

  async sleep(millis) {
    // eslint-disable-next-line no-undef
    return new Promise((resolve) => setTimeout(resolve, millis));
  }

  render() {
    return <div />;
  }
}

Base.propTypes = {
  Store: PropTypes.object,
  setStore: PropTypes.func,
};

export default Base;
