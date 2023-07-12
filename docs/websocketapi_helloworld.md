
# Websocket API - Hello World!

The first tutorial shows how to send a 'Hello World!' message and read it back.

## Download or build the library and dependencies

This messaging library uses [dhive](https://www.npmjs.com/package/@hiveio/dhive) and
 [socketio](https://gitlab.com/peakd/sting-message-frontend/-/blob/main/public/socket.io.js) as dependency.

A prebuild bundled version is [available here](https://gitlab.com/peakd/sting-message-frontend/-/blob/main/public/stlib.js)
For building the library from source refer to the section on bottom.

Include bundled libraries:
```
<script src="/socket.io/socket.io.js"></script>
<script src="/dhive.js"></script>
<script src="/stlib.js"></script>
```

## Hello World example

This example will use the high-level api of MessageManager to send
and read "Hello World!".


```
async function helloWorld(username,  /* hive username */ 
    message="Hello World!",          /* message to send */
    conversation="hive-1111111/0") { /* hive community and channel number to send it to */
    
    /* create an instance of MessageManager and set list of public nodes to connect to */
    const manager = new stlib.MessageManager();
    manager.setNodes(["https://chat-api.peakd.com", "https://sting.actifit.io"]);

    /*
    Check if we have connected to the expected network
    */
    var NETWORK_NAME = "main[STM7RgJh7MsuADocKQPrwpbDSAkA8bWbkvMmxoM7xR86QqC8ugFyj]";
    var result = await manager.getClient().readInfo();
    if(result.isSuccess() && result.getResult().name == NETWORK_NAME) 
        stlib.Utils.setNetworkname(result.getResult().name);
    else throw "failed to connect to network";

    /* Let's use keychain for signing the message */
    manager.setUseKeychain();
    /* 
       Alternatively, once can specify posting key instead
       this might be useful for scripts:
       manager.setLoginKey("5J123...");
    */

    manager.setUser(username);
    manager.setConversation(conversation);

    /* Create a text message */
    var textMsg = stlib.Content.text(message);

    /* Send the message */
    var result = await manager.sendMessage(textMsg, conversation);
    if(result.isSuccess()) 
        console.log("Message written successfully!");
    else 
        console.log("Error sending message: ", result.getError());

    /* Finally, download and print the messages. */
    var result = await manager.getSelectedConversations();
    
    /* Print the recent 5 messages. */
    var limit = 5;
    for(var message of result.messages) {
        console.log("Message JSON: ", message.content.json, ", isVerified: ", message.verified);
        limit--;
        if(limit <= 0) break;
    }
}
```

## Optional: Building messaging library

Clone the [gitlab repository https://gitlab.com/peakd/sting-message-backend](https://gitlab.com/peakd/sting-message-backend)

Install yarn and run:
```
yarn
yarn buildlib
```

The compiled library will is located in `dist/web/bundle`






