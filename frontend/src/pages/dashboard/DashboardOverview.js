
import React from "react";
import { Col, Row, Button, Dropdown, ButtonGroup} from '@themesberg/react-bootstrap';

import { ToDoListWidget, SalesValueWidget, SalesValueWidgetPhone, AcquisitionWidget } from "../../components/Widgets";
import { PageVisitsTable } from "../../components/Tables";
import { trafficShares, totalOrders } from "../../data/charts";
import { useEffect, useState } from 'react';
import {Auth} from 'aws-amplify'

export default () => {
  const [surveyEntries, setSurveyEntries] = useState([])

  useEffect(() => {
    async function retrieveAttributes() {
      try{
      let user = await Auth.currentAuthenticatedUser();
      let attr = user["attributes"]

      }
      catch (err) {
        console.log(err)
      }
    }
    retrieveAttributes()
  })

useEffect(() => {
    async function fetchData(){
    if( surveyEntries.length == 0){
    await fetch(`https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/vetassist-gazyj/service/getHappinessScores/incoming_webhook/getHappinessScores?user_id=dummy`)
    .then(response => response.json())
    .then(result => {
        console.log(result["dummy"])
        var entries = []
        for (var i = 0; i < result["dummy"].length; i++) {
          entries.push(result["dummy"][`${i}`]["total_score"]["$numberDouble"])
        }
        console.log(entries)
        setSurveyEntries(entries)
    }
    )
    }
}
fetchData()

},[])

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
            values= {surveyEntries}
          />
        </Col>
        <Col xs={12} className="mb-4 d-sm-none">
          <SalesValueWidgetPhone
            title="Let's check how your week has been!"
            values= {surveyEntries}
          />
        </Col>
      </Row>
    </>
  );
};
