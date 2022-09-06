(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.CallbackResult = void 0;
class CallbackResult {
    constructor(success, result) {
        this.success = success;
        this.result = result;
    }
    isSuccess() { return this.success; }
    getResult() { return this.isSuccess() ? this.result : null; }
    getError() { return this.isSuccess() ? null : this.result; }
}
exports.CallbackResult = CallbackResult;
class Client {
    constructor(socket) {
        this.io = socket;
        socket.on("w", (text) => {
            if (this.onmessage !== null)
                this.onmessage(JSON.parse(text));
        });
    }
    readNodeVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.emit('v', "");
        });
    }
    readPreferences(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.emit("r", ["r", '@', username]);
        });
    }
    readUserConversations(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.emit("r", ["r", '@@', username]);
        });
    }
    readUserMessages(username, fromTimestamp, toTimestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.read('@' + username, fromTimestamp, toTimestamp);
        });
    }
    read(conversation, fromTimestamp, toTimestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.emit("r", ["r", conversation, fromTimestamp, toTimestamp]);
        });
    }
    write(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!msg.isSigned())
                throw 'message is not signed.';
            if (msg.isEncrypted() && !msg.isSignedWithGroupKey())
                throw 'message is not signed with group key.';
            return yield this.write0(msg);
        });
    }
    write0(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.emit(msg.type, msg.toJSON());
        });
    }
    join(conversation) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.emit('j', conversation);
        });
    }
    leave(conversation) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.emit('l', conversation);
        });
    }
    emit(type, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, error) => {
                try {
                    this.io.emit(type, data, (data) => {
                        resolve(new CallbackResult(data[0], data[1]));
                    });
                }
                catch (e) {
                    error(e);
                }
            });
        });
    }
}
exports.Client = Client;

},{}],2:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Community = void 0;
const data_stream_1 = require("./data-stream");
const data_path_1 = require("./data-path");
const utils_1 = require("./utils");
class Community {
    initialize(communityData) {
        this.communityData = communityData;
        var settings = this.getSettings();
        if (settings.streams === undefined) {
            this.streams = Community.defaultStreams(this.getName());
            return;
        }
        this.streams = [];
        for (var stream of settings.streams)
            this.streams.push(data_stream_1.DataStream.fromJSON(this.getName(), stream));
    }
    getName() { return this.communityData.name; }
    getTitle() { return this.communityData.title; }
    getAbout() { return this.communityData.about; }
    getDescription() { return this.communityData.description; }
    getRules() { return this.communityData.flag_text; }
    getSettings() { return this.communityData.settings; }
    getStreams() { return this.streams; }
    setStreams(streams) { this.streams = streams; }
    addStream(stream) { this.streams.push(stream); }
    getRole(username) {
        var role = this.getRoleEntry(username);
        return role == null ? null : role[1];
    }
    getTitles(username) {
        var role = this.getRoleEntry(username);
        return role == null ? null : role[2];
    }
    hasTitle(username, title) {
        var titles = this.getTitles(username);
        return titles === null ? false : titles.indexOf(title) !== -1;
    }
    getRoleEntry(username) {
        var roles = this.communityData.roles;
        if (roles == null)
            return null;
        var role = roles[username];
        return role == null ? null : role;
    }
    newCategory(name) {
        var category = data_stream_1.DataStream.fromJSON(this.getName(), [name]);
        this.addStream(category);
        return category;
    }
    newTextStream(name) {
        var groupId = this.findFreeTextStreamId();
        if (groupId === -1)
            throw "maximum limit of " + Community.MAX_TEXT_STREAMS + " text streams reached";
        var stream = data_stream_1.DataStream.fromJSON(this.getName(), [name, '' + groupId]);
        this.addStream(stream);
        return stream;
    }
    newInfo(name, path) {
        var info = data_stream_1.DataStream.fromJSON(this.getName(), [name, path]);
        this.addStream(info);
        return info;
    }
    findFreeTextStreamId() {
        var name = this.getName();
        var streams = this.getStreams();
        loop: for (var i = 0; i < Community.MAX_TEXT_STREAMS; i++) {
            for (var stream of streams) {
                if (stream.hasPath()) {
                    var path = stream.getPath();
                    if (path.getType() === data_path_1.DataPath.TYPE_TEXT &&
                        path.getUser() === name &&
                        path.getPath() === '' + i)
                        continue loop;
                }
            }
            return i;
        }
        return -1;
    }
    findTextStreamById(id) {
        var name = this.getName();
        var streams = this.getStreams();
        loop: for (var i = 0; i < Community.MAX_TEXT_STREAMS; i++) {
            for (var stream of streams) {
                if (stream.hasPath()) {
                    var path = stream.getPath();
                    if (path.getType() === data_path_1.DataPath.TYPE_TEXT &&
                        path.getUser() === name &&
                        path.getPath() === id)
                        return stream;
                }
            }
        }
        return null;
    }
    /*canUpdateSettings(user: string): boolean {
        return true;
    }*/
    updateRoleCustomJSON(user, role) {
        return ["setRole", {
                "community": this.getName(),
                "account": user, "role": role
            }];
    }
    updateTitlesCustomJSON(user, titles) {
        return ["setUserTitle", {
                "community": this.getName(),
                "account": user, "title": titles.join(",")
            }];
    }
    updateSettingsCustomJSON(settings) {
        return ["updateProps", {
                "community": this.getName(),
                "props": { "settings": settings }
            }];
    }
    updateStreamsCustomJSON() {
        var settings = utils_1.Utils.copy(this.getSettings());
        settings.streams = [];
        for (var stream of this.streams)
            settings.streams.push(stream.toJSON());
        return this.updateSettingsCustomJSON(settings);
    }
    copy() {
        var copy = new Community();
        copy.communityData = this.communityData;
        copy.streams = [];
        for (var stream of this.streams)
            copy.streams.push(data_stream_1.DataStream.fromJSON(stream.community, stream.toJSON()));
        return copy;
    }
    static defaultStreams(community) {
        return [
            data_stream_1.DataStream.fromJSON(community, ["About", "/about"]),
            data_stream_1.DataStream.fromJSON(community, ["Posts", "/created"]),
            data_stream_1.DataStream.fromJSON(community, ["Text"]),
            data_stream_1.DataStream.fromJSON(community, ["General", "0"])
        ];
    }
    static load(communityUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!communityUsername.startsWith("hive-"))
                return null;
            var data = yield utils_1.Utils.getCommunityData(communityUsername);
            if (data === null)
                return null;
            if (data.community != null)
                return data.community;
            var community = new Community();
            community.initialize(data);
            data.community = community;
            return community;
        });
    }
}
exports.Community = Community;
Community.MAX_TEXT_STREAMS = 64;

},{"./data-path":15,"./data-stream":16,"./utils":22}],3:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivatePreferences = exports.Preferences = exports.Emote = exports.Quote = exports.Thread = exports.WithReference = exports.Text = exports.GroupInvite = exports.Encoded = exports.Edit = exports.JSONContent = exports.decodeTextWithKeychain = exports.encodeTextWithKeychain = exports.decodedMessage = exports.encodedMessage = exports.preferences = exports.groupInvite = exports.emote = exports.edit = exports.quote = exports.thread = exports.text = exports.fromJSON = exports.type = void 0;
const imports_1 = require("./imports");
Object.defineProperty(exports, "JSONContent", { enumerable: true, get: function () { return imports_1.JSONContent; } });
Object.defineProperty(exports, "Encoded", { enumerable: true, get: function () { return imports_1.Encoded; } });
Object.defineProperty(exports, "GroupInvite", { enumerable: true, get: function () { return imports_1.GroupInvite; } });
Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return imports_1.Text; } });
Object.defineProperty(exports, "WithReference", { enumerable: true, get: function () { return imports_1.WithReference; } });
Object.defineProperty(exports, "Thread", { enumerable: true, get: function () { return imports_1.Thread; } });
Object.defineProperty(exports, "Quote", { enumerable: true, get: function () { return imports_1.Quote; } });
Object.defineProperty(exports, "Edit", { enumerable: true, get: function () { return imports_1.Edit; } });
Object.defineProperty(exports, "Emote", { enumerable: true, get: function () { return imports_1.Emote; } });
Object.defineProperty(exports, "Preferences", { enumerable: true, get: function () { return imports_1.Preferences; } });
Object.defineProperty(exports, "PrivatePreferences", { enumerable: true, get: function () { return imports_1.PrivatePreferences; } });
function type(content) {
    if (Array.isArray(content) && content.length > 0)
        return content[0];
    return null;
}
exports.type = type;
function fromJSON(json) {
    var ty = type(json);
    if (ty === null)
        return null;
    switch (ty) {
        case imports_1.Text.TYPE: return new imports_1.Text(json);
        case imports_1.Thread.TYPE: return new imports_1.Thread(json);
        case imports_1.Quote.TYPE: return new imports_1.Quote(json);
        case imports_1.Edit.TYPE: return new imports_1.Edit(json);
        case imports_1.Emote.TYPE: return new imports_1.Emote(json);
        case imports_1.GroupInvite.TYPE: return new imports_1.GroupInvite(json);
        case imports_1.Preferences.TYPE: return new imports_1.Preferences(json);
        case imports_1.Encoded.TYPE: return new imports_1.Encoded(json);
    }
    return null;
}
exports.fromJSON = fromJSON;
function text(message) {
    return new imports_1.Text([imports_1.Text.TYPE, message]);
}
exports.text = text;
function thread(message, threadName) {
    return new imports_1.Thread([imports_1.Thread.TYPE,
        message, threadName]);
}
exports.thread = thread;
function quote(message, parentMessage, quoteFrom = 0, quoteTo = -1) {
    return new imports_1.Quote([imports_1.Quote.TYPE,
        message,
        parentMessage.getReference(),
        quoteFrom, quoteTo
    ]);
}
exports.quote = quote;
function edit(editedContent, parentMessage) {
    return new imports_1.Edit([imports_1.Edit.TYPE, editedContent == null ? null : editedContent.toJSON(),
        parentMessage.getReference()
    ]);
}
exports.edit = edit;
function emote(emote, parentMessage) {
    return new imports_1.Emote([imports_1.Emote.TYPE, emote,
        parentMessage.getReference()
    ]);
}
exports.emote = emote;
function groupInvite(message, group, key) {
    return new imports_1.GroupInvite([imports_1.GroupInvite.TYPE, message, group, key]);
}
exports.groupInvite = groupInvite;
function preferences(json = {}) {
    return new imports_1.Preferences([imports_1.Preferences.TYPE, json]);
}
exports.preferences = preferences;
function encodedMessage(msg, privateK, publicK) {
    if (typeof privateK !== 'string')
        privateK = privateK.toString();
    var string = JSON.stringify([msg.getUser(), msg.getJSONString(), msg.keytype, msg.getSignature().toString('hex')]);
    var encoded = [imports_1.Encoded.TYPE, 'g', hive.memo.encode(privateK, publicK, "#" + string)];
    return new imports_1.Encoded(encoded);
}
exports.encodedMessage = encodedMessage;
function decodedMessage(msg, privateK) {
    if (typeof privateK !== 'string')
        privateK = privateK.toString();
    var string = hive.memo.decode(privateK, msg.json[2]);
    if (string.startsWith("#"))
        string = string.substring(1);
    return JSON.parse(string);
}
exports.decodedMessage = decodedMessage;
function encodeTextWithKeychain(user, message, keychainKeyType = 'Posting') {
    return __awaiter(this, void 0, void 0, function* () {
        var p = imports_1.Utils.queueKeychain((keychain, resolve, error) => {
            keychain.requestEncodeMessage(user, user, '#' + message, keychainKeyType, (result) => {
                if (result.success)
                    resolve(result.result);
                else
                    error(result);
            });
        });
        return yield p;
    });
}
exports.encodeTextWithKeychain = encodeTextWithKeychain;
function decodeTextWithKeychain(user, message, keychainKeyType = 'Posting') {
    return __awaiter(this, void 0, void 0, function* () {
        var p = imports_1.Utils.queueKeychain((keychain, resolve, error) => {
            keychain.requestVerifyKey(user, message, keychainKeyType, (result) => {
                if (result.success) {
                    var string = result.result;
                    if (string.startsWith("#"))
                        string = string.substring(1);
                    resolve(string);
                }
                else
                    error(result);
            });
        });
        return yield p;
    });
}
exports.decodeTextWithKeychain = decodeTextWithKeychain;

},{"./imports":8}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Edit = void 0;
const imports_1 = require("./imports");
class Edit extends imports_1.WithReference {
    constructor(json) { super(json); }
    getEdit() { return this.json[1]; }
    setEdit(json) { this.json[1] = json; }
}
exports.Edit = Edit;
Edit.TYPE = "d";

},{"./imports":8}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emote = void 0;
const imports_1 = require("./imports");
class Emote extends imports_1.WithReference {
    constructor(json) { super(json); }
}
exports.Emote = Emote;
Emote.TYPE = "e";

},{"./imports":8}],6:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encoded = void 0;
const imports_1 = require("./imports");
class Encoded extends imports_1.JSONContent {
    constructor(json) { super(json); }
    isEncodedWithMemo() { return this.json[1] === "m"; }
    isEncodedWithPosting() { return this.json[1] === "p"; }
    isEncodedWithGroup() { return this.json[1] === "g"; }
    decodeWithKey(user, groupUsers, privateK) {
        groupUsers.sort();
        var messageIndex = groupUsers.indexOf(user);
        if (messageIndex === -1)
            return null;
        var text = this.json[messageIndex + 2];
        var string = hive.memo.decode(privateK, text);
        if (string.startsWith("#"))
            string = string.substring(1);
        return imports_1.Content.fromJSON(JSON.parse(string));
    }
    decodeWithKeychain(user, groupUsers) {
        return __awaiter(this, void 0, void 0, function* () {
            groupUsers.sort();
            var keyType = this.json[1];
            var keychainKeyType = keyType === "p" ? "Posting"
                : (keyType === "m" ? "Memo" : null);
            if (keychainKeyType === null)
                return null;
            var messageIndex = groupUsers.indexOf(user);
            if (messageIndex === -1)
                return null;
            var text = this.json[messageIndex + 2];
            if (text === null)
                text = this.json[messageIndex === 0 ? 3 : 2];
            var p = imports_1.Utils.queueKeychain((keychain, resolve, error) => {
                keychain.requestVerifyKey(user, text, keychainKeyType, (result) => {
                    if (result.success) {
                        var string = result.result;
                        if (string.startsWith("#"))
                            string = string.substring(1);
                        resolve(string);
                    }
                    else
                        error(result);
                });
            });
            var json = yield p;
            return imports_1.Content.fromJSON(JSON.parse(json));
        });
    }
}
exports.Encoded = Encoded;
Encoded.TYPE = "x";

},{"./imports":8}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupInvite = void 0;
const imports_1 = require("./imports");
class GroupInvite extends imports_1.Text {
    constructor(json) { super(json); }
    getGroup() { return this.json[2]; }
    setGroup(text) { this.json[2] = text; }
    getKey() { return this.json[3]; }
    setKey(text) { this.json[3] = text; }
}
exports.GroupInvite = GroupInvite;
GroupInvite.TYPE = "g";

},{"./imports":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = exports.PrivatePreferences = exports.Preferences = exports.Emote = exports.Edit = exports.Quote = exports.Thread = exports.WithReference = exports.Text = exports.GroupInvite = exports.Encoded = exports.JSONContent = exports.Content = exports.SignableMessage = void 0;
const signable_message_1 = require("../signable-message");
Object.defineProperty(exports, "SignableMessage", { enumerable: true, get: function () { return signable_message_1.SignableMessage; } });
const utils_1 = require("../utils");
Object.defineProperty(exports, "Utils", { enumerable: true, get: function () { return utils_1.Utils; } });
const Content = require("./content");
exports.Content = Content;
const jsoncontent_1 = require("./jsoncontent");
Object.defineProperty(exports, "JSONContent", { enumerable: true, get: function () { return jsoncontent_1.JSONContent; } });
const encoded_1 = require("./encoded");
Object.defineProperty(exports, "Encoded", { enumerable: true, get: function () { return encoded_1.Encoded; } });
const text_1 = require("./text");
Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return text_1.Text; } });
const group_invite_1 = require("./group-invite");
Object.defineProperty(exports, "GroupInvite", { enumerable: true, get: function () { return group_invite_1.GroupInvite; } });
const with_reference_1 = require("./with-reference");
Object.defineProperty(exports, "WithReference", { enumerable: true, get: function () { return with_reference_1.WithReference; } });
const thread_1 = require("./thread");
Object.defineProperty(exports, "Thread", { enumerable: true, get: function () { return thread_1.Thread; } });
const quote_1 = require("./quote");
Object.defineProperty(exports, "Quote", { enumerable: true, get: function () { return quote_1.Quote; } });
const edit_1 = require("./edit");
Object.defineProperty(exports, "Edit", { enumerable: true, get: function () { return edit_1.Edit; } });
const emote_1 = require("./emote");
Object.defineProperty(exports, "Emote", { enumerable: true, get: function () { return emote_1.Emote; } });
const preferences_1 = require("./preferences");
Object.defineProperty(exports, "Preferences", { enumerable: true, get: function () { return preferences_1.Preferences; } });
Object.defineProperty(exports, "PrivatePreferences", { enumerable: true, get: function () { return preferences_1.PrivatePreferences; } });

},{"../signable-message":20,"../utils":22,"./content":3,"./edit":4,"./emote":5,"./encoded":6,"./group-invite":7,"./jsoncontent":9,"./preferences":10,"./quote":11,"./text":12,"./thread":13,"./with-reference":14}],9:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONContent = void 0;
const imports_1 = require("./imports");
class JSONContent {
    constructor(json) {
        this.json = json;
    }
    getType() { return this.json[0]; }
    toJSON() { return this.json; }
    copy() { return new this.constructor(JSON.parse(JSON.stringify(this.json))); }
    encodeWithKey(user, groupUsers, keytype, privateK, publicK) {
        groupUsers.sort();
        var string = JSON.stringify(this.json);
        var encoded = [imports_1.Encoded.TYPE, keytype.toLowerCase().charAt(0)];
        for (var groupUser of groupUsers) {
            if (user === groupUser) {
                encoded.push(null);
                continue;
            }
            encoded.push(hive.memo.encode(privateK, publicK, "#" + string));
        }
        return new imports_1.Encoded(encoded);
    }
    encodeWithKeychain(user, groupUsers, keychainKeyType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this instanceof imports_1.Encoded)
                return this;
            var string = JSON.stringify(this.json);
            groupUsers.sort();
            var encoded = [imports_1.Encoded.TYPE, keychainKeyType.toLowerCase().charAt(0)];
            for (var groupUser of groupUsers) {
                if (groupUsers.length > 1 && user === groupUser) {
                    encoded.push(null);
                    continue;
                }
                var p = imports_1.Utils.queueKeychain((keychain, resolve, error) => {
                    keychain.requestEncodeMessage(user, groupUser, "#" + string, keychainKeyType, (result) => {
                        if (result.success) {
                            resolve(result.result);
                        }
                        else
                            error(result);
                    });
                });
                encoded.push(yield p);
            }
            if (encoded.length === 2)
                return null;
            return new imports_1.Encoded(encoded);
        });
    }
    forUser(user, conversation) {
        return imports_1.SignableMessage.create(user, conversation, this.json);
    }
    isEqual(content) {
        var js0 = this.json;
        var js1 = content.json;
        if (js0.length !== js1.length)
            return false;
        for (var i = 0; i < js0.length; i++)
            if (js0[i] !== js1[i])
                return false;
        return true;
    }
}
exports.JSONContent = JSONContent;

},{"./imports":8}],10:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Preferences = exports.PrivatePreferences = void 0;
const imports_1 = require("./imports");
class PrivatePreferences {
    constructor(json) {
        this.updated = false;
        this.json = json;
    }
    keys() {
        var json = this.json;
        var keys = json.keys;
        if (keys === undefined)
            json.keys = keys = {};
        return keys;
    }
    setKeyFor(group, key) {
        var keys = this.keys();
        keys[group] = key;
        this.updated = true;
    }
    getKeyFor(group) {
        var keys = this.keys();
        var key = keys[group];
        return key == null ? null : key;
    }
}
exports.PrivatePreferences = PrivatePreferences;
class Preferences extends imports_1.JSONContent {
    constructor(json) {
        super(json);
        this.privatePreferences = null;
    }
    getPreferencesJSON() { return this.json[1]; }
    /*setPreferencesJSON(json: any): void { this.json[1] = json; }*/
    getValueBoolean(name, def = false) {
        var value = this.getValues()[name + ":b"];
        return (value === undefined) ? def : value;
    }
    setValue(nameColonType, value = null) {
        var values = this.getValues();
        if (value == null)
            delete values[nameColonType];
        else
            values[nameColonType] = value;
    }
    newGroup(publicKey) {
        var groupId = this.findFreeGroupId();
        if (groupId === -1)
            throw "maximum limit of " + Preferences.MAX_USER_GROUPS + " groups reached";
        this.setGroup(groupId, publicKey);
        return groupId;
    }
    setGroup(groupId, publicKey) {
        if (!(groupId >= 0 && groupId < Preferences.MAX_USER_GROUPS))
            throw "out of bounds";
        var json = this.getPreferencesJSON();
        var groups = json.groups;
        if (publicKey == null) {
            delete groups[groupId];
            return null;
        }
        else {
            groups[groupId] = { "key": publicKey };
            return groups[groupId];
        }
    }
    getGroup(groupId) {
        var groups = this.getGroups();
        var group = groups[groupId];
        return group == null ? null : group;
    }
    getValues() { return this.getValueSet('values'); }
    getGroups() { return this.getValueSet('groups'); }
    getValueSet(name) {
        var json = this.getPreferencesJSON();
        var set = json[name];
        if (set === undefined)
            json[name] = set = {};
        return set;
    }
    findFreeGroupId() {
        var groups = this.getGroups();
        for (var i = 0; i < Preferences.MAX_USER_GROUPS; i++)
            if (groups[i] === undefined)
                return i;
        return -1;
    }
    getPrivatePreferencesWithKeychain(user, keychainKeyType = 'Posting') {
        return __awaiter(this, void 0, void 0, function* () {
            var pref = this.privatePreferences;
            if (pref !== null)
                return pref;
            var json = this.getPreferencesJSON();
            var message = json['#'];
            if (message !== undefined && typeof message === 'string') {
                var result = yield imports_1.Content.decodeTextWithKeychain(user, message, keychainKeyType);
                this.privatePreferences = new PrivatePreferences(JSON.parse(result));
            }
            else
                this.privatePreferences = new PrivatePreferences({});
            return this.privatePreferences;
        });
    }
    encodePrivatePreferencsWithKeychan(user, keychainKeyType = 'Posting', onlyIfUpdated = true) {
        return __awaiter(this, void 0, void 0, function* () {
            var pref = this.privatePreferences;
            if (pref == null || (onlyIfUpdated && !pref.updated))
                return;
            var p = imports_1.Utils.queueKeychain((keychain, resolve, error) => {
                keychain.requestEncodeMessage(user, user, '#' + JSON.stringify(pref.json), keychainKeyType, (result) => {
                    if (result.success)
                        resolve(result.result);
                    else
                        error(result);
                });
            });
            var text = yield p;
            var json = this.getPreferencesJSON();
            json['#'] = text;
            pref.updated = false;
        });
    }
    forUser(user, conversation = '@') {
        if (conversation !== '@')
            throw "conversation is not '@'";
        var pref = this.privatePreferences;
        if (pref != null && pref.updated)
            throw "private preference changes have not been encoded";
        return imports_1.SignableMessage.create(user, conversation, this.json);
    }
}
exports.Preferences = Preferences;
Preferences.TYPE = "p";
Preferences.MAX_USER_GROUPS = 64;

},{"./imports":8}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quote = void 0;
const imports_1 = require("./imports");
class Quote extends imports_1.WithReference {
    constructor(json) { super(json); }
    getFrom() { return this.json[3]; }
    getTo() { return this.json[4]; }
    setFromTo(from, to) {
        this.json[3] = from;
        this.json[4] = to;
    }
}
exports.Quote = Quote;
Quote.TYPE = "q";

},{"./imports":8}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
const imports_1 = require("./imports");
class Text extends imports_1.JSONContent {
    constructor(json) { super(json); }
    getText() { return this.json[1]; }
    setText(text) { this.json[1] = text; }
}
exports.Text = Text;
Text.TYPE = "t";

},{"./imports":8}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thread = void 0;
const imports_1 = require("./imports");
class Thread extends imports_1.WithReference {
    constructor(json) { super(json); }
}
exports.Thread = Thread;
Thread.TYPE = "h";

},{"./imports":8}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithReference = void 0;
const imports_1 = require("./imports");
class WithReference extends imports_1.JSONContent {
    constructor(json) { super(json); }
    getText() { return this.json[1]; }
    setText(text) { this.json[1] = text; }
    getReference() { return this.json[2]; }
    setReference(ref) { this.json[2] = ref; }
}
exports.WithReference = WithReference;

},{"./imports":8}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPath = void 0;
const utils_1 = require("./utils");
/*
    Represents data path in the following format '<type>:<path>'
    For example text channel number 1 in community hive-1111111, can
    be written as TYPE_TEXT+':hive-1111111/1'

    The following compact form is abstracted by the implementation.
    As text channels will be most common, and community is known, they
    can be represented in the shortened form '1'
    Community information such as about section, can be represented with
    TYPE_INFO+':hive-1111111/about' and in short form '/about'
*/
class DataPath {
    constructor(type, community, path) {
        this.type = type;
        this.user = community;
        this.path = path;
    }
    getType() { return this.type; }
    getUser() { return this.user; }
    getPath() { return this.path; }
    /* compact form representation */
    static fromString(text, community) {
        if (text === null || text.length === 0)
            return null;
        if (utils_1.Utils.isWholeNumber(text))
            return new DataPath(DataPath.TYPE_TEXT, community, text);
        var typeI = text.indexOf(':');
        var type = null;
        if (typeI !== -1) {
            type = text.substring(0, typeI);
            text = text.substring(typeI + 1);
        }
        var slash = text.indexOf('/');
        if (slash === 0)
            return new DataPath(DataPath.TYPE_INFO, community, text.substring(1));
        if (text.startsWith("hive-") && slash !== -1) {
            community = text.substring(0, slash);
            text = text.substring(slash + 1);
            if (utils_1.Utils.isWholeNumber(text))
                type = DataPath.TYPE_TEXT;
        }
        return new DataPath((type === null) ? DataPath.TYPE_INFO : type, community, text);
    }
    toString(community) {
        if (this.user === community) {
            if (this.type === DataPath.TYPE_TEXT && utils_1.Utils.isWholeNumber(this.path))
                return this.path;
            if (this.type === DataPath.TYPE_INFO)
                return '/' + this.path;
            return this.type + ':/' + this.path;
        }
        if (this.type === DataPath.TYPE_INFO)
            return this.user + '/' + this.path;
        return this.type + ':' + this.user + '/' + this.path;
    }
}
exports.DataPath = DataPath;
DataPath.TYPE_INFO = "i";
DataPath.TYPE_TEXT = "t";

},{"./utils":22}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataStream = void 0;
const permission_set_1 = require("./permission-set");
const data_path_1 = require("./data-path");
class DataStream {
    constructor(community) {
        this.community = community;
    }
    hasPath() { return this.dataPath != null; }
    getPath() { return this.dataPath; }
    getPathType() {
        if (this.hasPath())
            return this.getPath().getType();
        return null;
    }
    getName() { return this.name; }
    getReadPermissions() { return this.readSet; }
    getWritePermissions() { return this.writeSet; }
    getCompactPath() {
        if (this.dataPath === null)
            return null;
        return this.dataPath.toString(this.community);
    }
    toJSON() {
        var json = [this.getName()];
        var dataPath = this.getCompactPath();
        if (dataPath === null)
            return json;
        json.push(dataPath);
        json.push(this.readSet.toJSON());
        json.push(this.writeSet.toJSON());
        return json;
    }
    static fromJSON(community, jsonArray) {
        var path = jsonArray[1] || null;
        var dataStream = new DataStream(community);
        dataStream.name = jsonArray[0];
        dataStream.dataPath = (path === null) ? null : data_path_1.DataPath.fromString(path, community);
        dataStream.readSet = permission_set_1.PermissionSet.fromJSON(jsonArray[2] || null);
        dataStream.writeSet = permission_set_1.PermissionSet.fromJSON(jsonArray[3] || null);
        return dataStream;
    }
}
exports.DataStream = DataStream;

},{"./data-path":15,"./permission-set":19}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayableEmote = exports.DisplayableMessage = void 0;
const imports_1 = require("./content/imports");
class DisplayableMessage {
    constructor(message) {
        this.reference = null;
        this.edits = null;
        this.emotes = null;
        this.editContent = null;
        this.isEdit = false;
        this.message = message;
        this.content = undefined;
        this.verified = null;
    }
    init() {
        this.usernames = this.message.getGroupUsernames();
    }
    getEmoteIndex(emote) {
        if (this.emotes === null)
            return -1;
        for (var i = 0; i < this.emotes.length; i++)
            if (this.emotes[i].emote === emote)
                return i;
        return -1;
    }
    emote(msg) {
        var content = msg.content;
        if (!(content instanceof imports_1.Emote))
            return;
        if (this.emotes === null)
            this.emotes = [];
        var timestamp = msg.getTimestamp();
        var emote = content.getText();
        var emoteIndex = this.getEmoteIndex(emote);
        var obj;
        if (emoteIndex === -1) {
            obj = new DisplayableEmote(emote, timestamp);
            this.emotes.push(obj);
        }
        else
            obj = this.emotes[emoteIndex];
        obj.add(msg);
        this.emotes.sort((a, b) => b.timestamp - a.timestamp);
    }
    isEmote() {
        return this.content instanceof imports_1.Emote;
    }
    edit(msg) {
        if (this.edits === null)
            this.edits = [msg];
        else {
            this.edits.push(msg);
            this.edits.sort((a, b) => b.getTimestamp() - a.getTimestamp());
        }
    }
    hasUser(user) { return this.usernames.indexOf(user) !== -1; }
    getUser() { return this.message.user; }
    getConversation() { return this.message.conversation; }
    getTimestamp() { return this.message.timestamp; }
    getCommunity() {
        var conversation = this.getConversation();
        if (conversation && conversation.startsWith("hive-")) {
            var i = conversation.indexOf('/');
            return i === -1 ? conversation : conversation.substring(0, i);
        }
        return null;
    }
    isEncoded() {
        return this.content instanceof imports_1.Encoded;
    }
    getContent() {
        var edits = this.edits;
        if (edits !== null && edits.length > 0)
            return edits[0].editContent;
        return this.content;
    }
    isVerified() {
        var edits = this.edits;
        if (edits !== null && edits.length > 0)
            return edits[0].verified;
        return this.verified;
    }
}
exports.DisplayableMessage = DisplayableMessage;
class DisplayableEmote {
    constructor(emote, timestamp) {
        this.users = [];
        this.messages = [];
        this.emote = emote;
        this.timestamp = timestamp;
    }
    add(msg) {
        var user = msg.getUser();
        if (this.users.indexOf(user) === -1)
            this.users.push(user);
        this.messages.push(msg);
        this.timestamp = Math.min(this.timestamp, msg.getTimestamp());
    }
}
exports.DisplayableEmote = DisplayableEmote;

},{"./content/imports":8}],18:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageManager = exports.LoginWithKeychain = exports.LoginMethod = void 0;
const client_1 = require("./client");
const utils_1 = require("./utils");
const signable_message_1 = require("./signable-message");
const displayable_message_1 = require("./displayable-message");
const imports_1 = require("./content/imports");
class LoginMethod {
}
exports.LoginMethod = LoginMethod;
class LoginWithKeychain extends LoginMethod {
}
exports.LoginWithKeychain = LoginWithKeychain;
class MessageManager {
    constructor() {
        this.userPreferences = null;
        this.joined = {};
        this.cachedUserMessages = null;
        this.recentlySentEncodedContent = [];
        this.selectedCommunityPage = {};
        this.selectedConversation = null;
        this.conversations = new utils_1.AccountDataCache();
        this.communities = new utils_1.AccountDataCache();
        this.keys = {};
        this.keychainPromise = null;
        this.pauseAutoDecode = false;
        this.defaultReadHistoryMS = 30 * 24 * 60 * 60000;
    }
    setNodes(nodes) {
        for (var i = 0; i < nodes.length; i++)
            nodes[i] = nodes[i].replace(/^http/, 'ws');
        this.nodes = nodes;
        this.connectionStart = true;
        this.nodeIndex = 0;
        this.connect();
    }
    connect() {
        var _this = this;
        //navigator.onLine 
        if (this.nodeIndex >= this.nodes.length) {
            if (this.connectionStart) {
                console.log("count not connect to any node");
                return;
            }
            else
                this.nodeIndex = 0;
        }
        try {
            let socket = io(this.nodes[this.nodeIndex], {
                transports: ["websocket", "polling"]
            });
            socket.on("connect_error", (err) => {
                console.log(`connect_error ${err.message}`);
                socket.disconnect();
                this.nodeIndex = this.nodeIndex + 1;
                this.connect();
            });
            socket.on('disconnect', function () {
                console.log("disconnected ");
            });
            this.client = new client_1.Client(socket);
            this.client.onmessage = function (json) {
                return __awaiter(this, void 0, void 0, function* () {
                    var onmessage = _this.onmessage;
                    var displayableMessage = yield _this.jsonToDisplayable(json);
                    var data = _this.conversations.lookupValue(displayableMessage.getConversation());
                    if (data != null) {
                        if (data.encoded != null && displayableMessage.isEncoded()) {
                            var prefs = yield _this.getPreferences();
                            if (!_this.pauseAutoDecode && prefs.getValueBoolean("autoDecode", false) === true) {
                                try {
                                    var decodedMessage = yield _this.decode(displayableMessage);
                                    data.messages.push(decodedMessage);
                                    _this.resolveReference(data.messages, decodedMessage);
                                }
                                catch (e) {
                                    data.encoded.push(displayableMessage);
                                    console.log(e);
                                    if (e.success !== undefined && e.success === false) {
                                        if (e.error === "user_cancel")
                                            return;
                                    }
                                }
                            }
                            else
                                data.encoded.push(displayableMessage);
                        }
                        else {
                            data.messages.push(displayableMessage);
                            _this.resolveReference(data.messages, displayableMessage);
                        }
                    }
                    if (onmessage != null)
                        onmessage(displayableMessage);
                });
            };
            utils_1.Utils.setClient(this.client);
            this.connectionStart = false;
            console.log("connected to " + this.nodes[this.nodeIndex]);
            return;
        }
        catch (e) {
            console.log("connect error");
            console.log(e);
        }
    }
    getClient() { return this.client; }
    setUser(user) {
        if (this.user == user)
            return;
        if (this.user != null) {
            this.userPreferences = null;
        }
        this.user = user;
        this.join(user);
    }
    getPreferences() {
        return __awaiter(this, void 0, void 0, function* () {
            var p = this.userPreferences;
            if (p != null)
                return p;
            if (this.user == null)
                return null;
            p = yield utils_1.Utils.getAccountPreferences(this.user);
            if (p === null)
                p = imports_1.Content.preferences();
            this.userPreferences = p;
            return p;
        });
    }
    getPrivatePreferences() {
        return __awaiter(this, void 0, void 0, function* () {
            var p = yield this.getPreferences();
            if (this.keychainPromise != null)
                yield this.keychainPromise;
            var promise = p.getPrivatePreferencesWithKeychain(this.user);
            this.keychainPromise = promise;
            return yield promise;
        });
    }
    storeKeyLocallyEncryptedWithKeychain(group, key) {
        return __awaiter(this, void 0, void 0, function* () {
            var encodedText = yield imports_1.Content.encodeTextWithKeychain(this.user, key, 'Posting');
            window.localStorage.setItem(this.user + "|" + group, encodedText);
            var keys = this.keys;
            keys[group] = key;
        });
    }
    getKeyFor(group) {
        return __awaiter(this, void 0, void 0, function* () {
            var keys = this.keys;
            if (keys[group] != null)
                return keys[group];
            var pref = yield this.getPrivatePreferences();
            var key = pref.getKeyFor(group);
            if (key === null) {
                var text = window.localStorage.getItem(this.user + "|" + group);
                if (text != null) {
                    keys[group] = key = yield imports_1.Content.decodeTextWithKeychain(this.user, text);
                }
            }
            return key;
        });
    }
    updatePreferences(preferences) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.user == null)
                return null;
            yield preferences.encodePrivatePreferencsWithKeychan(this.user);
            var signableMessage = preferences.forUser(this.user);
            yield signableMessage.signWithKeychain('Posting');
            var client = this.getClient();
            return yield client.write(signableMessage);
        });
    }
    join(room) {
        if (room == null)
            return;
        if (room.indexOf('|') != -1)
            return;
        if (this.joined[room])
            return;
        this.joined[room] = true;
        var client = this.getClient();
        client.join(room);
    }
    setUseKeychain() { this.loginmethod = new LoginWithKeychain(); }
    getSelectedCommunityPage(community, defaultPage = null) {
        var page = this.selectedCommunityPage[community];
        return page == null ? defaultPage : page;
    }
    setSelectedCommunityPage(community, page) {
        this.selectedCommunityPage[community] = page;
    }
    setConversation(username) {
        this.selectedConversation = username;
        this.join(username);
    }
    getCommunities(user = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user === null)
                user = this.user;
            if (user == null)
                return null;
            var _this = this;
            return yield this.communities.cacheLogic(user, (user) => {
                return hive.api.callAsync("bridge.list_all_subscriptions", { "account": user }).
                    then((array) => __awaiter(this, void 0, void 0, function* () {
                    var communityNames = [];
                    for (var community of array)
                        communityNames.push(community[0]);
                    if (communityNames.length > 0) {
                        yield utils_1.Utils.preloadAccountData(communityNames);
                        for (var community of array)
                            community.account = yield utils_1.Utils.getAccountData(community[0]);
                    }
                    return array;
                }));
            });
        });
    }
    getSelectedConversations() {
        return __awaiter(this, void 0, void 0, function* () {
            var conversation = this.selectedConversation;
            if (conversation == null)
                return null;
            var isPrivate = conversation.indexOf('|') !== -1;
            var _this = this;
            return yield this.conversations.cacheLogic(conversation, (conversation) => {
                var client = _this.getClient();
                var timeNow = utils_1.Utils.utcTime();
                var promise = null;
                if (isPrivate) {
                    if (this.cachedUserMessages == null) {
                        promise = _this.readUserMessages().then((result) => {
                            this.cachedUserMessages = result;
                            return result;
                        });
                    }
                    else
                        promise = Promise.resolve(this.cachedUserMessages);
                    promise = promise.then((allMessages) => {
                        var messages0 = allMessages.filter((m) => m.getConversation() === conversation);
                        var messages = messages0.filter((m) => !m.isEncoded());
                        var encoded = messages0.filter((m) => m.isEncoded());
                        return { messages, encoded };
                    });
                }
                else {
                    promise = client.read(conversation, timeNow - _this.defaultReadHistoryMS, timeNow + 600000).then((result) => {
                        if (!result.isSuccess())
                            throw result.getError();
                        return _this.toDisplayable(result);
                    }).then((messages) => {
                        _this.resolveReferences(messages);
                        return { messages };
                    });
                }
                return promise;
            });
        });
    }
    readUserConversations() {
        return __awaiter(this, void 0, void 0, function* () {
            var user = this.user;
            if (user === null)
                return [];
            var client = this.getClient();
            var result = yield client.readUserConversations(user);
            if (!result.isSuccess())
                throw result.getError();
            return result.getResult();
        });
    }
    readUserMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            var user = this.user;
            if (user === null)
                return [];
            var client = this.getClient();
            var timeNow = utils_1.Utils.utcTime();
            var result = yield client.readUserMessages(user, timeNow - this.defaultReadHistoryMS, timeNow + 600000);
            if (!result.isSuccess())
                throw result.getError();
            var messages = yield this.toDisplayable(result);
            this.resolveReferences(messages);
            return messages;
        });
    }
    sendMessage(msg, conversation, keychainKeyType = 'Posting') {
        return __awaiter(this, void 0, void 0, function* () {
            var user = this.user;
            if (user === null)
                return null;
            var client = this.getClient();
            var encodeKey = null;
            if (typeof conversation === 'string' && conversation.indexOf('|') !== -1)
                conversation = conversation.split('|');
            if (Array.isArray(conversation)) { //Private message
                var encoded = yield msg.encodeWithKeychain(user, conversation, keychainKeyType);
                this.recentlySentEncodedContent.push([encoded, msg]);
                msg = encoded;
            }
            else if (conversation.startsWith('#')) { //Group Message
                encodeKey = yield this.getKeyFor(conversation);
                if (encodeKey === null) {
                    console.log("unknown key"); //TODO ask to enter key
                    return;
                }
            }
            var signableMessage = msg.forUser(user, conversation);
            yield signableMessage.signWithKeychain(keychainKeyType);
            if (encodeKey !== null)
                signableMessage.encodeWithKey(encodeKey);
            return yield client.write(signableMessage);
        });
    }
    resolveReferences(messages) {
        for (var msg of messages)
            this.resolveReference(messages, msg);
    }
    resolveReference(messages, msg) {
        try {
            var content = msg.content;
            if (content instanceof imports_1.WithReference) {
                var ref = content.getReference().split('|');
                var user = ref[0];
                var time = Number(ref[1]);
                for (var m of messages) {
                    if (m.getUser() == user && m.getTimestamp() == time) {
                        if (content instanceof imports_1.Edit) {
                            if (msg.getUser() == user)
                                m.edit(msg);
                        }
                        else if (content instanceof imports_1.Emote) {
                            m.emote(msg);
                        }
                        else
                            msg.reference = m;
                        return;
                    }
                }
                console.log("did not find reference ", content.getReference());
            }
        }
        catch (e) {
            console.log("error resolving reference ", msg, e);
        }
    }
    toDisplayable(result) {
        return __awaiter(this, void 0, void 0, function* () {
            var list = [];
            var array = result.getResult();
            for (var msgJSON of array) {
                try {
                    list.push(yield this.jsonToDisplayable(msgJSON));
                }
                catch (e) {
                    console.log("Error reading message: ", msgJSON);
                    console.log(e);
                }
            }
            return list;
        });
    }
    popRecentlySentEncodedContent(encoded) {
        var arr = this.recentlySentEncodedContent;
        for (var i = arr.length - 1; i >= 0; i--) {
            if (encoded.isEqual(arr[i][0])) {
                var decoded = arr[i][1];
                arr.splice(i, 1);
                return decoded;
            }
        }
        return null;
    }
    jsonToDisplayable(msgJSON) {
        return __awaiter(this, void 0, void 0, function* () {
            var msg = signable_message_1.SignableMessage.fromJSON(msgJSON);
            if (msg.isSignedWithGroupKey()) {
                var key = yield this.getKeyFor(msg.getConversation());
                if (key === null)
                    throw 'key not found';
                msg.decodeWithKey(key);
            }
            var verified = yield msg.verify();
            var content = msg.getContent();
            if (content instanceof imports_1.Encoded) {
                var decoded = this.popRecentlySentEncodedContent(content);
                if (decoded !== null)
                    content = decoded;
                /*var decoded = await content.decodeWithKeychain(this.user, msg.getGroupUsernames());
                content = decoded;*/
            }
            var displayableMessage = new displayable_message_1.DisplayableMessage(msg);
            if (content instanceof imports_1.Edit) {
                var editContent = content.getEdit();
                displayableMessage.editContent = (editContent == null) ? null : imports_1.Content.fromJSON(editContent);
                displayableMessage.isEdit = true;
            }
            displayableMessage.content = content;
            displayableMessage.verified = verified;
            displayableMessage.init();
            return displayableMessage;
        });
    }
    decodeSelectedConversations() {
        return __awaiter(this, void 0, void 0, function* () {
            var data = yield this.getSelectedConversations();
            if (data && data.encoded && data.encoded.length > 0) {
                var onmessage = this.onmessage;
                var encodedArray = data.encoded;
                var toAdd = [];
                try {
                    while (encodedArray.length > 0) {
                        var encodedMessage = encodedArray.shift();
                        try {
                            var decodedMessage = yield this.decode(encodedMessage);
                            data.messages.push(decodedMessage);
                            this.resolveReference(data.messages, decodedMessage);
                            if (onmessage != null)
                                onmessage(decodedMessage);
                        }
                        catch (e) {
                            toAdd.push(encodedMessage);
                            console.log(e);
                            if (e.success !== undefined && e.success === false) {
                                if (e.error === "user_cancel")
                                    return;
                            }
                        }
                    }
                }
                finally {
                    encodedArray.push.apply(encodedArray, toAdd);
                    if (onmessage != null)
                        onmessage(decodedMessage);
                }
            }
        });
    }
    decode(displayableMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            var msg = displayableMessage.message;
            var content = displayableMessage.content;
            if (content instanceof imports_1.Encoded) {
                var decoded = yield content.decodeWithKeychain(this.user, msg.getGroupUsernames());
                content = decoded;
            }
            displayableMessage.content = content;
            displayableMessage.init();
            return displayableMessage;
        });
    }
}
exports.MessageManager = MessageManager;

},{"./client":1,"./content/imports":8,"./displayable-message":17,"./signable-message":20,"./utils":22}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionSet = void 0;
class PermissionSet {
    constructor() {
        this.role = "";
        this.titles = [];
    }
    hasTitle(title) {
        return this.titles.indexOf(title) != -1;
    }
    setRole(role) { this.role = role; }
    addTitle(title) {
        if (this.hasTitle(title))
            return;
        this.titles.push(title);
    }
    delTitle(title) {
        var i = this.titles.indexOf(title);
        if (i !== -1)
            this.titles.splice(i, 1);
        return i !== -1;
    }
    getHiveRole() {
        if (this.role == "" || this.role == "onboard" || this.role == "joined")
            return "";
        return this.role;
    }
    getStreamRole() {
        return this.role || "";
    }
    toJSON() {
        var role = this.getStreamRole();
        var titles = this.titles;
        if ((role === "") && titles.length === 0)
            return null;
        return [role, ...titles];
    }
    static fromJSON(json) {
        var set = new PermissionSet();
        if (json !== null && json.length > 0) {
            set.setRole(json[0]);
            for (var i = 1; i < json.length; i++)
                set.addTitle(json[i]);
        }
        return set;
    }
}
exports.PermissionSet = PermissionSet;

},{}],20:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignableMessage = void 0;
const imports_1 = require("./content/imports");
const utils_1 = require("./utils");
class SignableMessage {
    constructor() {
        this.type = "w";
    }
    static create(user, conversation, json) {
        var s = new SignableMessage();
        s.setUser(user);
        s.setConversation(conversation);
        s.setJSON(json);
        return s;
    }
    setUser(user) { this.user = user; }
    setConversation(a) {
        if (Array.isArray(a))
            this.setConversationGroup(a);
        else
            this.conversation = a;
    }
    setConversationGroup(usernames) {
        if (!(usernames.length > 1 && usernames.length <= 4))
            throw "Group Conversation requires [2-4] users.";
        usernames.sort();
        this.conversation = usernames.join('|');
    }
    setJSON(js) {
        js = (js.toJSON !== undefined) ? js.toJSON() : js;
        this.json = (typeof js === 'string') ? js : JSON.stringify(js);
    }
    getMessageType() { return this.type; }
    getUser() { return this.user; }
    getConversation() { return this.conversation; }
    getJSONString() { return this.json; }
    getContent() { return imports_1.Content.fromJSON(JSON.parse(this.json)); }
    getTimestamp() { return this.timestamp; }
    getGroupUsernames() { return this.conversation.split('|'); }
    isGroupConversation() { return this.conversation.indexOf('|') !== -1; }
    isEncrypted() { return this.conversation.startsWith("#"); }
    isPreference() { return this.conversation === "@"; }
    isSigned() { return this.signature != null; }
    isSignedWithMemo() { return this.keytype === "m"; }
    isSignedWithPosting() { return this.keytype === "p"; }
    isSignedWithGroupKey() { return this.keytype === "g"; }
    getSignature() { return this.signature; }
    getReference() {
        return this.getUser() + "|" + this.getTimestamp();
    }
    validateDataLength() {
        //TODO 
    }
    toSignableTextFormat() {
        var signableTextFormat = JSON.stringify(this.type) +
            ',' + JSON.stringify(this.user) + ',' + JSON.stringify(this.conversation) +
            ',' + JSON.stringify(this.json) + ',' + JSON.stringify(this.timestamp);
        return signableTextFormat;
    }
    toSignableHash() {
        return dhive.cryptoUtils.sha256(this.toSignableTextFormat());
    }
    toArray() {
        return [
            this.type, this.user, this.conversation, this.json,
            this.timestamp, this.keytype, this.signature.toString('hex')
        ];
    }
    toJSON() {
        return JSON.stringify(this.toArray());
    }
    static fromJSON(json) {
        var array = (typeof json === 'string') ? JSON.parse(json) : json;
        var message = new SignableMessage();
        message.type = array[0];
        message.setUser(array[1]);
        message.setConversation(array[2]);
        message.setJSON(array[3]);
        message.timestamp = array[4];
        message.keytype = array[5];
        message.signature = Buffer.from(array[6], 'hex');
        return message;
    }
    encodeWithKey(privateK, publicK = null) {
        if (!this.isSigned())
            throw 'message is not signed';
        if (!this.isEncrypted())
            throw 'message conversation does not start with #';
        var conversation = this.getConversation();
        var i = conversation.indexOf('/');
        if (i === -1)
            throw 'message conversation is not valid';
        var groupOwner = conversation.substring(1, i);
        if (publicK == null)
            publicK = utils_1.Utils.randomPublicKey();
        var encoded = imports_1.Content.encodedMessage(this, privateK, publicK);
        if (typeof privateK === 'string')
            privateK = dhive.PrivateKey.fromString(privateK);
        this.setUser(groupOwner);
        this.setJSON(encoded);
        var messageHash = this.toSignableHash();
        this.keytype = 'g';
        this.signature = privateK.sign(messageHash).toBuffer();
        return this;
    }
    decodeWithKey(privateK) {
        if (!this.isSignedWithGroupKey())
            return this;
        var encoded = this.getContent();
        if (!(encoded instanceof imports_1.Encoded))
            return this;
        if (!encoded.isEncodedWithGroup())
            return this;
        var msg = imports_1.Content.decodedMessage(encoded, privateK);
        this.setUser(msg[0]);
        this.setJSON(msg[1]);
        this.keytype = msg[2];
        this.signature = Buffer.from(msg[3], 'hex');
        return this;
    }
    signWithKey(privateK, keytype) {
        var _this = this;
        this.timestamp = utils_1.Utils.utcTime();
        this.validateDataLength();
        var keytype0 = keytype.toLowerCase();
        this.keytype = (keytype0 === "posting") ? "p" : (keytype0 === "memo" ? "m" : keytype);
        if (typeof privateK === 'string')
            privateK = dhive.PrivateKey.fromString(privateK);
        var messageHash = this.toSignableHash();
        this.signature = privateK.sign(messageHash).toBuffer();
        return this;
    }
    signWithKeychain(keyChainKeyType) {
        var _this = this;
        this.timestamp = utils_1.Utils.utcTime();
        this.validateDataLength();
        return utils_1.Utils.queueKeychain((keychain, resolve, error) => {
            keychain.requestSignBuffer(this.getUser(), this.toSignableTextFormat(), keyChainKeyType, (result) => {
                if (result.success) {
                    _this.keytype = keyChainKeyType.toLowerCase().charAt(0);
                    _this.signature = Buffer.from(result.result, 'hex');
                    resolve(_this);
                }
                else
                    error(result);
            });
        });
    }
    verify() {
        return __awaiter(this, void 0, void 0, function* () {
            var user = this.getUser();
            if (this.isEncrypted() && this.isSignedWithGroupKey()) {
                var conversation = this.getConversation();
                var i = conversation.indexOf('/');
                if (i === -1)
                    return false;
                var groupOwner = conversation.substring(1, i);
                var groupId = conversation.substring(i + 1);
                if (groupOwner !== user)
                    return false;
                var accountPreferences = yield utils_1.Utils.getAccountPreferences(groupOwner);
                if (accountPreferences == null)
                    return false;
                var key = accountPreferences.getGroup(groupId);
                if (key == null)
                    return false;
                return (key == null) ? false : this.verifyWithKey(key.key);
            }
            else {
                var accountData = yield utils_1.Utils.getAccountData(user);
                if (accountData === null)
                    return false;
                return this.verifyWithAccountData(accountData);
            }
        });
    }
    verifyWithAccountData(accountData) {
        var keys = this.isSignedWithMemo() ? [[accountData.memo_key]] : accountData.posting.key_auths;
        if (keys === null)
            return false;
        var messageHash = this.toSignableHash();
        //var signature = Signature.fromString(this.getSignature());
        var signature = dhive.Signature.fromBuffer(this.getSignature());
        for (var i = 0; i < keys.length; i++) {
            var key = dhive.PublicKey.fromString(keys[i][0]);
            if (key.verify(messageHash, signature))
                return true;
        }
        return false;
    }
    verifyWithKey(publicKey) {
        //var signature = Signature.fromString(this.getSignature());
        var signature = dhive.Signature.fromBuffer(this.getSignature());
        if (typeof publicKey === 'string')
            publicKey = dhive.PublicKey.fromString(publicKey);
        return publicKey.verify(this.toSignableHash(), signature);
    }
}
exports.SignableMessage = SignableMessage;

}).call(this)}).call(this,require("buffer").Buffer)
},{"./content/imports":8,"./utils":22,"buffer":24}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
const community_1 = require("./community");
const imports_1 = require("./content/imports");
const displayable_message_1 = require("./displayable-message");
const message_manager_1 = require("./message-manager");
const utils_1 = require("./utils");
const signable_message_1 = require("./signable-message");
const permission_set_1 = require("./permission-set");
const data_stream_1 = require("./data-stream");
const data_path_1 = require("./data-path");
if (window !== undefined) {
    window.stlib = {
        Client: client_1.Client, Community: community_1.Community, Content: imports_1.Content, DataStream: data_stream_1.DataStream, DataPath: data_path_1.DataPath, DisplayableEmote: displayable_message_1.DisplayableEmote, DisplayableMessage: displayable_message_1.DisplayableMessage,
        PermissionSet: permission_set_1.PermissionSet, MessageManager: message_manager_1.MessageManager, Utils: utils_1.Utils, SignableMessage: signable_message_1.SignableMessage,
        newSignableMessage: signable_message_1.SignableMessage.create,
        utcTime: utils_1.Utils.utcTime
    };
}

},{"./client":1,"./community":2,"./content/imports":8,"./data-path":15,"./data-stream":16,"./displayable-message":17,"./message-manager":18,"./permission-set":19,"./signable-message":20,"./utils":22}],22:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountDataCache = exports.Utils = void 0;
const signable_message_1 = require("./signable-message");
var keyChainRequest = null;
var client = null;
var dhiveclient = null;
var isNode = false;
var readPreferencesFn = null;
var lastRandomPublicKey = "";
class Utils {
    static getVersion() { return 100; }
    static getClient() {
        return client;
    }
    static setClient(_client) {
        client = _client;
    }
    static getDhiveClient() {
        if (dhiveclient === null)
            dhiveclient = new dhive.Client(["https://api.hive.blog", "https://api.hivekings.com", "https://anyx.io", "https://api.openhive.network"]);
        return dhiveclient;
    }
    /* Queue keychain requests. */
    static queueKeychain(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            var keychain = window.hive_keychain;
            if (keychain == null)
                throw 'keychain not found';
            var length = Object.keys(keychain.requests).length;
            if (keyChainRequest !== null) {
                if (length > 0) {
                    console.log("warning: keychain already opened");
                }
                yield keyChainRequest;
                if (keyChainRequest !== null) {
                    console.log("error queueKeychain");
                }
            }
            var p = new Promise((resolve, error) => {
                try {
                    fn(keychain, resolve, error);
                }
                catch (e) {
                    console.log(e);
                    error(e);
                }
            });
            try {
                keyChainRequest = p;
                var result = yield p;
            }
            finally {
                keyChainRequest = null;
            }
            return result;
        });
    }
    static setDhiveClient(dhiveClient) {
        dhiveclient = dhiveClient;
    }
    static setNode(_isNode) {
        isNode = _isNode;
    }
    static setReadPreferenceFunction(fn) {
        readPreferencesFn = fn;
    }
    static copy(object) {
        return JSON.parse(JSON.stringify(object));
    }
    static utcTime() { return new Date().getTime(); }
    static getAccountPreferences(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNode) {
                return yield readPreferencesFn(user);
            }
            else {
                if (Utils.getClient() == null)
                    throw 'client is null, use Utils.setClient(...) to initialize.';
                return yield preferencesDataCache.cacheLogic(user, (user) => {
                    return Utils.getClient().readPreferences(user).then((res) => __awaiter(this, void 0, void 0, function* () {
                        if (res.isSuccess()) {
                            var result = res.getResult();
                            if (result === null)
                                return null;
                            else {
                                var msg = signable_message_1.SignableMessage.fromJSON(result);
                                var verify = yield msg.verify();
                                if (verify) {
                                    return msg.getContent();
                                }
                                else
                                    throw "preferences did not verify";
                            }
                        }
                        else
                            throw res.getError();
                        throw "failed to load";
                    }));
                });
            }
        });
    }
    static preloadAccountData(users, reload = false) {
        return __awaiter(this, void 0, void 0, function* () {
            var store = accountDataCache;
            var usersToLoad = users;
            if (!reload) {
                usersToLoad = [];
                for (var user of users) {
                    if (store.lookup(user) === undefined)
                        usersToLoad.push(user);
                }
            }
            if (usersToLoad.length === 0)
                return;
            var p = Utils.getDhiveClient().database.getAccounts(usersToLoad);
            for (var user of usersToLoad)
                store.storeLater(user, p);
            var array = yield p;
            for (var result of array)
                store.store(result.name, {
                    name: result.name,
                    posting: result.posting,
                    memo_key: result.memo_key,
                    posting_json_metadata: result.posting_json_metadata
                });
        });
    }
    static getAccountData(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield accountDataCache.cacheLogic(user, (user) => {
                return Utils.getDhiveClient().database
                    .getAccounts([user]).then((array) => {
                    if (array.length === 1 && array[0].name === user) {
                        return {
                            name: array[0].name,
                            posting: array[0].posting,
                            memo_key: array[0].memo_key,
                            posting_json_metadata: array[0].posting_json_metadata
                        };
                    }
                    return null;
                });
            });
        });
    }
    static getCommunityData(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield communityDataCache.cacheLogic(user, (user) => {
                return Utils.getDhiveClient().call("bridge", "get_community", [user]).then((result) => __awaiter(this, void 0, void 0, function* () {
                    var array = yield Utils.getDhiveClient().call("bridge", "list_community_roles", [user]);
                    result.roles = {};
                    if (Array.isArray(array))
                        for (var role of array) {
                            role[2] = role[2] === "" ? [] : role[2].split(",");
                            result.roles[role[0]] = role;
                        }
                    return result;
                }));
            });
        });
    }
    static isWholeNumber(text) {
        return /^\d+$/.test(text);
    }
    static randomPublicKey(extraEntropy = "") {
        var seed = extraEntropy + new Date().getTime() + lastRandomPublicKey + Math.random();
        var pi = dhive.PrivateKey.fromSeed(seed);
        var key = pi.createPublic("STM").toString();
        lastRandomPublicKey = key;
        return key;
    }
    static newCache() {
        return new AccountDataCache();
    }
    static getAccountDataCache() { return accountDataCache; }
    static getCommunityDataCache() { return communityDataCache; }
}
exports.Utils = Utils;
/*
TODO a simple cache for now
will have to discuss and redesign later
server will most likely prefer to have up to date data
it could do that by streaming blocks from hive

on the other hand client might prefer to cache
account and community data for X time
*/
class AccountDataCache {
    constructor() {
        this.data = {};
    }
    lookup(user) {
        return this.data[user];
    }
    lookupValue(user) {
        var item = this.data[user];
        if (item === undefined)
            return undefined;
        return item.value;
    }
    storeLater(user, promise) {
        this.data[user] = { promise };
    }
    store(user, value) {
        if (this.data[user] === undefined)
            this.data[user] = { value };
        else {
            delete this.data[user].promise;
            this.data[user].value = value;
        }
    }
    cacheLogic(user, dataPromise) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO cache for x time
            //TODO group many requests into one
            //TODO limit hive api calls
            var cachedData = this.lookup(user);
            if (cachedData !== undefined) {
                if (cachedData.value !== undefined)
                    return cachedData.value;
                if (cachedData.promise !== undefined) {
                    yield cachedData.promise;
                    return cachedData.value;
                }
            }
            var promise = dataPromise(user).then((result) => {
                this.store(user, result);
                return result;
            });
            this.storeLater(user, promise);
            return yield promise;
        });
    }
}
exports.AccountDataCache = AccountDataCache;
const preferencesDataCache = new AccountDataCache();
const accountDataCache = new AccountDataCache();
const communityDataCache = new AccountDataCache();

},{"./signable-message":20}],23:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],24:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":23,"buffer":24,"ieee754":25}],25:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}]},{},[21]);
