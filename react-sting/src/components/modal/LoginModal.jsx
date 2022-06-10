import { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
function LoginModal(props) {
  const [show, setShow] = useState(true);
  const [account, setAccount] = useState("");
  useEffect(() => {
    setShow(props.show);
    handleClose();
  }, [props]);

  const handleClose = () => {
    if (props.accountData) {
      if (props.accountData.name) {
        setShow(false);
      }
    } else {
      //fixme handle when user is not authenticated but wants to close modal
    }
  };

  function registration() {
    if (props.setAccountData) {
      const user = account;
      window.hive_keychain.requestEncodeMessage(
        user,
        user,
        "#login-HiveHub.Dev",
        "Active",
        function (encrypted) {
          window.hive_keychain.requestVerifyKey(
            user,
            encrypted.result,
            "Active",
            function (decrypted) {
              if (decrypted.result === "#login-HiveHub.Dev") {
                props.hive.api.getAccounts([account], function (err, result) {
                  props.setAccountData(result[0]);
                });
              }
            }
          );
        }
      );
    }
    handleClose();
  }

  function onChangeAccount(event) {
    setAccount(event.target.value);
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Keychain Login</Modal.Title>
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
            <Form.Group className="mb-3" controlId="formRegister">
              <Alert key="light" variant="light">
                Don't have Keychain? &nbsp;
                <Alert.Link target="_blank" href="https://hive-keychain.com/">
                  Get it here
                </Alert.Link>
              </Alert>
            </Form.Group>
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
