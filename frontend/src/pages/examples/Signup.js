
import React, {useState, useRef, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEnvelope, faUnlockAlt, faAddressBook, faBirthdayCake } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup, Modal, ProgressBar} from '@themesberg/react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import {Auth, Storage} from 'aws-amplify'
import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";
import Confirm from "../Confirm"
import moment from "moment-timezone";
import Datetime from "react-datetime";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';


export default () => {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [birthday, setBirthday] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [signedUp, setSignedUp] = useState(false)

  









  async function cognitoSignUp() {
    try {
        const { user } = await Auth.signUp({
            username: email,
            password: password,
            attributes: {
            birthdate: birthday.format("MM/DD/YYYY"),
            given_name: firstName,
            family_name: lastName,
            email: email
            }
            
        });
        console.log("signedUp")
        setSignedUp(true)
        
    } catch (error) {
        console.log('error signing up:', error);
        // setIsError(true)
        setErrorMessage(error.message)
    }
}


 


  let signUpClick = (e) => {
    e.preventDefault()
    if(password !== confirmPassword) {
      setErrorMessage("Password do not match!")
    }
    cognitoSignUp()

  }


  

  let signUpContent = (
<main>
      {signedUp ? <Redirect to='/upload'/> : null}
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <p className="text-center">
            <Card.Link as={Link} to={Routes.DashboardOverview.path} className="text-gray-700">
              <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to homepage
            </Card.Link>
          </p>
          <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="mb-4 mb-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Create an account</h3>
                </div>
                <Form className="mt-4">
                  <Form.Group id="email" className="mb-4">
                    <Row>
                      <Col>
                      <Form.Group id="First Name" className="mb-4">
                    <Form.Label>First Name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faAddressBook} />
                      </InputGroup.Text>
                      <Form.Control required type="select" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)}/>
                    </InputGroup>
                  </Form.Group>
                      </Col>
                      <Col>
                      <Form.Group id="Last Name" className="mb-4">
                    <Form.Label>Last Name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faAddressBook} />
                      </InputGroup.Text>
                      <Form.Control required type="select" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)}/>
                    </InputGroup>
                  </Form.Group>
                      </Col>
                    </Row>
                    <Form.Label>Your Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control autoFocus required type="email" placeholder="example@company.com" onChange={(e) => setEmail(e.target.value)}/>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="birthday">
                <Form.Label>Your Birthday</Form.Label>
                <Datetime
                  timeFormat={false}
                  onChange={setBirthday}
                  renderInput={(props, openCalendar) => (
                    <InputGroup>
                      <InputGroup.Text><FontAwesomeIcon icon={faBirthdayCake} /></InputGroup.Text>
                      <Form.Control
                        required
                        type="text"
                        value={birthday ? moment(birthday).format("MM/DD/YYYY") : ""}
                        placeholder="mm/dd/yyyy"
                        onFocus={openCalendar}
                         />
                    </InputGroup>
                  )} />
              </Form.Group>
                  <Form.Group id="password" className="mb-4">
                    <Form.Label>Your Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control required type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="confirmPassword" className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control required type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </InputGroup>
                  </Form.Group>

                  <FormCheck type="checkbox" className="d-flex mb-4">
                    <FormCheck.Input required id="terms" className="me-2" />
                    <FormCheck.Label htmlFor="terms">
                      I agree to the <Card.Link>terms and conditions</Card.Link>
                    </FormCheck.Label>
                  </FormCheck>
                  
                  <Button onClick={signUpClick} variant="primary" type="submit" className="w-100">
                    Sign up
                  </Button>
                </Form>
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal">
                    Already have an account?
                    <Card.Link as={Link} to={Routes.Signin.path} className="fw-bold">
                      {` Login here `}
                    </Card.Link>
                  </span>
                </div>
              </div>
            </Col>
          </Row>
          
        </Container>
      </section>
    </main>
  )

  let confirmContent = (
    <>
    <Confirm email={email} password={password}/>
    </>
  )
  return (
    <>
    {signedUp ? confirmContent : signUpContent}
    </>
  );
};
