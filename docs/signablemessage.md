# Signable Message API




Client API provides low level methods for communication with the backend nodes.

## Download or build the library and dependencies

This messaging library uses [dhive](https://www.npmjs.com/package/@hiveio/dhive) and [socketio](https://gitlab.com/peakd/sting-message-frontend/-/blob/main/public/socket.io.js) as dependency.

A prebuild bundled version is [available here](https://gitlab.com/peakd/sting-message-frontend/-/blob/main/public/stlib.js) For building the library from source refer to the section on bottom.

Include bundled libraries:
```
<script src="/socket.io/socket.io.js"></script>
<script src="/dhive.js"></script>
<script src="/stlib.js"></script>
```

## Initializing client instance

Create a new socket and pass it to the Client constructor.
```
var socket = io("https://chat-api.peakd.com", {
    transports:["websocket", "polling"]
});
var client = new stlib.Client(socket);
```

Or if one uses the MessageManager which uses Client instance behind the scenes and manages connection, reconnection and fallback nodes, the client instance can be retrieved with:
```
var client = messageManagerInstance.client;
```

## Reading messages

To read messages we can use the read method. It has the following signature.

```
async read(conversation: string,
     fromTimestamp: number = -1,
     toTimestamp: number = -1,
     lastId: number = -1,
     limit: number = 100): Promise<CallbackResult>;
```
conversation - is a string specifying the conversation to read, public community messages
     have conversation such as "hive-1111111/0" for channel 0 of community "hive-1111111".
     Communities can have multiple channels. 
    Direct messages have the form of "hiveUser1|hiveUser2" for up to 4 users specifed. The users are sorted in alphabetical order.
    Group messages have the form of "#hiveUser1/0" representing group 0 of user who has created it.

```
var result = await client.read("hive-1111111/0");
if(result.isSuccess()) {
    var messages = result.getResult();
    for(var message of messages) {
        console.log(message);
    }
}
else {
    console.log(result.getError());
}

```

## Hello Client example

This example will use the low-level Client API to send
and read "Hello World!".


```
async function helloWorld(username,  /* hive username */ 
    message="Hello World!",          /* message to send */
    conversation="hive-1111111/0") { /* hive community and channel number to send it to */
    
    /* create an instance of Client and connect to set node */
    var socket = io("https://chat-api.peakd.com", {
        transports:["websocket", "polling"]
    });
    var client = new stlib.Client(socket);

    /*
    Check if we have connected to the expected network
    */
    var NETWORK_NAME = "main[STM7RgJh7MsuADocKQPrwpbDSAkA8bWbkvMmxoM7xR86QqC8ugFyj]";
    var result = await client.readInfo();
    if(result.isSuccess() && result.getResult().name == NETWORK_NAME) 
        stlib.Utils.setNetworkname(result.getResult().name);
    else throw "failed to connect to network";   

    /* Create a text message */
    var textMsg = stlib.Content.text(message);

    /* Create signable message */
    var signableMessage = textMsg.forUser(username, conversation);

    /* Let's use keychain for signing the message */
    await signableMessage.signWithKeychain();
    /* 
       Alternatively, once can specify posting key instead
       this might be useful for scripts:
       signableMessage.signWithKey("5J123...", "Posting");
    */

    /* Send the message */
    var result = await client.write(signableMessage);
    if(result.isSuccess()) 
        console.log("Message written successfully!");
    else 
        console.log("Error sending message: ", result.getError());

    /* Finally, download and print the recent 5 messages. */
    var result = await client.read(conversation, -1, -1, -1, 5);

    if(result.isSuccess()) {
        var messages = result.getResult();
        for(var message of messages) {
            console.log("Message JSON: ", message);
        }
    }

    /* Close the connetion*/
    client.close();
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


