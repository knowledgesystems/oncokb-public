import React, { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';
import WindowStore from 'app/store/WindowStore';

const Container: FunctionComponent<{}> = props => {
  return (
    <Row className={`justify-content-center`}>
      <Col md={11}>{props.children}</Col>
    </Row>
  );
};
const PageContainer: React.FunctionComponent<{
  windowStore: WindowStore;
}> = props => {
  return (
    <div className={'view-wrapper'}>
      <div
        className={
          props.windowStore.isXLscreen ? 'container' : 'container-fluid'
        }
      >
        <Container>{props.children}</Container>
      </div>
    </div>
  );
};
export default PageContainer;
