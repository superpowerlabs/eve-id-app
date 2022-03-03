// eslint-disable-next-line no-undef
const { BrowserRouter, Route, Switch } = ReactRouterDOM;

// eslint-disable-next-line no-undef
const { Modal, Button } = ReactBootstrap;

const ethers = require("ethers");
import clientApi from "../utils/ClientApi";
import config from "../config";
import ls from "local-storage";
import Common from "./Common";
import Header from "./Header";
import Footer from "./Footer";
import LandingPage from "./LandingPage";
import Error404 from "./Error404";

class App extends Common {
  constructor(props) {
    super(props);

    let localStore = JSON.parse(ls("localStore") || "{}");
    let pathhash = ethers.utils.id(window.location.pathname);

    if (/mobland/.test(window.location.origin)) {
      window.location = "https://mob.land";
    } else if (
      !/local/.test(location.origin) &&
      window.location.protocol === "http:"
    ) {
      window.location = location.href.replace(/^http:/, "https:");
    }

    this.state = {
      Store: Object.assign(
        {
          content: {},
          editing: {},
          temp: {},
          menuVisibility: false,
          config,
          width: this.getWidth(),
          pathname: window.location.pathname,
        },
        localStore
      ),
      pathhash,
    };

    this.bindMany([
      "handleClose",
      "handleShow",
      "setStore",
      "updateDimensions",
      "showModal",
      "setWallet",
      "connect",
    ]);
  }

  getWidth() {
    return window.innerWidth;
  }

  updateDimensions() {
    this.setStore({
      width: this.getWidth(),
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  async componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
    if (this.state.Store.connectedWith) {
      this.connect();
    }
  }

  async connect() {
    if (typeof window.ethereum !== "undefined") {
      let eth = window.ethereum;
      if (await eth.request({ method: "eth_requestAccounts" })) {
        eth.on("accountsChanged", () => window.location.reload());
        eth.on("chainChanged", () => window.location.reload());
        eth.on("disconnect", () => window.location.reload());
        this.setWallet(eth, "metamask");
      }
    }
  }

  async switchTo(chainId, chainName, symbol, rpcUrls) {
    if (window.clover !== undefined) {
      const provider = window.clover;
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId,
              chainName,
              nativeCurrency: {
                symbol,
                decimals: 18,
              },
              rpcUrls: [rpcUrls],
            },
          ],
        });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  }

  // chainId: '0x3',
  // chainName: 'Ropsten',
  // nativeCurrency: {
  //   symbol: 'RETH',
  //   decimals: 18,
  // },
  // rpcUrls: ['https://ropsten.infura.io/v3/your_key'],

  async setWallet() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const chainId = (await provider.getNetwork()).chainId;
      const connectedWallet = await signer.getAddress();

      const { contracts, connectedNetwork, networkNotSupported } =
        this.getContracts(config, chainId, provider);

      this.setStore({
        provider,
        signer,
        connectedWallet,
        chainId,
        contracts,
        connectedNetwork,
        networkNotSupported,
      });
      this.setStore(
        {
          connectedBefore: true,
        },
        true
      );
      clientApi.setConnectedWallet(connectedWallet, chainId);
    } catch (e) {
      console.error(e);
      // window.location.reload();
    }
  }

  getContracts(config, chainId, web3Provider) {
    let contracts = {};
    let networkNotSupported = false;
    let connectedNetwork = null;
    let addresses = config.contracts[chainId];
    if (addresses && config.supportedId[chainId]) {
      connectedNetwork = config.supportedId[chainId].chainName;
      for (let contractName in addresses) {
        contracts[contractName] = new ethers.Contract(
          addresses[contractName],
          config.abi[contractName],
          web3Provider
        );
      }
    } else {
      networkNotSupported = true;
    }
    return {
      contracts,
      connectedNetwork,
      networkNotSupported,
    };
  }

  showModal(modalTitle, modalBody, modalClose, secondButton, modalAction) {
    this.setStore({
      modalTitle,
      modalBody,
      modalClose,
      secondButton,
      modalAction,
      showModal: true,
    });
  }

  setStore(newProps, storeItLocally) {
    let store = this.state.Store;
    let localStore = JSON.parse(ls("localStore") || "{}");
    let saveLocalStore = false;
    for (let i in newProps) {
      if (newProps[i] === null) {
        if (storeItLocally) {
          delete localStore[i];
          saveLocalStore = true;
        }
        delete store[i];
      } else {
        if (storeItLocally) {
          localStore[i] = newProps[i];
          saveLocalStore = true;
        }
        store[i] = newProps[i];
      }
    }
    this.setState({
      Store: store,
    });
    if (saveLocalStore) {
      ls("localStore", JSON.stringify(localStore));
    }
  }

  render() {
    const Store = this.state.Store;
    return (
      <BrowserRouter>
        <Header Store={Store} setStore={this.setStore} connect={this.connect} />
        <main>
          <Switch>
            <Route exact path="/:accessCode">
              <LandingPage Store={Store} setStore={this.setStore} />
            </Route>
            <Route exact path="/">
              <LandingPage Store={Store} setStore={this.setStore} />
            </Route>
            <Route exact path="*">
              <Error404 Store={Store} setStore={this.setStore} />
            </Route>
          </Switch>
          <Footer />
        </main>
        {Store.showModal ? (
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Title>{Store.modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{Store.modalBody}</Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => {
                  this.setStore({ showModal: false });
                }}
              >
                {Store.modalClose || "Close"}
              </Button>
              {this.state.secondButton ? (
                <Button
                  onClick={() => {
                    Store.modalAction();
                    this.setStore({ showModal: false });
                  }}
                  bsStyle="primary"
                >
                  {Store.secondButton}
                </Button>
              ) : null}
            </Modal.Footer>
          </Modal.Dialog>
        ) : null}
      </BrowserRouter>
    );
  }
}

module.exports = App;
