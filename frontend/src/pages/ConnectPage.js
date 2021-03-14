
import React from "react";
import { Container, Card, Col, Row, Button, Dropdown, ButtonGroup, ListGroup} from '@themesberg/react-bootstrap';

import { ToDoListWidget, SalesValueWidget, SalesValueWidgetPhone, AcquisitionWidget } from "../components/Widgets";
import { useEffect, useState } from 'react';
import {Auth} from 'aws-amplify'

export default () => {
  const [surveyEntries, setSurveyEntries] = useState([])
  const [friend, setFriend] = useState(null)
  const [friendList, setFriendList] = useState([])

  useEffect(() => {
    async function retrieveAttributes() {
      try{

      
      let user = await Auth.currentAuthenticatedUser();
      console.log(user)
      }
      catch (err) {
        console.log(err)
      }
    }
    retrieveAttributes()
  })

  const listItems = friendList.map((entry, index) =>
    <ListGroup.Item href={"#link"+index} className="listitem" onClick={(e) => viewFriend(e,index)}>
        {(new Date(parseInt(entry["date"]["$numberDouble"]))).toString().slice(0,21)}
    </ListGroup.Item>
);

let viewFriend = (e, index) => {
    console.log(friendList[index])
    e.preventDefault()
    setFriend(friendList[index])

}

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
    <Container>
    <Row className="justify-content-md-center">
        <Col>
            <Card border="light" className="shadow-sm">
            <Card.Header className="border-bottom border-light d-flex justify-content-between">
                <h5 className="mb-0">Choose friends to connect with!</h5>
                {/* <Button variant="secondary" size="sm" style={{width:"30vh"}}>See all</Button> */}
            </Card.Header>
            <Card.Body>
                <ListGroup className="list-group-flush list my--3">
                </ListGroup>
            </Card.Body>
            </Card>
        </Col>
    </Row>
    <br/>
    {friend != null ?  
    <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-none d-sm-block">
          <SalesValueWidget
            title= "Check in on your friends!"
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
      : null
    }
   
    </Container>
      
    </>
  );
};
