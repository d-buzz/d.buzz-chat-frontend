
class StWidget {
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





