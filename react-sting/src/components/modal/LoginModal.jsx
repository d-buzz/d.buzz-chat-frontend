import { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { KeysUtils } from "../../utils/keys.utils";
function LoginModal(props) {
  const [show, setShow] = useState(true);

  // const [gun, setGun] = useState();
  const [user, setUser] = useState();

  const [register, setRegister] = useState(props.show); //true=login mode (suggests registration)
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  useEffect(() => {
    setUser(props.user);
    setShow(props.show);
    handleClose();
  }, [props]);

  const handleClose = () => {
    if (props.accountData) {
      if (props.accountData.privateKey) {
        setShow(false);
      }
    } else {
      //fixme handle when user is not authenticated but wants to close modal
    }
  };
  // const handleShow = () => setShow(true);
  function onClickSwitchLoginRegister() {
    setRegister(!register);
  }

  function registration() {
    if (props.setAccountData) {
      if (register) {
        //login
        props.hive.api.getAccounts([account], function (err, result) {
          // props.hive.api.verifyAccountAuthority(
          //   account,
          //   [password],
          //   function (err, result) {
          //     console.log(err, result);
          //   }
          // );
          const pubUnknown =
            KeysUtils.getPublicKeyFromPrivateKeyString(password);
          if (pubUnknown === result[0].memo_key) {
            let newUser = {
              ...result[0],
              account,
              privateKey: password,
            };
            props.setAccountData(newUser);
          }
        });
      } else {
        //fixme if gun or setGunAccountData are not passed as prop
      }
      handleClose();
    }
  }

  function passwordField() {
    if (register) {
      return (
        <>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Private MEMO Key</Form.Label>
            <Form.Control
              onChange={onChangePassword}
              type="password"
              placeholder="Password"
            />
            <Form.Text className="text-muted">
              Never use your Active nor Posting keys.
            </Form.Text>
          </Form.Group>
        </>
      );
      // } else {
      //   return (
      //     <>
      //       <Form.Group className="mb-3" controlId="formBasicPassword">
      //         <Form.Label>Password</Form.Label>
      //         <Form.Control
      //           onChange={onChangePassword}
      //           type="password"
      //           placeholder="Password"
      //         />
      //       </Form.Group>
      //       <Form.Group
      //         className="mb-3"
      //         controlId="formBasicPasswordConfirmation"
      //       >
      //         <Form.Label>confirm Password</Form.Label>
      //         <Form.Control
      //           onChange={onChangePasswordConfirm}
      //           type="password"
      //           placeholder="Confirm Password"
      //         />
      //       </Form.Group>
      //     </>
      //   );
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
            {/* <Form.Group className="mb-3" controlId="formRegister">
              <Alert key="light" variant="light">
                {register ? "Not registered yet?" : "Already registered?"}
                &nbsp;
                <Alert.Link onClick={onClickSwitchLoginRegister}>
                  {register ? "Create an account" : "Log in"}
                </Alert.Link>
              </Alert>
            </Form.Group> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={registration}>
            {register ? "Log in" : "Register"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginModal;
