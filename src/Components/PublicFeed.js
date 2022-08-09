import React from "react";
import {
  onChildAdded,
  push,
  ref as databaseRef,
  set,
  update,
  get,
} from "firebase/database";
import { database } from "../DB/firebase";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const POSTS_FOLDER_NAME = "posts";

export default class NewsFeed extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      posts: [],
    };
  }

  // use realtime database to store the info of the picture (url, title/name/caption, time uploaded)
  componentDidMount() {
    const postsRef = databaseRef(database, POSTS_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        posts: [...state.posts, { key: data.key, val: data.val() }],
      }));
    });
  }

  render() {
    // Convert messages in state to message JSX elements to render
    const postCards = this.state.posts.map((post, index) => {
      return (
        <Card key={post.key} style={{ width: "50%" }}>
          <Card.Text className="text-dark">{post.val.caption}</Card.Text>
          <Card.Img variant="top" src={post.val.imageURL} />
          <Card.Body>
            <Card.Title className="text-dark">{post.val.timestamp}</Card.Title>
            <Card.Text className="text-dark">❤ {post.val.likesCount}</Card.Text>
          </Card.Body>
        </Card>
      );
    });

    postCards.reverse();

    return (
      <div>
        <h2>News Feed</h2>
        <Container className="gap-3 d-flex justify-content-md-center mt-5">
          {postCards}
        </Container>
      </div>
    );
  }
}
