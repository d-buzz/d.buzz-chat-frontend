import { useEffect, useState } from "react";
import LoginModal from "./components/modal/LoginModal";
import {
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import hive from "@hiveio/hive-js";
import axios from "axios";

// initialize gun locally

export default function App() {
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({
    name: "",
    message: "",
  });

  const [showLoginModal, setShowLoginModal] = useState(true);
  const [user, setUser] = useState();
  const [chatHighlighted, setChatHighlighted] = useState("");
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState("");

  // const [gun, setGun] = useState();
  const [accountData, setAccountData] = useState({
    privateKey: "",
    account: "",
  });

  // set a new message in gun, update the local state to reset the form field
  function saveMessage() {
    console.log("messages");
    console.log(messages);
    let newMessage = {
      fromAccount: accountData.account,
      toAccount: chatHighlighted,
      message: formState.message,
      createdAt: Date.now(),
      fromPubKey: "dasdqa",
      toPubKey: "4123ed3",
    };
    axios
      .post("/message", newMessage)
      .then((res) => {
        console.log("res");
        console.log(res);
        if (res.status == 200) {
          setMessages([...messages, newMessage]);
        }
      })
      .catch((err) => console.log(err));
    setForm({
      name: "",
      message: "",
    });
  }

  // update the form state as the user types
  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value });
  }

  return (
    <div style={{ padding: 30 }}>
      <h6 className="font-weight-bold mb-3 text-lg-left">
        {accountData.account ? (
          <>
            @{accountData.account}{" "}
            <Button
              variant="primary"
              onClick={() => {
                setAccountData({
                  publicKey: "",
                  account: "",
                });
                setShowLoginModal(true);
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            variant="primary"
            onClick={() => {
              setShowLoginModal(true);
            }}
          >
            Login/Register
          </Button>
        )}
      </h6>
      <LoginModal
        hive={hive}
        accountData={accountData}
        setAccountData={setAccountData}
        user={user}
        show={showLoginModal}
      />
      <Container fluid>
        <Row>
          <Col xs={4}>
            <Container>
              <Container>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1">@</InputGroup.Text>

                  <FormControl
                    placeholder="Contact"
                    aria-label="Contact"
                    aria-describedby="Contact"
                    onChange={(e) => {
                      setNewContact(e.target.value);
                    }}
                  />
                  <Button
                    variant="outline-secondary"
                    id="button-addon1"
                    onClick={() => {
                      if (
                        !contacts.some((e) => {
                          return e.account === newContact;
                        }) &&
                        newContact != ""
                      ) {
                        hive.api.getAccounts(
                          [newContact],
                          function (err, result) {
                            if (result && result.length > 0) {
                              setContacts([
                                { ...result[0], account: newContact },
                                ...contacts,
                              ]);
                              setChatHighlighted(newContact);
                            }
                          }
                        );
                      }
                    }}
                  >
                    Message
                  </Button>
                </InputGroup>
              </Container>

              <Container>
                <ListGroup defaultActiveKey="#link1">
                  {contacts.map((contact) => (
                    <ListGroup.Item
                      action
                      active={contact.account === chatHighlighted}
                      onClick={() => {
                        setChatHighlighted(contact.account);
                      }}
                    >
                      {contact.account}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Container>
            </Container>
          </Col>
          <Col xs={8}>
            <Container>
              <input
                onChange={onChange}
                placeholder="Message"
                name="message"
                value={formState.message}
              />
              <button onClick={saveMessage}>Send Message</button>
              {messages.length > 0 ? (
                messages
                  .filter((message) => {
                    if (message.fromAccount != "" && message.toAccount != "") {
                      return (
                        (message.fromAccount === chatHighlighted &&
                          message.toAccount === accountData.account) ||
                        (message.toAccount === chatHighlighted &&
                          message.fromAccount === accountData.account)
                      );
                    }
                  })
                  .map((message) => {
                    return (
                      <div key={message.createdAt}>
                        <h2>{message.message}</h2>
                        <p>From: {message.fromAccount}</p>
                        <p>To: {message.toAccount}</p>
                        <p>Date: {message.createdAt}</p>
                      </div>
                    );
                  })
              ) : (
                <></>
              )}
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
