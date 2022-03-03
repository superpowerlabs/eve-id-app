import Base from "./Base";

// eslint-disable-next-line no-undef
const { Container, Row, Col } = ReactBootstrap;

class LoadingApp extends Base {
  render() {
    return (
      <Container>
        <Row>
          <Col md={12}>
            <p className="centered" style={{ paddingTop: 160 }}>
              <img src="/images/white-spinner.svg" />
            </p>
            <p className="centered largerp" style={{ paddingBottom: 160 }}>
              {this.props.message}
            </p>
          </Col>
        </Row>
      </Container>
    );
  }
}

module.exports = LoadingApp;
