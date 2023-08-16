# REST API, version 0.0.7

# /info

**@Get @Post** 
Returns information about backend node.


#### Example:
```
curl https://chat-api.peakd.com/api/info
```

#### Example output:

```
[true, 
{	
    name: "main[STM7RgJh7MsuADocKQPrwpbDSAkA8bWbkvMmxoM7xR86QqC8ugFyj]",
    host: "http://localhost:3000",
    account: "",
    version: 7,
    nodes: […],
    preferencesChecksum:	{…},
    messagesChecksum:	{…},
    time:	1688674816094
}]
```


# /read

**@Post**
Read messages in conversation between two timestamps.

#### Example:
```
curl -H "Content-Type: application/json" -d '["hive-1111111/0",0,1688675606349]' https://chat-api.peakd.com/api/read
```

#### Example: output:
```
[true,[["w","kemtwom5","hive-1111111/0","[\"t\",\"hi\"]",1683253727579,"p","1f13c828469d...
```

# /readPreference/:username

**@Get**
Read user preferences

#### Example::
```
curl https://chat-api.peakd.com/api/readPreference/am7
```

#### Example: output:
```
[true,["w","am7","@","[\"p\",{\"groups\":{\"0\": ...
```

# /readPreference

**@Post** 
Read user preferences

#### Example::
```
curl -H "Content-Type: application/json" -d '["am7"]' https://chat-api.peakd.com/api/readPreference
```

#### Example: output:
```
[true,["w","am7","@","[\"p\",{\"groups\":{\"0\": ...
```

# /readUserConversations/:username

**@Get @Post**
Read the usernames of most recent users which posted a message to given user.
Useful for displaying a list of direct messages for user.

#### Example::
```
curl https://chat-api.peakd.com/api/readUserConversations/am7
```

#### Example: output:
```
[true,["am7|am7-test"]]
```

# /readNotifications/:from

**@Get**
Retrieve account notifications.

The following types are returned:
- `'direct'` on direct message,     
- `'mention'` on quote or mention,
- `'response'` on emote response,
- `'continuation'` on continuing conversation in public channel

#### Example:
```
curl https://chat-api.peakd.com/api/readNotifications/am7
```

#### Example: output:
```
[true, [
    {
     "type": "mention",
     "date": "2023-08-13T11:24:37.105Z",
     "msg":  "mention from @am7-test",
     "url":  "/t/hive-163399/2?j=am7-test|1691925877105"
    }
]]
```

# /readNotificationCount/:from

**@Get**
If users has uploaded notification count, download it along with timestamp.
This notification count is unrelated to the results returned by `/readNotifications`

#### Example::
```
curl https://chat-api.peakd.com/api/readNotificationCount/am7
```

#### Example: output:
```
[true,1,1689103294158]
```

# /stats

**@Get @Post** 
Return stats: returns an array of up to 7 json objects. Each object represents a day with key being the
name of community and value being the number of messages send in that day in the particular community.

#### Example::
```
curl https://chat-api.peakd.com/api/stats
```

#### Example: output:
```
[true,[true,[[{"hive-127515":1,"hive-163399":4,"hive-156444":1,...
```
(In next api version will be changed to return the form of `[true,[[{"hive-127515":1,...` )

# /write

**@Post**
Used to broadcast a message. 
Use SignableMessage class of the messaging library to create a signed json message.

# /version

**@Get @Post** 
Returns version. 

#### Example::
```
curl https://chat-api.peakd.com/api/version
```

#### Example: output:
```
[true,7]
```

# /readPreferences/:from/[:user]/[:limit]

**@Get**
Methods usable by backend nodes to download user preferences in bulk.

# /readMessages/:from/[:lastid]/[:limit]

**@Get** 
Methods usable by backend nodes to download messages in bulk.

# /account

**@Post**
Methods usable by backend nodes to create guest accounts.


# /availableAccount/:username

**@Get**
Methods usable by backend nodes to check free guest account names.

