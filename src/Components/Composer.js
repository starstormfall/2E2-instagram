import React from "react";
import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "../DB/firebase";

import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const POSTS_FOLDER_NAME = "posts";
const IMAGES_FOLDER_NAME = "images";

export default class Composer extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      fileInputFile: null,
      fileInputValue: "",
      captionInputValue: "",
      imgSrc: "",
    };
  }

  handleUpload = (event) => {
    event.preventDefault();

    // creating reference to storage and filepath
    const imagesRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${this.state.fileInputFile.name}`
    );
    uploadBytes(imagesRef, this.state.fileInputFile).then(() => {
      getDownloadURL(imagesRef).then((url) => {
        // creating reference to realtime database and filepath
        const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
        // append new post to the posts folder
        const newPostRef = push(postListRef);
        // to alter message here / to write data for storing to realtime database
        set(newPostRef, {
          timestamp: new Date().toLocaleString(),
          imageURL: url,
          caption: this.state.captionInputValue,
          likesCount: 0,
          comments: [],
          postedBy: this.props.postedBy,
        });

        this.setState({
          fileInputFile: null,
          fileInputValue: "",
          captionInputValue: "",
        });
      });
    });
  };

  render() {
    // Convert messages in state to message JSX elements to render

    return (
      <div>
        <Form onSubmit={this.handleUpload}>
          <Form.Control
            ref="file"
            type="file"
            value={this.state.fileInputValue}
            onChange={(e) => {
              this.setState({
                fileInputFile: e.target.files[0],
                fileInputValue: e.target.value,
                imgSrc: URL.createObjectURL(e.target.files[0]),
              });
              console.log(this.state.fileInputValue);
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
              value={this.state.captionInputValue}
              onChange={(e) =>
                this.setState({ captionInputValue: e.target.value })
              }
            />
            <label htmlFor="floatingCaption">Add caption here!</label>
          </Form.Floating>
          <img alt="" src={this.state.imgSrc} />
          <Button variant="primary" type="submit" value="Upload">
            Upload
          </Button>

          <br />
        </Form>
      </div>
    );
  }
}
