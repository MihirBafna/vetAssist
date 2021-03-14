
import React from "react";
import { Col, Row, Button, Dropdown, ButtonGroup} from '@themesberg/react-bootstrap';
import {Redirect} from 'react-router-dom'
import { ToDoListWidget, SalesValueWidget, SalesValueWidgetPhone, AcquisitionWidget } from "../../components/Widgets";
import { PageVisitsTable } from "../../components/Tables";
import { trafficShares, totalOrders } from "../../data/charts";
import { useEffect, useState } from 'react';
import {Auth} from 'aws-amplify'

export default () => {
  const [surveyEntries, setSurveyEntries] = useState([])
  const [backHome, setBackHome] = useState(false)
  const [sub, setSub] = useState("")

  useEffect(() => {
    async function retrieveAttributes() {
      try{
      let user = await Auth.currentAuthenticatedUser();
      let attr = user["attributes"]
      
      setSub(attr["sub"])
      console.log(attr["sub"])
      }
      catch (err) {
        console.log(err)
        setBackHome(true)
        
      }
    }
    retrieveAttributes()
  })

useEffect(() => {
    async function fetchData(){
    if( surveyEntries.length == 0 && sub != null){
    await fetch(`https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/vetassist-gazyj/service/getHappinessScores/incoming_webhook/getHappinessScores?user_id=`+sub)
    .then(response => response.json())
    .then(result => {
      console.log(result)
      if(result != null){

      
      console.log(result[sub])
        var entries = []
        for (var i = 0; i < result[sub].length; i++) {
          entries.push(result[sub][`${i}`]["total_score"]["$numberDouble"])
        }
        console.log(entries)
        setSurveyEntries(entries)
    }
  }
    )
    }
}
fetchData()

},[sub])

  return (
    <>
    {backHome ? <Redirect to='/'/> : null}
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
