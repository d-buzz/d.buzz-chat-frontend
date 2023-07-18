# Widget

About the messaging widget:

- Supports encrypted direct & group messages
- Community chat channels
- Keychain login/guest account
- Customizable UI
- Customizable themes and fonts

![](https://images.hive.blog/0x0/https://files.peakd.com/file/peakd-hive/mirafun/23t88FNztKaw7aqgvsomJ2sYxWk8c9bwzgkuXTznnkasRhe32319HHtgtqz16DN6JxAko.png)

### How to add messaging widget to a website

#### Step 1. stwidget.js lib

Download and host (preferred) or add script: https://chat.peakd.com/stwidget.js (Also available on gitlab)

#### Step 2. Use the generated code from Widget Editor or from the example below:

Generate the code with customization through the [widget editor](https://chat.peakd.com/widgeteditor) or copy the example on how to embed the widget with JavaScript shown below.

```
<!DOCTYPE html>
<html>
  <head>
    <script src="stwidget.js"></script>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Widget Embed Example</title>
  </head>
  <body> 
    <p>Widget Embed example</p>
    <div id="customDiv"></div>
    <p>You can further customize by tweaking properties. Check out the 
        <a href="https://chat.peakd.com/widgettest">property editor</a>, send feedback and 
        feature requests in the chat window above or 
        <a href="https://chat.peakd.com/t/hive-163399/0">open in new window.</a></p>
    <script>
        var stwidget = new StWidget('https://chat.peakd.com/t/hive-163399/0');
        stwidget.properties = { "requireLogin": false, "sidebar": 2};    
        var element = stwidget.createElement('450px', '556px', false/*overlay*/, true /*resizable*/);

        document.getElementById("customDiv").appendChild(element);
    </script>
  </body>
</html>
```

The code example above and other examples on how to overlay the widget and show/hide it on a click of a button in JavaScript or Vue are available here.

**Further Customization**

Feel free to post customization ideas in the chat: https://chat.peakd.com/t/hive-163399/0

**Alternatively: clone the widget code for manual customization**

Clone the open source frontend repository and host the widget on your domain to customize it.

### stwidget.js API

#### StWidget class

- `constructor(url)` - create a new widget with specified page to display

Example:
```
var w = new StWidget('https://chat.peakd.com/t/hive-163399/0');
```

#### setUser

Set the logged in user.

- `setUser(user)`

Example:
```
w.setUser(`user`);
```

#### setPostingKey

Set the logged in user's posting key. (The default is to use keychain)
Requires dhive library as second parameter.

- `setPostingKey(postingKey, dhive)`

Example:
```
w.setPostingKey("5J123...", dhive);
```

#### setProperties

Set widget properties. Refer to the [Widget editor](https://chat.peakd.com/widgeteditor) for a list of properties or use it to customize the widget and generate the code for setting it up.

- `setProperties(properties)`

Example:
```
w.setProperties({ "requireLogin": false, "sidebar": 2, "defaultTheme": "Light"});
```

#### createElement

Creates a widget iframe that can be appended to html dom. Call at most one time.

- `createElement(width=450, height=556, overlay=true, resizable=true)`

Example:
```
var element = w.createElement('450px', '556px', false/*overlay*/, true /*resizable*/);
document.getElementById("customDiv").appendChild(element);
```

#### setStyle

Sets css properties for the created iframe. Call after createElement.
- `setStyle(style)`

Example:
```
var element = w.createElement('450px', '556px', true, true);
w.setStyle({ direction: 'rtl', top: '51px', right: '32px' });
```

#### resize

Resizes the widget.

- `resize(width=450, height=556)`

Example:
```
w.resize(500, 700);
```

#### setLastReadCallback

Sets the last read callback, the callback receives an object with direct and community notifications count.

- `setLastReadCallback(fn)`

Example:
```
w.setLastReadCallback((obj)=>{
   console.log("Direct and group: ", obj.group, "Community:", obj.community);
});
```

#### navigate

Navigate to a different page or messaging area.

- `navigate(url)`

Example:
```
w.navigate("https://chat.peakd.com/home");
```

### pause

Pause or resume the widget. On pause the websocket connection is closed.

- `pause(value: boolean)`

Example:
```
w.pause(true);
```

#### cleanup

Cleanup to remove postMessage listener.

- `cleanup()`

Example:
```
w.cleanup();
```







