import { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";

function LoginModal(props) {
  const [show, setShow] = useState(true);
  const [gun, setGun] = useState();
  const [gunUser, setGunUser] = useState();

  const [register, setRegister] = useState(true); //true=login mode (suggests registration)
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  useEffect(() => {
    setGun(props.gun);
    setGunUser(props.gunUser);
  }, [props]);

  const handleClose = () => {
    if (props.gunPublicKey != "") {
      setShow(false);
    } else {
      //fixme handle when user is not authenticated but wants to close modal
    }
  };
  // const handleShow = () => setShow(true);
  function onClickSwitchLoginRegister() {
    setRegister(!register);
  }

  function gunRegistration() {
    if (gun && props.setGunPublicKey) {
      if (register) {
        //login
        gunUser.auth(account, password, (params) => {
          if (params.err) {
            //fixme treat general errors
          } else {
            if (params.sea) {
              if (params.sea.pub) {
                params.setGunPublicKey();
                params.setGunPublicKey(params.sea.pub);
              }
            }
          }
        });
      } else {
        //register
        if (password === passwordConfirm) {
          gunUser.create(account, password, (params) => {
            if (params.err) {
              //fixme treat general errors
            } else {
              if (params.pub) {
                params.setGunPublicKey(params.pub);
              }
            }
          });
        } else {
          //fixme if passwords don't match
        }
      }
    } else {
      //fixme if gun or setGunPublicKey are not passed as prop
    }
    handleClose();
  }

  function passwordField() {
    if (register) {
      return (
        <>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onChange={onChangePassword}
              type="password"
              placeholder="Password"
            />
            <Form.Text className="text-muted">
              Preferrably a different password from your Hive keys
            </Form.Text>
          </Form.Group>
        </>
      );
    } else {
      return (
        <>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onChange={onChangePassword}
              type="password"
              placeholder="Password"
            />
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="formBasicPasswordConfirmation"
          >
            <Form.Label>confirm Password</Form.Label>
            <Form.Control
              onChange={onChangePasswordConfirm}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Group>
        </>
      );
    }
  }

  function onChangeAccount(event) {
    setAccount(event.target.value);
  }
  function onChangePassword(event) {
    setPassword(event.target.value);
  }
  function onChangePasswordConfirm(event) {
    setPasswordConfirm(event.target.value);
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicAccount">
              <Form.Label>Hive Account</Form.Label>
              <Form.Control
                onChange={onChangeAccount}
                type="account"
                placeholder="Your Hive Username"
              />
            </Form.Group>
            {passwordField()}
            <Form.Group className="mb-3" controlId="formRegister">
              <Alert key="light" variant="light">
                {register ? "Not registered yet?" : "Already registered?"}
                &nbsp;
                <Alert.Link onClick={onClickSwitchLoginRegister}>
                  {register ? "Create an account" : "Log in"}
                </Alert.Link>
              </Alert>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={gunRegistration}>
            {register ? "Log in" : "Register"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginModal;
