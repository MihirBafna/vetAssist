import React from "react";
import { Col, Row, Button, Dropdown, ButtonGroup, Card, ListGroup} from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faChartArea, faChartBar, faChartLine, faFlagUsa, faFolderOpen, faGlobeEurope, faPaperclip, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import '../styles/JournalPage.css'
import {useEffect, useState} from 'react'




export default function JournalPage(){
const [journalEntries, setJournalEntries] = useState([])
const [dashboardElem, setDashboardElem] = useState(null)

let entryContent = (props) => (
        <>
            <Row>
                <Col>
                    <h1>{props.opp["opportunity_name"]}</h1>
                    <Button variant="primary" target="_blank" rel="noopener noreferrer" href={props.email.includes("@gmail.com") ? `https://mail.google.com/mail/?view=cm&fs=1&to=hello@lanos.io&su=Question+About+${props.opp["opportunity_name"]}` :"mailto:hello@lanos.io"}>Contact Us</Button>
                </Col>
                <Col>
                    <p>
                        <b>Date Posted: </b>{props}
                        <br/>
                        <b>When: </b>
                        <br/>
                        <b>Location: </b>{props}
                    </p>
                </Col>
                
            </Row>
            <hr/>
            <Row>
                <Col>
                </Col>
            </Row>
        </>
    )

useEffect(async () => {
    if( journalEntries.length == 0){
    await fetch(`https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/vetassist-gazyj/service/getJournalEntries/incoming_webhook/getJournalEntries?user_id=dummy`)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        setJournalEntries(result)
        // setDashboardElem(opportunityNamesDB[0])
    }
    )
}
},[])

// const listItems = journalEntries.map((opp, index) =>
//     <ListGroup.Item href={"#link"+index} className="listitem" onClick={(e) => openDashboard(e,index)}>
//         {/* {journalEntry.title} */}
//     </ListGroup.Item>
// );

let openDashboard = (e, index) => {
    e.preventDefault()
    setDashboardElem(journalEntries[index]) 

}



    return(
        <>
            <Row className="">
                <Col sm={4} className="">
                    <Card border="light" className="shadow-sm ">
                        <Card.Body>
                                <h3>Previous Journals</h3>
                                <ListGroup.Item className="listitem" flush>
                                    Entry 12: 3/13/21
                                </ListGroup.Item>
                                <ListGroup.Item className="listitem" flush>
                                    Entry 11: 3/12/21
                                </ListGroup.Item>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={8} className="">
                    <Card border="light" className="shadow-sm">
                        <Card.Body>
                                <h3>Selected</h3>
                                <ListGroup variant="flush">

                                </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );

}