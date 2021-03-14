import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEnvelope, faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import {Auth} from 'aws-amplify'
import { Routes } from "../routes";
import BgImage from "../assets/img/illustrations/signin.svg";

export default function Confirm(props) {
    const [code, setCode] = useState("")
    const [confirmed, setConfirmed] = useState(false)

    useEffect(() => {
        console.log(props.email)
    })

    let continueOnClick = (e) => {
        e.preventDefault()
        confirmSignUp()
    }

    async function confirmSignUp() {
        try {
            await Auth.confirmSignUp(props.email, code);
            await Auth.signIn(props.email, props.password)
            setConfirmed(true)
            
        } catch (error) {
            console.log('error confirming sign up', error);
            // setIsError(true)
            // setError(error.message)
        }
    }
    return (
        <main>
        {confirmed ? <Redirect to='/dashboard/overview'/> : null}
        <section className="d-flex align-items-center form-bg-image" style={{ backgroundImage: `url(${BgImage})`,marginTop:"25vh" }}>
          <Container>
            <p className="text-center">
              <Card.Link as={Link} to={Routes.DashboardOverview.path} className="text-gray-700">
                <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to homepage
              </Card.Link>
            </p>
            <Row className="justify-content-center form-bg-image">
              <Col xs={12} className="d-flex align-items-center justify-content-center">
                <div className="shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500" style={{backgroundColor:"rgba(255,255,255,0.9)"}}>
                  <div className="text-center text-md-center mb-4 mt-md-0">
                    <h3 className="mb-0">Confirm Your Account!</h3>
                    <p>Check your email!</p>
                  </div>
                  <Form className="mt-4">
                    <Form.Group id="email" className="mb-4">
                      <Form.Label>Your Code</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUserSecret} />
                        </InputGroup.Text>
                        <Form.Control autoFocus required type="code" placeholder="000000" onChange={(e) => setCode(e.target.value)}/>
                      </InputGroup>
                    </Form.Group>
                    <Button onClick={continueOnClick} variant="primary" type="submit" className="w-100">
                      Continue
                    </Button>
                  </Form>
  
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    )
}