// eslint-disable-next-line no-undef
const { Redirect } = ReactRouterDOM;

const { Container, Row, Col } = ReactBootstrap;

import Base from "./Base";
import ClaimToken from "./ClaimToken";

export default class LandingPage extends Base {
  constructor(props) {
    super(props);
    let accessToken = window.location.pathname.split("/")[1];
    let is404 = false;
    if (accessToken) {
      if (/^[0-9A-Fa-f]{16}$/.test(accessToken)) {
        this.setStore({
          landingAccessToken: accessToken,
        });
      } else {
        is404 = true;
        accessToken = false;
      }
    }
    this.state = {
      is404,
      accessToken,
    };
  }

  render() {
    const { connectedWallet, landingAccessToken } = this.Store;
    if (this.state.error) {
      return (
        <div
          style={{ width: "100%", marginTop: 200 }}
          className={"centered noTokens m0Auto"}
        >
          <div className={"error"}>{this.state.error}</div>
        </div>
      );
    }
    return (
      <div style={{ width: "100%", marginTop: 200 }}>
        {connectedWallet ? (
          landingAccessToken ? (
            <ClaimToken Store={this.Store} setStore={this.setStore} />
          ) : (
            <Container>
              <Row>
                <Col>
                  <div className={"centered bordered"}>
                    Welcome to the EveID Minting app.
                    <br />
                    You must solve the maze before coming here :(
                  </div>
                </Col>
              </Row>
            </Container>
          )
        ) : (
          <div
            className={"centered noTokens m0Auto"}
            style={{ fontSize: "1.4rem" }}
          >
            Please, connect your wallet to continue
          </div>
        )}
      </div>
    );
  }
}
