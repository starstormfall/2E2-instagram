import React from "react";
import {
  onChildAdded,
  push,
  ref as databaseRef,
  set,
  update,
  get,
  child,
} from "firebase/database";

import { database } from "../DB/firebase";

export default function Test(props) {
  const postListRef = databaseRef(database, "posts", "-N8sVM4sUT-fOcfQ7X_G");

  // const newPostRef = push(postListRef);
  // // to alter message here / to write data for storing to realtime database
  // set(newPostRef, {
  //   caption: "hihi",
  //   imageURL: "www.hihi.com",
  //   likesCount: 3,
  //   timestamp: Date().toLocaleString(),
  // });

  get(postListRef).then((snapshot) => {
    // const post = snapshot.val()["-N8sJOjAid8rTF4VS7IJ"];
    const post1 = snapshot.val();
    console.log(post1);
    return post1;
  });
  // .then((post) => {
  //   console.log(post, typeof post);
  //   update(databaseRef(database, "posts/-N8sJOjAid8rTF4VS7IJ"), {
  //     likesCount: post.likesCount + 1,
  //   });
  // });

  return null;
}
