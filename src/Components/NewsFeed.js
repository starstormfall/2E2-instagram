import React, { useState, useEffect } from "react";
import { onChildAdded, ref as databaseRef, update } from "firebase/database";
import { database } from "../DB/firebase";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const POSTS_FOLDER_NAME = "posts";

const NewsFeed = (props) => {
  const [posts, setPosts] = useState([]);
  const [likeButtons, setLikeButtons] = useState({});
  const [comment, setComment] = useState("");

  useEffect(() => {
    const postsRef = databaseRef(database, POSTS_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      // this.setState((state) => ({
      //   // Store message key so we can use it as a key in our list items when rendering messages
      //   posts: [...state.posts, { key: data.key, val: data.val() }],
      // }));

      setPosts((prev) => [...prev, { key: data.key, val: data.val() }]);
    });
  }, []);

  const handleLikeChange = (index, key, e) => {
    // identify which checkbox is checked

    const postId = e.target.id;
    const likeButtonStatus = e.target.checked;

    // if there is change to any likeButtonStatus,
    // based on state of checkbox(checked || !checked),
    // if checked, update + 1 to likesCount
    // if checked before and now unchecked, -1 to likes Count

    // create ref to likes path
    const postRef = databaseRef(database, `${POSTS_FOLDER_NAME}/${postId}`);
    let currentLikesCount = posts[index].val.likesCount;
    // unnecessary to use get here because can just update the values with this.state.posts ==> this will result in excessive api calls each time someone likes/unlikes

    if (likeButtonStatus) {
      currentLikesCount++;
    } else {
      currentLikesCount--;
    }

    update(postRef, { likesCount: currentLikesCount });

    setLikeButtons((prev) => (prev[postId] = likeButtonStatus));
    setPosts((prev) => (prev.posts[index].val.likesCount = currentLikesCount));

    // this.setState((state) => {
    //   state.likeButtons[postId] = likeButtonStatus;
    //   state.posts[index].val.likesCount = currentLikesCount;
    //   return state;
    // });
  };

  const handleCommentSubmit = (index, key, e) => {
    e.preventDefault();
    const postId = key;
    const newComment = comment;
    let currentComments = posts[index].val.comments;
    const postRef = databaseRef(database, `${POSTS_FOLDER_NAME}/${postId}`);

    if (currentComments) {
      update(postRef, { comments: [...currentComments, newComment] });
    } else {
      update(postRef, { comments: [newComment] });
    }

    if (currentComments) {
      setPosts(
        (prev) =>
          (prev.posts[index].val.comments = [...currentComments, newComment])
      );
      setComment("");
    } else {
      setPosts((prev) => (prev.posts[index].val.comments = [newComment]));
      setComment("");
    }
  };

  const postCards = posts.map((post, index) => {
    return (
      <Card key={post.key} style={{ width: "50%" }}>
        <Card.Text className="text-dark">{post.val.timestamp}</Card.Text>
        <Card.Text className="text-dark">
          posted by:
          <br />
          {post.val.postedBy}
        </Card.Text>
        <Card.Img variant="top" src={post.val.imageURL} />
        <Card.Body>
          <Card.Title className="text-dark">{post.val.caption}</Card.Title>
          <label>
            <input
              id={post.key}
              name={`heart-${index}`}
              type="checkbox"
              onChange={(e) => {
                handleLikeChange(index, post.key, e);
              }}
            />
            ❤
          </label>
          {post.val.likesCount}

          <Form onSubmit={(e) => handleCommentSubmit(index, post.key, e)}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                id={index}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                placeholder="Leave a comment..."
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={comment ? false : true}
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

  return (
    <div>
      <h2>Hi {props.currentUser}! Here's Your News Feed</h2>
      <Container className="gap-3 d-flex justify-content-md-center">
        {postCards.reverse()}
      </Container>
    </div>
  );
};

export default NewsFeed;
