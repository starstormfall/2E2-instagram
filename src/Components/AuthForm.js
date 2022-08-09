import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <Container className="mt-3">
        <Form>
          <Form.Group className="mb-3">
            <FloatingLabel
              controlId="floatingInput"
              label="Email address"
              className="mb-3"
            >
              <Form.Control
                type="email"
                name="email"
                value={this.state.email}
                required
                onChange={(e) => this.handleChange(e)}
                placeholder="name@example.com"
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-3">
            <FloatingLabel controlId="floatingPassword" label="Password">
              <Form.Control
                type="password"
                name="password"
                value={this.state.password}
                required
                onChange={(e) => this.handleChange(e)}
                minLength="8"
                placeholder="Password"
              />
            </FloatingLabel>
          </Form.Group>
          <ButtonGroup aria-label="Sign Up or Login">
            <Button
              variant="primary"
              type="submit"
              value="login"
              onClick={(e) =>
                this.props.handleLogin(e, this.state.email, this.state.password)
              }
            >
              Login
            </Button>
            <Button
              variant="primary"
              type="submit"
              value="signup"
              onClick={(e) =>
                this.props.handleSignup(
                  e,
                  this.state.email,
                  this.state.password
                )
              }
            >
              Sign Up
            </Button>
          </ButtonGroup>
        </Form>
      </Container>
    );
  }
}
