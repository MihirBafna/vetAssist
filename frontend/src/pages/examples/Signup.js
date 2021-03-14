
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
  const [showUpload, setShowUpload] = useState(false)
  const inputFile = useRef(null) 
  const [temp, setTemp] = useState(null)
  const [s3pic, setS3Pic] = useState(null)
  const [sub, setSub] = useState("")

  const [profPic, setProfPic] = useState(null)
  const [showProgress, setShowProgress] = useState(false)
  const [progress, setProgress] = useState(0)
  const [crop, setCrop] = useState({ aspect: 1, unit: '%',  height: 100,
  height: 100 });
  



  useEffect( () => {
    async function setImage(){
    if(profPic != null){
        let tempimg = await getCroppedImg(temp, crop, "temp.jpeg")
        setS3Pic(new File([tempimg], "temp.jpeg"))
        console.log(s3pic)
    }
  }
  setImage()
},[temp, crop])

async function retrieveUserInfo(){
    await Auth.currentUserInfo()
    .then( (session) => {
        setSub(session.attributes.sub)
        return;
    }).catch( (error) => {
        console.log(error);
        return;
    })

}

useEffect( async () => {
    await retrieveUserInfo();
}, []
);

  async function cognitoSignUp() {
    try {
        const { user } = await Auth.signUp({
            username: email,
            password: password,
            attributes: {
            birthdate: birthday,
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


 
let handleCrop = (newCrop) => {
  setCrop(newCrop)
}

function getCroppedImg(image, crop, fileName) {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');
 
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  );
 
  // As Base64 string
  // const base64Image = canvas.toDataURL('image/jpeg');
 
  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      blob.name = fileName;
      resolve(blob);
    }, 'image/jpeg', 1);
  });
}

  let signUpClick = (e) => {
    e.preventDefault()
    if(password !== confirmPassword) {
      setErrorMessage("Password do not match!")
    }
    cognitoSignUp()

  }
  let uploadFile = async (e) => {
    e.preventDefault();
    setShowProgress(true)
    await Storage.put(sub, s3pic, {
        progressCallback(progress) {
            setProgress(progress.loaded/progress.total * 100)
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
        level: 'public',
        type: "image/jpeg"
    })
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            })
    setShowProgress(false)
    setProgress(0)
    setShowUpload(false)
}

  let openUpload = (e) => {
    e.preventDefault()
    setShowUpload(true)
}

let closeUpload = () => {
    setShowUpload(false)
}

  let uploadModal = () => (

    <Modal show={showUpload} onHide={closeUpload} centered>
    <Modal.Header closeButton>
      <Modal.Title>Upload Your Profile Picture</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Row>
            <Col>
        <input type='file' id='file' ref={inputFile} onChange={(e) => setProfPic(URL.createObjectURL(e.target.files[0]))}/>
            </Col>
        </Row>
        <Col style={{width:"70vh"}}>
        {profPic != null ?  <ReactCrop src={profPic} crop={crop} onChange={newCrop => handleCrop(newCrop)}  imageStyle={{width:"100%"}}onImageLoaded={(image) => {setTemp(image)}} keepSelection/> : null}
        </Col>
        {showProgress ? <ProgressBar animated now={progress} label={`${progress}%`}/> : null}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={uploadFile}>
        Upload
      </Button>
    </Modal.Footer>
  </Modal>

)

  let signUpContent = (
<main>
      {signedUp ? <Redirect to='/confirm'/> : null}
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
                  <Button onClick={openUpload} variant="primary" className="w-100">
                    Upload
                  </Button>                
                  <Form.Text muted>Size should be less than 5MB</Form.Text>
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
      {uploadModal()}
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
