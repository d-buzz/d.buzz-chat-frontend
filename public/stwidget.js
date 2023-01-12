
class StWidget {

    constructor(url) { 
        this.url = url;
        this.element = null;
        this.iframe = null;
    }
    createElement(width=450, height=556) {
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
    /*setUser(username) {
        var iframe = this.iframe;
        if(iframe.contentWindow != null)
            iframe.contentWindow.postMessage(JSON.stringify(["stlib", "setUser", username]), '*');
        else iframe.addEventListener( "load", ()=>{
            iframe.contentWindow.postMessage(JSON.stringify(["stlib", "setUser", username]), '*');
        });
    }*/

    static keychainPassthroughListener = null;
    static enableKeychainPassthrough(enable = true) {
        if(enable && StWidget.keychainPassthroughListener == null) {
            StWidget.keychainPassthroughListener = (event) => {
                try {
                    if(event.data != null && typeof event.data === 'string') {
                        var data = JSON.parse(event.data);
                        if(Array.isArray(data) && data.length > 2 && data[0] === 'stlib') {
                            switch(data[2]) {
                                case "requestVerifyKey":
                                    window.hive_keychain.requestVerifyKey(data[3], data[4], data[5], (r)=>{
                                        event.source.postMessage(JSON.stringify(["stlib", data[1], r]), event.origin);
                                    });
                                break;
                                case "requestSignBuffer":
                                    window.hive_keychain.requestSignBuffer(data[3], data[4], data[5], (r)=>{
                                        event.source.postMessage(JSON.stringify(["stlib", data[1], r]), event.origin);
                                    });
                                break;
                                case "requestEncodeMessage":
                                    window.hive_keychain.requestEncodeMessage(data[3], data[4], data[5], data[6], (r)=>{
                                        event.source.postMessage(JSON.stringify(["stlib", data[1], r]), event.origin);
                                    });
                                break;
                            }
                        }
                    }
                }
                catch(e) { console.log(e); }
            };
            window.addEventListener("message", StWidget.keychainPassthroughListener);
        }
        else if(!enable && StWidget.keychainPassthroughListener != null) {
            window.removeEventListener("message", StWidget.keychainPassthroughListener);
            StWidget.keychainPassthroughListener = null;
        }
    }
}





