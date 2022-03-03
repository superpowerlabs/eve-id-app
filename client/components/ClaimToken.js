// eslint-disable-next-line no-undef
const { Row, Col, Button, Container } = ReactBootstrap;

import Base from "./Base";
import Ab from "./lib/Ab";
import auth from "./lib/Auth";
export default class ClaimToken extends Base {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      solution: "",
    };

    this.bindMany(["getAValidSignature", "mintYourToken"]);
  }

  async getAValidSignature() {
    if (!this.Store.connectedWallet) {
      return alert("Please, connect your metamask to continue");
    }
    this.setState({
      minting: true,
    });
    const { landingAccessToken } = this.Store;
    const { msgParams, signature } = await auth.getSignedAuthToken(
      this.Store.chainId,
      this.Store.connectedWallet,
      {
        accessToken: landingAccessToken,
      },
      "EveID"
    );
    if (!signature) {
      return this.setState({
        minting: false,
        error: "Signing canceled",
      });
    }
    const res = await this.request("give-me-an-auth-code", "post", {
      msgParams,
      signature,
    });
    if (res.success) {
      await this.mintYourToken(res);
    } else {
      this.setState({
        error: res.error,
        minting: false,
      });
    }
  }

  async mintYourToken(res) {
    const { authCode, signature } = res;
    this.setState({
      error: undefined,
    });
    if (this.Store.connectedNetwork) {
      const { EveIDNft } = this.Store.contracts;
      if (EveIDNft && authCode && signature) {
        try {
          let maxTokenId = (await EveIDNft.maxTokenId()).toNumber();
          let nextTokenId = (await EveIDNft.nextTokenId()).toNumber();
          if (
            nextTokenId >= maxTokenId
          ) {
            return this.setState({
              error:
                "It looks like all the NFT for this stage have been minted",
            });
          }
          const balance0 = (
            await EveIDNft.balanceOf(this.Store.connectedWallet)
          ).toNumber();
          const transaction = await EveIDNft.connect(
            this.Store.signer
          ).claimFreeToken(authCode, signature, {
            gasLimit: 300000,
          });
          await transaction.wait();
          const balance = (
            await EveIDNft.balanceOf(this.Store.connectedWallet)
          ).toNumber();
          if (balance > balance0) {
            const tokenId = (await EveIDNft.tokenOfOwnerByIndex(
              this.Store.connectedWallet,
              balance - 1
            )).toNumber()
            this.request("complete-minting", "post", {
              accessToken: this.Store.landingAccessToken,
              tokenId,
              authCode,
            });
            this.setState({
              congratulations: true,
              minting: false,
              tokenId,
            });
          } else {
            this.setState({
              error: "It looks like something went wrong",
              minting: false,
            });
          }
        } catch (e) {
          this.setState({
            error: this.decodeError(e.message),
            minting: false,
          });
        }
      }
    } else {
      this.setState({
        error: "You must connect to a supported network",
      });
    }
  }

  render() {
    return (
      <div>
        <Container className={"topContainer"}>
          <div className={"home-section"} style={{ paddingTop: 40 }}>
            <Row>
              <Col>
                <div className={"centered bordered"}>
                  {this.Store.networkNotSupported ? (
                    <div>Switch to a supported network</div>
                  ) : this.state.congratulations ? (
                    <div>
                      {" "}
                      Congratulations, you minted token #{this.state.tokenId}
                    </div>
                  ) : (
                    <Button
                      size={"lg"}
                      onClick={this.getAValidSignature}
                      disabled={this.state.minting}
                    >
                      Mint your token
                    </Button>
                  )}
                </div>
                {this.state.error ? (
                  <div className={"error centered crimson"}>
                    {this.state.error}
                  </div>
                ) : null}
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    );
  }
}
