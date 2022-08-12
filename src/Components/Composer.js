import React, { useState } from "react";
import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "../DB/firebase";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const POSTS_FOLDER_NAME = "posts";
const IMAGES_FOLDER_NAME = "images";

const Composer = (props) => {
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");
  const [captionInputValue, setCaptionInputValue] = useState("");
  const [imgSrc, setImgSrc] = useState("");

  const handleUpload = (event) => {
    event.preventDefault();

    // creating reference to storage and filepath
    const imagesRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${fileInputFile.name}`
    );
    uploadBytes(imagesRef, fileInputFile).then(() => {
      getDownloadURL(imagesRef).then((url) => {
        // creating reference to realtime database and filepath
        const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
        // append new post to the posts folder
        const newPostRef = push(postListRef);
        // to alter message here / to write data for storing to realtime database
        set(newPostRef, {
          timestamp: new Date().toLocaleString(),
          imageURL: url,
          caption: captionInputValue,
          likesCount: 0,
          comments: [],
          postedBy: props.postedBy,
        });

        setFileInputFile(null);
        setFileInputValue("");
        setCaptionInputValue("");
      });
    });
  };
  return (
    <div>
      <Form onSubmit={handleUpload}>
        <Form.Control
          type="file"
          value={fileInputValue}
          onChange={(e) => {
            setFileInputFile(e.target.files[0]);
            setFileInputValue(e.target.value);
            setImgSrc(URL.createObjectURL(e.target.files[0]));
          }}
        />

        <Form.Floating className="mb-3">
          <Form.Control
            id="floatingCaption"
            as="textarea"
            name="caption"
            style={{ height: "150px" }}
            maxLength="140"
            placeholder="caption"
            value={captionInputValue}
            onChange={(e) => setCaptionInputValue(e.target.value)}
          />
          <label htmlFor="floatingCaption">Add caption here!</label>
        </Form.Floating>
        <img alt="" src={imgSrc} />
        <Button variant="primary" type="submit" value="Upload">
          Upload
        </Button>

        <br />
      </Form>
    </div>
  );
};

export default Composer;
