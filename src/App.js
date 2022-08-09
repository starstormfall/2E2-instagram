import React from "react";
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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: "",
      shouldRenderAuthForm: true,
      showAuthForm: false,
      showUploadForm: false,
    };
  }

  componentDidMount = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({
          shouldRenderAuthForm: false,
          loggedInUser: user.email,
        });
      }
    });
  };

  signup = (e, email, password) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        this.setState({
          showAuthForm: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  login = (e, email, password) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Successfully logged in!");
        // this.setState({
        //   shouldRenderAuthForm: false,
        // });
        console.log(this.state.loggedInUser);
        this.setState({
          showAuthForm: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  signout = (e) => {
    signOut(auth)
      .then(() => {
        console.log("logged out!!");
        this.setState({ shouldRenderAuthForm: true, loggedInUser: "" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Navbar sticky="top" bg="dark" variant="dark">
            <Container>
              <Navbar.Brand>ROCKETGRAM</Navbar.Brand>
              <Nav variant="pills">
                {this.state.loggedInUser ? (
                  <>
                    <Nav.Item>
                      <Nav.Link
                        onClick={() => this.setState({ showUploadForm: true })}
                      >
                        New Upload
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link onClick={this.signout}>Logout</Nav.Link>
                    </Nav.Item>
                  </>
                ) : (
                  <Nav.Item>
                    <Nav.Link
                      onClick={(e) => this.setState({ showAuthForm: true })}
                    >
                      Sign Up | Login
                    </Nav.Link>
                  </Nav.Item>
                )}
              </Nav>
            </Container>
          </Navbar>

          <Modal
            size="sm"
            show={this.state.showAuthForm}
            onHide={() => this.setState({ showAuthForm: false })}
            aria-labelledby="example-modal-sizes-title-sm"
          >
            <Modal.Header closeButton>
              <Modal.Title id="auth-form">Welcome</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AuthForm
                handleSignup={(e, email, password) =>
                  this.signup(e, email, password)
                }
                handleLogin={(e, email, password) =>
                  this.login(e, email, password)
                }
              />
            </Modal.Body>
          </Modal>

          <Modal
            size="sm"
            show={this.state.showUploadForm}
            onHide={() => this.setState({ showUploadForm: false })}
            aria-labelledby="example-modal-sizes-title-sm"
          >
            <Modal.Header closeButton>
              <Modal.Title id="image-upload">Image Upload</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Composer user={this.state.loggedInUser} />
            </Modal.Body>
          </Modal>
        </header>

        {this.state.shouldRenderAuthForm ? (
          <PublicFeed />
        ) : (
          <NewsFeed currentUser={this.state.loggedInUser} />
        )}
        {/* <Test /> */}
      </div>
    );
  }
}

export default App;
