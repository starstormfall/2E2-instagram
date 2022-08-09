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
      likeButtonStatus: {},
      comment: "",
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

  handleLikeChange = (index, key, e) => {
    // identify which checkbox is checked

    const postId = e.target.id;
    const likeButtonStatus = e.target.checked;

    // if there is change to any likeButtonStatus,
    // based on state of checkbox(checked || !checked),
    // if checked, update + 1 to likesCount
    // if checked before and now unchecked, -1 to likes Count

    // create ref to likes path
    const postRef = databaseRef(database, `${POSTS_FOLDER_NAME}/${postId}`);
    let currentLikesCount = this.state.posts[index].val.likesCount;
    // unnecessary to use get here because can just update the values with this.state.posts ==> this will result in excessive api calls each time someone likes/unlikes

    if (!(postId in this.state.likeButtonStatus) || likeButtonStatus) {
      update(postRef, { likesCount: currentLikesCount++ });
    } else {
      update(postRef, { likesCount: currentLikesCount-- });
    }

    this.setState((state) => {
      state.likeButtonStatus[postId] = likeButtonStatus;
      state.posts[index].val.likesCount = currentLikesCount;
      return state;
    });
  };

  handleCommentSubmit = (index, key, e) => {
    e.preventDefault();
    console.log(e);
    console.log(e.target);
    console.log(e.target.value);
    // console.log(index);
    // console.log(key);
    const postId = key;
    const newComment = this.state.comment;
    let currentComments = this.state.posts[index].val.comments;
    const postRef = databaseRef(database, `${POSTS_FOLDER_NAME}/${postId}`);

    if (currentComments) {
      update(postRef, { comments: [...currentComments, newComment] });
    } else {
      update(postRef, { comments: [newComment] });
    }

    if (currentComments) {
      this.setState((state) => {
        state.posts[index].val.comments = [...currentComments, newComment];
        state.comment = "";
        return state;
      });
    } else {
      this.setState((state) => {
        state.posts[index].val.comments = [newComment];
        state.comment = "";
        return state;
      });
    }
  };

  render() {
    // Convert messages in state to message JSX elements to render
    const postCards = this.state.posts.map((post, index) => {
      return (
        <Card key={post.key} style={{ width: "50%" }}>
          <Card.Text className="text-dark">{post.val.caption}</Card.Text>
          <Card.Img variant="top" src={post.val.imageURL} />
          <Card.Body>
            <Card.Title className="text-dark">{post.val.timestamp}</Card.Title>
            <label>
              <input
                id={post.key}
                name={`heart-${index}`}
                type="checkbox"
                onChange={(e) => {
                  this.handleLikeChange(index, post.key, e);
                }}
              />
              ❤
            </label>
            {post.val.likesCount}

            <Form
              onSubmit={(e) => this.handleCommentSubmit(index, post.key, e)}
            >
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  id={index}
                  onChange={(e) => {
                    this.setState({
                      comment: e.target.value,
                    });
                  }}
                  placeholder="Leave a comment..."
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={this.state.comment ? false : true}
              >
                Submit
              </Button>
            </Form>

            {post.val.comments && post.val.comments.length > 0 ? (
              <Card.Text className="text-dark">
                Comments:
                {post.val.comments.map((comment, number) => (
                  <li key={number}>{comment}</li>
                ))}
              </Card.Text>
            ) : null}
          </Card.Body>
        </Card>
      );
    });

    postCards.reverse();

    return (
      <div>
        <h2>Hi {this.props.loggedInUser}! Here's Your News Feed</h2>
        <Container className="gap-3 d-flex justify-content-md-center">
          {postCards}
        </Container>
      </div>
    );
  }
}
