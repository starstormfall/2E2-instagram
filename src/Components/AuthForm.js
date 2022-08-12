import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const AuthForm = (props) => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
              value={formState.email}
              required
              onChange={handleChange}
              placeholder="name@example.com"
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3">
          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control
              type="password"
              name="password"
              value={formState.password}
              required
              onChange={handleChange}
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
              props.handleLogin(e, formState.email, formState.password)
            }
          >
            Login
          </Button>
          <Button
            variant="primary"
            type="submit"
            value="signup"
            onClick={(e) =>
              props.handleSignup(e, formState.email, formState.password)
            }
          >
            Sign Up
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default AuthForm();
