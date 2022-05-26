import { useEffect, useState } from "react";
import Gun from "gun";
import SEA from "gun/sea";
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

// initialize gun locally

export default function App() {
  // create the initial state to hold the messages
  const initialState = {
    messages: [],
  };
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({
    name: "",
    message: "",
  });

  // initialize the reducer & state for holding the messages array
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [state, setState] = useState(initialState);
  const [gunUser, setGunUser] = useState();
  const [gunChatHighlighted, setGunChatHighlighted] = useState("");
  const [gunContacts, setGunContacts] = useState([]);
  const [gunNewContact, setGunNewContact] = useState("");

  const [gun, setGun] = useState();
  const [gunAccountData, setGunAccountData] = useState({
    gunPublicKey: "",
    account: "",
  });

  // when the app loads, fetch the current messages and load them into the state
  // this also subscribes to new data as it changes and updates the local state
  useEffect(() => {
    hive.api.getAccounts(["igormuba"], function (err, result) {
      console.log(err, result);
    });
    const gun = Gun({
      peers: ["http://localhost:3030/gun"],
    });
    setGun(gun);
    let newGun = gun.user().recall({ sessionStorage: true });
    setGunUser(newGun);
    const messages = gun.get("messages");
    messages.map().once((m) => {
      setState((state) => ({
        messages: [
          {
            fromAccount: m.fromAccount,
            toAccount: m.toAccount,
            message: m.message,
            createdAt: m.createdAt,
          },
          ...state.messages,
        ],
      }));
    });
  }, []);

  // set a new message in gun, update the local state to reset the form field
  function saveMessage() {
    const messages = gun.get("messages");
    messages.set({
      fromAccount: gunAccountData.account,
      toAccount: gunChatHighlighted,
      message: formState.message,
      createdAt: Date.now(),
    });
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
        {gunAccountData.account ? (
          <>
            @{gunAccountData.account}{" "}
            <Button
              variant="primary"
              onClick={() => {
                gun.user().leave();
                setGunAccountData({
                  gunPublicKey: "",
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
        gunAccountData={gunAccountData}
        setGunAccountData={setGunAccountData}
        gun={gun}
        gunUser={gunUser}
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
                      setGunNewContact(e.target.value);
                    }}
                  />
                  <Button
                    variant="outline-secondary"
                    id="button-addon1"
                    onClick={() => {
                      if (
                        !gunContacts.some((e) => {
                          return e.account === gunNewContact;
                        }) &&
                        gunNewContact != ""
                      ) {
                        gun.get("users").get(gunNewContact, function (ack) {
                          if (ack) {
                            if (ack.put) {
                              setGunContacts([ack.put, ...gunContacts]);
                            }
                          }
                        });
                      }
                      setGunChatHighlighted(gunNewContact);
                    }}
                  >
                    Message
                  </Button>
                </InputGroup>
              </Container>

              <Container>
                <ListGroup defaultActiveKey="#link1">
                  {gunContacts.map((contact) => (
                    <ListGroup.Item
                      action
                      active={contact.account === gunChatHighlighted}
                      onClick={() => {
                        setGunChatHighlighted(contact.account);
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
              {state.messages
                .filter((message) => {
                  if (message.fromAccount != "" && message.toAccount != "") {
                    return (
                      (message.fromAccount === gunChatHighlighted &&
                        message.toAccount === gunAccountData.account) ||
                      (message.toAccount === gunChatHighlighted &&
                        message.fromAccount === gunAccountData.account)
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
                })}
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
