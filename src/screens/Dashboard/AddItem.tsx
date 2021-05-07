import React, { useState, useRef } from "react";
import { TextField, Container, Button, IconButton, Snackbar } from "@material-ui/core";
import firebase from 'firebase';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { v4 as uuidv4 } from "uuid";
import { Alert } from "../../components";

const db = firebase.firestore();
const storage = firebase.storage();

export default function AddItem() {

  const [imageFile, setImageFile] = useState<any>(null);
  const [imageFileBase64, setImageFileBase64] = useState<any>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [openSuccessToast, setOpenSuccessToast] = useState(false);
  const [openErrorToast, setOpenErrorToast] = useState(false);

  const inputFile = useRef<any>(null);

  const resetInputFields = () => {
    setImageFile(null);
    setImageFileBase64(null);
    setName('');
    setPrice('');
    setDescription('');
  }

  const extractFileExtension = (fileName: string) => {
    return fileName.split('.').slice(-1)
  }

  const handleItemAdd = () => {
    const fileName = `${uuidv4()}.${extractFileExtension(imageFile.name)}`;
    const uploadTask = storage.ref('items/').child(fileName).put(imageFile);

    uploadTask.then(res => 
      uploadTask.snapshot.ref.getDownloadURL()
    ).then(downloadableURL => 
      db.collection('items').add({
        id: uuidv4(),
        name,
        price,
        description,
        image: fileName,
        imageURL: downloadableURL,
      })
    ).then(res => {
      setOpenSuccessToast(true);
      resetInputFields();
    }).catch(err => {
      setOpenErrorToast(true);
    });
    

  }

  const handleFileSelect = () => {
    inputFile.current.click();
  }

  function getBase64(file: any, cb: any) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        // console.log('Error: ', error);
    };
  }


  const handleFileRead = (event: any) => {
    const files = event.target.files;
    const file = files[0];
    // const fileName = files[0].name;

    setImageFile(file);
    getBase64(file, (result: any) => {
      setImageFileBase64(result);
    })
  }

  const handleFileDelete = () => {
    setImageFile(null);
    setImageFileBase64(null);
  }

  return (
    <div className="add-item-form">
      <form noValidate autoComplete="off">
        <input onChange={handleFileRead} type='file' id='file' ref={inputFile} accept="image/*" style={{display: 'none'}}/>
        
        {
          !imageFile &&
          <IconButton onClick={handleFileSelect} className="add-image-btn" color="primary" aria-label="upload picture" component="span">
            <PhotoCamera />
          </IconButton>
        }

        {
          imageFile && imageFileBase64 &&
          <div className="image-preview-container">
            <IconButton onClick={handleFileDelete} size="small" className="delete-image-btn" component="span">
              <DeleteOutlinedIcon />
            </IconButton>
            <img className="image-preview" src={imageFileBase64 || ''} />
          </div>
        }
        
        <TextField value={name} onChange={(e) => setName(e.target.value)} className="input-box" label="Item Name" variant="outlined" />
        <TextField value={price} onChange={(e) => setPrice(e.target.value)} className="input-box" type="number" label="Price" variant="outlined" />
        <TextField value={description} onChange={(e) => setDescription(e.target.value)} className="input-box" label="Description" variant="outlined" />
        <Button onClick={handleItemAdd} className="input-box" variant="contained" color="primary">
          Add Item
        </Button>
      </form>

      <Snackbar open={openSuccessToast} autoHideDuration={4000} onClose={() => setOpenSuccessToast(false)}>
        <Alert onClose={() => setOpenSuccessToast(false)} severity="success">
          Item added successfully!
        </Alert>
      </Snackbar>

      <Snackbar open={openErrorToast} autoHideDuration={4000} onClose={() => setOpenErrorToast(false)}>
        <Alert onClose={() => setOpenErrorToast(false)} severity="error">
          SOme error occured!
        </Alert>
      </Snackbar>
    </div>
  )
}