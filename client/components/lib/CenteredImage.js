// eslint-disable-next-line no-undef
const { Row, Col } = ReactBootstrap;

import Ab from "./Ab";

export default class CenteredImage extends React.Component {
  render() {
    const { src, alt, link, top, bottom } = this.props;
    let body;
    let style = {};
    if (top) style.marginTop = top;
    if (bottom) style.marginBottom = bottom;
    const img = <img className={"pc90"} src={src} alt={alt} style={style} />;
    if (link) {
      body = <Ab link={link} label={img} />;
    } else {
      body = img;
    }
    return (
      <div className={"centered"}>
        <Row>
          <Col xs={0} lg={4}>
            {" "}
          </Col>
          <Col xs={12} lg={4}>
            <div className={"centered"}>{body}</div>
          </Col>
          <Col xs={0} lg={4}>
            {" "}
          </Col>
        </Row>
      </div>
    );
  }
}
