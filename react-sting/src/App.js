import { useEffect, useState } from "react";
import Gun from "gun";
import SEA from "gun/sea";
import LoginModal from "./components/modal/LoginModal";
import { Button } from "react-bootstrap";

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
  const [gun, setGun] = useState();
  const [gunAccountData, setGunAccountData] = useState({
    gunPublicKey: "",
    account: "",
  });

  // when the app loads, fetch the current messages and load them into the state
  // this also subscribes to new data as it changes and updates the local state
  useEffect(() => {
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
            name: m.name,
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
      name: formState.name,
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
          gunAccountData.account
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
      <input
        onChange={onChange}
        placeholder="Name"
        name="name"
        value={formState.name}
      />
      <input
        onChange={onChange}
        placeholder="Message"
        name="message"
        value={formState.message}
      />
      <button onClick={saveMessage}>Send Message</button>
      {state.messages.map((message) => (
        <div key={message.createdAt}>
          <h2>{message.message}</h2>
          <h3>From: {message.name}</h3>
          <p>Date: {message.createdAt}</p>
        </div>
      ))}
    </div>
  );
}
