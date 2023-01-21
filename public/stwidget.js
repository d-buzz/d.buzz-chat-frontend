
class StWidget {

    constructor(url) { 
        this.url = url;
        this.element = null;
        this.iframe = null;
        this.properties = null;
        this.initialized = false;
        this.enableKeychainPassthrough = true;
        this.messageListener = null;
    }
    createElement(width=450, height=556) {
        this.initialize();
        var div = document.createElement('div');
        this.element = div;
        var style = {
            position: 'absolute',
            'z-index': 10000,
            border: '1px solid gray'
        };
        
        this.setStyle(style);
        this.resize(width, height);

        var iframe = document.createElement('iframe');
        this.iframe = iframe;
        iframe.src = this.url;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        div.appendChild(iframe);

        return div;
    }
    resize(width=450, height=556) {
        this.setStyle({
            width: typeof width === 'string'?width:(width+'px'),
            height: typeof height === 'string'?height:(height+'px'),
        });
    }
    setStyle(style) {
        for(var name in style) this.element.style.setProperty(name, style[name]);
    }
    setProperties(properties) {
        this.properties = properties;
        if(this.initialized) {
            var _this = this;
            if(this.iframe.contentWindow != null)
                this.iframe.contentWindow.postMessage(["stlib", "setProperties", JSON.stringify(this.properties)], '*');
            else this.iframe.addEventListener( "load", ()=>{
                _this.iframe.contentWindow.postMessage(["stlib", "setProperties", JSON.stringify(this.properties)], '*');
            });
        }
    }
    /*setUser(username) {
        var iframe = this.iframe;
        if(iframe.contentWindow != null)
            iframe.contentWindow.postMessage(JSON.stringify(["stlib", "setUser", username]), '*');
        else iframe.addEventListener( "load", ()=>{
            iframe.contentWindow.postMessage(JSON.stringify(["stlib", "setUser", username]), '*');
        });
    }*/

    initialize() {
        if(this.messageListener != null) return;
        var _this = this;
        this.messageListener = (event) => {
            try {
                if(event.data != null && Array.isArray(event.data)) {
                    var data = event.data;
                    if(data.length > 2 && data[0] === 'stlib') {
                        _this.onMessage(event, data[1], data[2], data.length > 3?data[3]:[]);
                    }
                }
            }
            catch(e) { console.log(e); }
        };
        window.addEventListener("message", this.messageListener);
    }
    onMessage(event, msgId, name, args) {
        switch(name) {
            case "initialize":
                this.initialized = true;
                if(this.properties != null) 
                    event.source.postMessage(["stlib", "setProperties", JSON.stringify(this.properties)], event.origin);
                break;
            case "requestVerifyKey":
                if(this.enableKeychainPassthrough) window.hive_keychain.requestVerifyKey(args[0], args[1], args[2], (r)=>{
                    event.source.postMessage(["stlib", msgId, JSON.stringify(r)], event.origin);
                });
            break;
            case "requestSignBuffer":
                if(this.enableKeychainPassthrough) window.hive_keychain.requestSignBuffer(args[0], args[1], args[2], (r)=>{
                    event.source.postMessage(["stlib", msgId, JSON.stringify(r)], event.origin);
                });
            break;
            case "requestEncodeMessage":
                if(this.enableKeychainPassthrough) window.hive_keychain.requestEncodeMessage(args[0], args[1], args[2], args[3], (r)=>{
                    event.source.postMessage(["stlib", msgId, JSON.stringify(r)], event.origin);
                });
            break;
        }
    }
    cleanup() {
        if(this.messageListener != null) {
            window.removeEventListener("message", this.messageListener);
            this.messageListener = null;
        }
    }
}





