import React, { useState, useEffect } from "react";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database } from "../DB/firebase";

import Container from "react-bootstrap/Container";

import Card from "react-bootstrap/Card";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const POSTS_FOLDER_NAME = "posts";

const PublicFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsRef = databaseRef(database, POSTS_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render

      setPosts((prev) => [...prev, { key: data.key, val: data.val() }]);
    });
  }, []);

  const postCards = posts.map((post, index) => {
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

  return (
    <div>
      <h2>News Feed</h2>
      <Container className="gap-3 d-flex justify-content-md-center mt-5">
        {postCards.reverse()}
      </Container>
    </div>
  );
};

export default PublicFeed;
