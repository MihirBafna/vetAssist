
import React from "react";
import { Col, Row, Button, Dropdown, ButtonGroup} from '@themesberg/react-bootstrap';

import { ToDoListWidget, SalesValueWidget, SalesValueWidgetPhone, AcquisitionWidget } from "../../components/Widgets";
import { PageVisitsTable } from "../../components/Tables";
import { trafficShares, totalOrders } from "../../data/charts";

export default () => {
  return (
    <>
      {/* <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">

        <ButtonGroup>
          <Button variant="outline-primary" size="sm">Share</Button>
          <Button variant="outline-primary" size="sm">Export</Button>
        </ButtonGroup>
      </div> */}
      <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-none d-sm-block">
          <ToDoListWidget
          />
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-none d-sm-block">
          <SalesValueWidget
            title="Let's check how your week has been!"
            value="10/10"
            percentage={1}
          />
        </Col>
        <Col xs={12} className="mb-4 d-sm-none">
          <SalesValueWidgetPhone
            title="Let's check how your week has been!"
            value="10/10"
            percentage={1}
          />
        </Col>
      </Row>
    </>
  );
};
