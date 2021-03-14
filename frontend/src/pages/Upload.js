import React, {useState, useRef, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEnvelope, faUnlockAlt, faAddressBook, faBirthdayCake } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup, Modal, ProgressBar} from '@themesberg/react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import {Auth, Storage} from 'aws-amplify'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function Upload() {
    const [showUpload, setShowUpload] = useState(false)
    const inputFile = useRef(null) 
    const [temp, setTemp] = useState(null)
    const [s3pic, setS3Pic] = useState(null)
    const [sub, setSub] = useState("")
  
    const [profPic, setProfPic] = useState(null)
    const [showProgress, setShowProgress] = useState(false)
    const [progress, setProgress] = useState(0)
    const [finished, setFinished] = useState(false)
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
    useEffect( () =>{
    async function retrieve() {
        await retrieveUserInfo();
    }
    retrieve()
    }, []
    );


    async function cognitoUpdate(){
        //Get the current user
        const user = await Auth.currentAuthenticatedUser().catch((err) => {
            console.log(err);
        });
        // console.log(state.value);
        // console.log(city.value);
        // console.log(hs.value);
        // console.log(grade.value);
        // console.log(age.value);
        
        let profPicUrl = await Storage.get(user.attributes.sub)
        profPicUrl = profPicUrl.split("?")[0]
        

//Updating user attributes and redirecting to "authenticated" page
        await Auth.updateUserAttributes(user, {
            'custom:profile_picture': profPicUrl
        }).then(() => {
            console.log("authenticated!")
        })
    
 

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
        await cognitoUpdate()
        setFinished(true)
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
        <Button variant="signin" onClick={uploadFile}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    
    )

    return(
        <>
        {finished ? <Redirect to='/dashboard/overview'/> : null}
        <Row style={{marginTop:"50vh"}}>
            <Col></Col>
            <Col className={{textAlign:"center"}}>
            <h1>Upload</h1>
            </Col>
            <Col></Col>
        </Row>
        <Row>
            <Col></Col>
            <Col>
        <Button onClick={openUpload} variant="primary">
            Upload
        </Button>  
        </Col>
        <Col></Col>
        {uploadModal()}
        </Row>
        </>
    )
}