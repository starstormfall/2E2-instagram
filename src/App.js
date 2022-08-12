import React, { useState, useEffect } from "react";
import ReactDom from "react-dom/client";
import "./App.css";

import Composer from "./Components/Composer";
import NewsFeed from "./Components/NewsFeed";
import AuthForm from "./Components/AuthForm";
import PublicFeed from "./Components/PublicFeed";
// import Test from "./Components/Test";

import { auth } from "./DB/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [showPublicFeed, setShowPublicFeed] = useState(true);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setShowPublicFeed(false);
        setLoggedInUser(user.email);
      }
    });
  }, []);

  const signup = (e, email, password) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setShowAuthForm(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const login = (e, email, password) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setShowAuthForm(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signout = (e) => {
    signOut(auth)
      .then(() => {
        setShowPublicFeed(true);
        setLoggedInUser("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <Navbar sticky="top" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>ROCKETGRAM</Navbar.Brand>
            <Nav variant="pills">
              {loggedInUser ? (
                <>
                  <Nav.Item>
                    <Nav.Link onClick={() => setShowUploadForm(true)}>
                      New Upload
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link onClick={signout}>Logout</Nav.Link>
                  </Nav.Item>
                </>
              ) : (
                <Nav.Item>
                  <Nav.Link onClick={(e) => setShowAuthForm(true)}>
                    Sign Up | Login
                  </Nav.Link>
                </Nav.Item>
              )}
            </Nav>
          </Container>
        </Navbar>

        <Modal
          size="sm"
          show={showAuthForm}
          onHide={() => setShowAuthForm(false)}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="auth-form">Welcome</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AuthForm
              handleSignup={(e, email, password) => signup(e, email, password)}
              handleLogin={(e, email, password) => login(e, email, password)}
            />
          </Modal.Body>
        </Modal>

        <Modal
          size="sm"
          show={showUploadForm}
          onHide={() => setShowUploadForm(false)}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="image-upload">Image Upload</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Composer postedBy={loggedInUser} />
          </Modal.Body>
        </Modal>
      </header>

      {showPublicFeed ? (
        <PublicFeed />
      ) : (
        <NewsFeed currentUser={loggedInUser} />
      )}
      {/* <Test /> */}
    </div>
  );
};

export default App;
