import React from "react";
import { Col, Row, Button, Dropdown, ButtonGroup, Card, ListGroup, Image} from '@themesberg/react-bootstrap';
import '../styles/JournalPage.css'
import {useEffect, useState} from 'react'
import notebook from '../assets/img/illustrations/notebook.svg'



export default function JournalPage(){
const [journalEntries, setJournalEntries] = useState([])
const [dashboardElem, setDashboardElem] = useState(null)

const entryContent = (props) => 
        (
        <>
            <Row>
                <Col>
                    <h3>{new Date(parseInt(props["date"]["$numberDouble"])).toString().slice(0,21)}</h3>
                </Col>
                
            </Row>
            <hr/>
            <Row>
                <Col>
                    <h5>
                        How was your day?
                    </h5>
                    <p>
                        " {props["content"]} "
                    </p>
                </Col>
            </Row>
        </>

    )

const defaultEntryContent = () => 
    (
        <>
        <Row>
        <Col className="my-auto">
            <h5>
                Click on the left to look through your journals!
            </h5>
        </Col>
        <Col>
            <Image src={notebook} style={{height:"65vh"}}/>

        </Col>
        </Row>

        </>
    )

useEffect(() => {
    async function fetchData(){
    if( journalEntries.length == 0){
    await fetch(`https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/vetassist-gazyj/service/getJournalEntries/incoming_webhook/getJournalEntries?user_id=dummy`)
    .then(response => response.json())
    .then(result => {
        setJournalEntries(result["dummy"])
    }
    )
    }
}
fetchData()

},[])



const listItems = journalEntries.map((entry, index) =>
    <ListGroup.Item href={"#link"+index} className="listitem" onClick={(e) => openDashboard(e,index)}>
        {(new Date(parseInt(entry["date"]["$numberDouble"]))).toString().slice(0,21)}
    </ListGroup.Item>
);

let openDashboard = (e, index) => {
    console.log(journalEntries[index])
    e.preventDefault()
    setDashboardElem(journalEntries[index]) 

}



    return(
        <>
            <Row className="">
                <Col sm={4} className="" style={{overflowY:"scroll"}}>
                    <Card border="light" className="shadow-sm " >
                        <Card.Body>
                                <h3>Journals</h3>
                                <hr/>
                                {listItems}
                                <hr/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={8} className="" style={{overflowY:"scroll"}}>
                    <Card border="light" className="shadow-sm">
                        <Card.Body>
                        {dashboardElem != null ? entryContent(dashboardElem) : defaultEntryContent() }          
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );

}