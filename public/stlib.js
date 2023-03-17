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
        socket.on("u", (data) => {
            if (this.onupdate !== null)
                this.onupdate(data);
        });
    }
    readStats(conversations = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.emit('s', conversations);
        });
    }
    readInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.emit('i', "");
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
    readCommunity(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.emit("rg", username);
        });
    }
    readUserMessages(username, fromTimestamp, toTimestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.read('@' + username, fromTimestamp, toTimestamp);
        });
    }
    readOnlineStatus(usernames, maxTimestamp = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(usernames))
                usernames = [usernames];
            return yield this.emit("r", ["r", '$online', usernames, maxTimestamp]);
        });
    }
    readOnlineStatusForCommunity(username, maxTimestamp = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.emit("r", ["r", '$online', username, maxTimestamp]);
        });
    }
    read(conversation, fromTimestamp, toTimestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.emit("r", ["r", conversation, fromTimestamp, toTimestamp]);
        });
    }
    createGuestAccount(username, publicPostingKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.emit("a", ["a", username, username, publicPostingKey]);
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
            return yield this.emit('w', msg.toJSON());
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
    close() {
        this.io.close();
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
    constructor() {
        this.emotes = {};
        this.joined = null;
    }
    initialize(communityData) {
        this.communityData = communityData;
        var settings = this.getSettings();
        if (settings.emotes === undefined)
            this.emotes = {};
        else
            this.emotes = utils_1.Utils.copy(settings.emotes);
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
    getDefaultStream() {
        if (this.streams === null)
            return null;
        for (var stream of this.streams) {
            if (stream.getPathType() === 't')
                return stream;
        }
        return null;
    }
    setStreams(streams) { this.streams = streams; }
    addStream(stream) { this.streams.push(stream); }
    canSetRole(username, account, role) {
        var userRoleIndex = Community.roleToIndex(this.getRole(account));
        var roleToSetIndex = Community.roleToIndex(role);
        if (roleToSetIndex === -1)
            return false;
        var userRole = this.getRole(username);
        if (!userRole)
            return false;
        var roleIndex = Community.roleToIndex(userRole);
        return roleIndex >= 5 && roleIndex >= userRoleIndex && roleIndex > roleToSetIndex;
    }
    canSetTitles(username) {
        var userRole = this.getRole(username);
        if (!userRole)
            return false;
        var roleIndex = Community.roleToIndex(userRole);
        return roleIndex >= 5;
    }
    canUpdateSettings(user) {
        var userRole = this.getRole(user);
        if (!userRole)
            return false;
        var roleIndex = Community.roleToIndex(userRole);
        return roleIndex > 5;
    }
    getFlagNum(username) {
        var userRole = this.getRole(username);
        if (!userRole)
            return 1;
        var roleIndex = Community.roleToIndex(userRole);
        return roleIndex >= 5 ? 3 : 1;
    }
    getRole(username) {
        var role = this.getRoleEntry(username);
        return role == null ? null : role[1];
    }
    setRole(username, role) {
        var roleEntry = this.getOrCreateRoleEntry(username);
        roleEntry[1] = role;
    }
    getTitles(username) {
        var role = this.getRoleEntry(username);
        return role == null ? null : role[2];
    }
    setTitles(username, titles) {
        var roleEntry = this.getOrCreateRoleEntry(username);
        roleEntry[2] = titles;
    }
    hasTitle(username, title) {
        var titles = this.getTitles(username);
        return titles === null ? false : titles.indexOf(title) !== -1;
    }
    listRoles() { return this.communityData.roles; }
    getRoleEntry(username) {
        var roles = this.communityData.roles;
        if (roles == null)
            return null;
        var role = roles[username];
        return role == null ? null : role;
    }
    getOrCreateRoleEntry(username) {
        var roles = this.communityData.roles;
        if (roles == null)
            this.communityData.roles = roles = {};
        var role = roles[username];
        if (role == null)
            roles[username] = role = [username, null, null];
        return role;
    }
    newCategory(name) {
        var category = data_stream_1.DataStream.fromJSON(this.getName(), [name]);
        this.addStream(category);
        return category;
    }
    newTextStream(name, path = null) {
        if (path === null) {
            var groupId = this.findFreeTextStreamId();
            if (groupId === -1)
                throw "maximum limit of " +
                    Community.MAX_TEXT_STREAMS + " text streams reached";
            path = '' + groupId;
        }
        var stream = data_stream_1.DataStream.fromJSON(this.getName(), [name, path]);
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
        settings.emotes = this.emotes;
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
        copy.emotes = utils_1.Utils.copy(this.emotes);
        return copy;
    }
    listJoined() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.joined != null)
                return yield this.joined;
            var name = this.getName();
            this.joined = utils_1.Utils.retrieveAll("bridge", "list_subscribers", { community: name, last: null, limit: 100 });
            return yield this.joined;
        });
    }
    setJoined(joined) {
        this.joined = Promise.resolve(joined);
    }
    reload(reloadJoined = false) {
        return __awaiter(this, void 0, void 0, function* () {
            var name = this.getName();
            utils_1.Utils.getCommunityDataCache().reload(name);
            var data = yield utils_1.Utils.getCommunityData(name);
            this.initialize(data);
            if (reloadJoined)
                this.joined = null;
            data.community = this;
            return this;
        });
    }
    static defaultStreams(community) {
        return [
            data_stream_1.DataStream.fromJSON(community, ["General", "0"]),
            data_stream_1.DataStream.fromJSON(community, ["About", "/about"]),
            data_stream_1.DataStream.fromJSON(community, ["Visit Community", "/created"])
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
            if (data.joined != null)
                community.setJoined(data.joined);
            data.community = community;
            return community;
        });
    }
    static roleToIndex(role) {
        if (role)
            switch (role) {
                case "owner": return 7;
                case "admin": return 6;
                case "mod": return 5;
                case "member": return 4;
                case "guest": return 3;
                //case "joined": return 2;
                //case "onboard": return 1;
                case "": return 0;
            }
        return -1;
    }
    toJSON() {
        var copy = {};
        var data = this.communityData;
        for (var item in data) {
            if (item === 'community')
                continue;
            copy[item] = data[item];
        }
        return copy;
    }
}
exports.Community = Community;
Community.MAX_TEXT_STREAMS = 64;

},{"./data-path":18,"./data-stream":19,"./utils":28}],3:[function(require,module,exports){
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
exports.PrivatePreferences = exports.Preferences = exports.Emote = exports.OnlineStatus = exports.Quote = exports.Thread = exports.WithReference = exports.Text = exports.Images = exports.GroupInvite = exports.Encoded = exports.Edit = exports.JSONContent = exports.decodeTextWithKeychain = exports.encodeTextWithKeychain = exports.decodedMessage = exports.encodedMessage = exports.decodeTextWithKey = exports.encodeTextWithKey = exports.onlineStatus = exports.preferences = exports.groupInvite = exports.flag = exports.emote = exports.edit = exports.quote = exports.thread = exports.images = exports.text = exports.fromJSON = exports.type = exports.addType = void 0;
const imports_1 = require("./imports");
Object.defineProperty(exports, "JSONContent", { enumerable: true, get: function () { return imports_1.JSONContent; } });
Object.defineProperty(exports, "Encoded", { enumerable: true, get: function () { return imports_1.Encoded; } });
Object.defineProperty(exports, "GroupInvite", { enumerable: true, get: function () { return imports_1.GroupInvite; } });
Object.defineProperty(exports, "Images", { enumerable: true, get: function () { return imports_1.Images; } });
Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return imports_1.Text; } });
Object.defineProperty(exports, "WithReference", { enumerable: true, get: function () { return imports_1.WithReference; } });
Object.defineProperty(exports, "Thread", { enumerable: true, get: function () { return imports_1.Thread; } });
Object.defineProperty(exports, "OnlineStatus", { enumerable: true, get: function () { return imports_1.OnlineStatus; } });
Object.defineProperty(exports, "Quote", { enumerable: true, get: function () { return imports_1.Quote; } });
Object.defineProperty(exports, "Edit", { enumerable: true, get: function () { return imports_1.Edit; } });
Object.defineProperty(exports, "Emote", { enumerable: true, get: function () { return imports_1.Emote; } });
Object.defineProperty(exports, "Preferences", { enumerable: true, get: function () { return imports_1.Preferences; } });
Object.defineProperty(exports, "PrivatePreferences", { enumerable: true, get: function () { return imports_1.PrivatePreferences; } });
var supportedTypes = {};
function addType(type, typeString = null) {
    if (typeString === null)
        typeString = type['TYPE'];
    if (typeString == null)
        throw "unknown type";
    if (supportedTypes[typeString] !== undefined)
        console.log("warning: redeclaring type: ", typeString);
    supportedTypes[typeString] = type;
}
exports.addType = addType;
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
    var result = supportedTypes[ty];
    return result == null ? null : new result(json);
}
exports.fromJSON = fromJSON;
function text(message) {
    return new imports_1.Text([imports_1.Text.TYPE, message]);
}
exports.text = text;
function images(...images) {
    return new imports_1.Images([imports_1.Images.TYPE, ...images]);
}
exports.images = images;
function thread(threadName, content) {
    if (content instanceof imports_1.JSONContent)
        content = content.toJSON();
    return new imports_1.Thread([imports_1.Thread.TYPE, threadName, content]);
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
function flag(reason, parentMessage) {
    return new imports_1.Flag([imports_1.Flag.TYPE, reason,
        parentMessage.getReference()
    ]);
}
exports.flag = flag;
function groupInvite(message, group, key) {
    return new imports_1.GroupInvite([imports_1.GroupInvite.TYPE, message, group, key]);
}
exports.groupInvite = groupInvite;
function preferences(json = {}) {
    return new imports_1.Preferences([imports_1.Preferences.TYPE, json]);
}
exports.preferences = preferences;
function onlineStatus(online, communities) {
    return new imports_1.OnlineStatus([imports_1.OnlineStatus.TYPE, online, communities]);
}
exports.onlineStatus = onlineStatus;
function encodeTextWithKey(text, privateK, publicK) {
    return imports_1.Utils.encodeTextWithKey(text, privateK, publicK);
}
exports.encodeTextWithKey = encodeTextWithKey;
function decodeTextWithKey(text, privateK) {
    return imports_1.Utils.decodeTextWithKey(text, privateK);
}
exports.decodeTextWithKey = decodeTextWithKey;
function encodedMessage(msg, privateK, publicK) {
    var string = JSON.stringify([msg.getUser(), msg.getJSONString(), msg.keytype, msg.getSignature().toString('hex')]);
    var encoded = [imports_1.Encoded.TYPE, 'g', imports_1.Utils.encodeTextWithKey(string, privateK, publicK)];
    return new imports_1.Encoded(encoded);
}
exports.encodedMessage = encodedMessage;
function decodedMessage(msg, privateK) {
    return JSON.parse(imports_1.Utils.decodeTextWithKey(msg.json[2], privateK));
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

},{"./imports":10}],4:[function(require,module,exports){
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

},{"./imports":10}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emote = void 0;
const imports_1 = require("./imports");
class Emote extends imports_1.WithReference {
    constructor(json) { super(json); }
}
exports.Emote = Emote;
Emote.TYPE = "e";

},{"./imports":10}],6:[function(require,module,exports){
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
        var string = imports_1.Utils.decodeTextWithKey(text, privateK);
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

},{"./imports":10}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flag = void 0;
const imports_1 = require("./imports");
class Flag extends imports_1.WithReference {
    constructor(json) { super(json); }
}
exports.Flag = Flag;
Flag.TYPE = "f";

},{"./imports":10}],8:[function(require,module,exports){
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

},{"./imports":10}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Images = void 0;
const imports_1 = require("./imports");
class Images extends imports_1.JSONContent {
    constructor(json) { super(json); }
    getText() {
        var json = this.json;
        var text = json[1];
        for (var i = 2; i < json.length; i++)
            text += " " + json[i];
        return text;
    }
    setText(text) {
        var arr = text.trim().split(/\s+/);
        this.json = [this.json[0], ...arr];
    }
    addImage(image) { this.json.push(image); }
    getImage(index) { return this.json[index + 1]; }
    setImage(index, image) { this.json[index + 1] = image; }
    length() { return this.json.length - 1; }
}
exports.Images = Images;
Images.TYPE = "i";

},{"./imports":10}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = exports.PrivatePreferences = exports.Preferences = exports.Flag = exports.Emote = exports.Edit = exports.Quote = exports.OnlineStatus = exports.Thread = exports.WithReference = exports.Text = exports.Images = exports.GroupInvite = exports.Encoded = exports.JSONContent = exports.Content = exports.SignableMessage = void 0;
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
const images_1 = require("./images");
Object.defineProperty(exports, "Images", { enumerable: true, get: function () { return images_1.Images; } });
const online_status_1 = require("./online-status");
Object.defineProperty(exports, "OnlineStatus", { enumerable: true, get: function () { return online_status_1.OnlineStatus; } });
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
const flag_1 = require("./flag");
Object.defineProperty(exports, "Flag", { enumerable: true, get: function () { return flag_1.Flag; } });
const preferences_1 = require("./preferences");
Object.defineProperty(exports, "Preferences", { enumerable: true, get: function () { return preferences_1.Preferences; } });
Object.defineProperty(exports, "PrivatePreferences", { enumerable: true, get: function () { return preferences_1.PrivatePreferences; } });
//import { Group } from './group'
Content.addType(text_1.Text);
Content.addType(thread_1.Thread);
Content.addType(quote_1.Quote);
Content.addType(edit_1.Edit);
Content.addType(emote_1.Emote);
Content.addType(flag_1.Flag);
Content.addType(images_1.Images);
Content.addType(group_invite_1.GroupInvite);
Content.addType(preferences_1.Preferences);
Content.addType(encoded_1.Encoded);
Content.addType(online_status_1.OnlineStatus);

},{"../signable-message":25,"../utils":28,"./content":3,"./edit":4,"./emote":5,"./encoded":6,"./flag":7,"./group-invite":8,"./images":9,"./jsoncontent":11,"./online-status":12,"./preferences":13,"./quote":14,"./text":15,"./thread":16,"./with-reference":17}],11:[function(require,module,exports){
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
    encodeWithKey(user, groupUsers, keytype, privateK, publicK = null) {
        return __awaiter(this, void 0, void 0, function* () {
            groupUsers.sort();
            var string = JSON.stringify(this.json);
            var encoded = [imports_1.Encoded.TYPE, keytype.toLowerCase().charAt(0)];
            for (var groupUser of groupUsers) {
                if (user === groupUser) {
                    encoded.push(null);
                    continue;
                }
                var puKey = publicK;
                if (puKey == null) {
                    puKey = yield imports_1.Utils.getPreferredKey(groupUser);
                    if (puKey == null)
                        throw "error could not find public key of user: " + groupUser;
                }
                encoded.push(imports_1.Utils.encodeTextWithKey(string, privateK, puKey));
            }
            return new imports_1.Encoded(encoded);
        });
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

},{"./imports":10}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlineStatus = void 0;
const imports_1 = require("./imports");
class OnlineStatus extends imports_1.JSONContent {
    constructor(json) { super(json); }
    isOnline() { return this.getStatus() != null && this.getStatus() != false; }
    setOnline(value = true) { this.setStatus(value); }
    getStatus() { return this.json[1]; }
    setStatus(value) { this.json[1] = value; }
    setCommunities(value) { this.json[2] = value; }
    getCommunities() { return this.json[2]; }
}
exports.OnlineStatus = OnlineStatus;
OnlineStatus.TYPE = "o";

},{"./imports":10}],13:[function(require,module,exports){
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
    setKeyFor(group, key = null) {
        var keys = this.keys();
        if (key == null) {
            if (keys[group] === undefined)
                return;
            delete keys[group];
            this.updated = true;
        }
        else if (keys[group] !== key) {
            keys[group] = key;
            this.updated = true;
        }
    }
    getKeyFor(group) {
        var keys = this.keys();
        var key = keys[group];
        return key == null ? null : key;
    }
    copy() {
        var result = new PrivatePreferences(imports_1.Utils.copy(this.json));
        result.updated = this.updated;
        return result;
    }
}
exports.PrivatePreferences = PrivatePreferences;
class Preferences extends imports_1.JSONContent {
    constructor(json) {
        super(json);
        this.privatePreferences = null;
    }
    getPreferencesJSON() { return this.json[1]; }
    createGuestAccount(message) {
        var account = this.getAccount();
        account.message = message;
    }
    hasAccount(user) {
        var account = this.getAccount(false);
        return account && account.message && account.message.length > 2 && account.message[2] === user;
    }
    verifyAccount(user) {
        return __awaiter(this, void 0, void 0, function* () {
            var account = this.getAccount(false);
            if (account && account.message && account.message.length >= 7 && account.message[2] === user) {
                //check if account.creator has permission to create account
                var message = imports_1.SignableMessage.fromJSON(account.message);
                return yield message.verify();
            }
            return false;
        });
    }
    setCommunity(community, join) {
        var account = this.getAccount(false);
        if (account == null)
            return false;
        var communities = this.getCommunities();
        var index = communities.indexOf(community);
        if (join) {
            if (index === -1) {
                communities.push(community);
                account.communities = communities;
                return true;
            }
        }
        else {
            if (index !== -1) {
                communities.splice(index, 1);
                account.communities = communities;
                return true;
            }
        }
        return false;
    }
    getCommunities() {
        var account = this.getAccount(false);
        if (account && account.communities != null)
            return account.communities;
        return [];
    }
    getValueBoolean(name, def = false) {
        var value = this.getValues()[name + ":b"];
        return (value === undefined) ? def : value;
    }
    getValueString(name, def = null) {
        var value = this.getValues()[name + ":s"];
        return (value === undefined) ? def : value;
    }
    getValue(nameColonType, def = null) {
        var value = this.getValues()[nameColonType];
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
    getAccount(create = true) { return this.getValueSet('account', create); }
    getValues(create = true) { return this.getValueSet('values', create); }
    getGroups(create = true) { return this.getValueSet('groups', create); }
    getValueSet(name, create = true) {
        var json = this.getPreferencesJSON();
        var set = json[name];
        if (create && set === undefined)
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
    getPrivatePreferencesWithKey(privateK) {
        var pref = this.privatePreferences;
        if (pref !== null)
            return pref;
        var json = this.getPreferencesJSON();
        var message = json['#'];
        if (message !== undefined && typeof message === 'string') {
            var result = imports_1.Utils.decodeTextWithKey(message, privateK);
            this.privatePreferences = new PrivatePreferences(JSON.parse(result));
        }
        else
            this.privatePreferences = new PrivatePreferences({});
        return this.privatePreferences;
    }
    encodePrivatePreferencesWithKey(privateK, publicK, onlyIfUpdated = true) {
        var pref = this.privatePreferences;
        if (pref == null || (onlyIfUpdated && !pref.updated))
            return;
        var text = imports_1.Utils.encodeTextWithKey(JSON.stringify(pref.json), privateK, publicK);
        var json = this.getPreferencesJSON();
        json['#'] = text;
        pref.updated = false;
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
    encodePrivatePreferencesWithKeychan(user, keychainKeyType = 'Posting', onlyIfUpdated = true) {
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
    copy() {
        var result = super.copy();
        var privatePreferences = this.privatePreferences;
        if (privatePreferences != null)
            result.privatePreferences = privatePreferences.copy();
        return result;
    }
}
exports.Preferences = Preferences;
Preferences.TYPE = "p";
Preferences.MAX_USER_GROUPS = 64;

},{"./imports":10}],14:[function(require,module,exports){
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

},{"./imports":10}],15:[function(require,module,exports){
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

},{"./imports":10}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thread = void 0;
const imports_1 = require("./imports");
class Thread extends imports_1.Text {
    constructor(json) {
        super(json);
        this.cachedContent = null;
    }
    getName() { return this.json[1]; }
    setName(text) { this.json[1] = text; }
    getContent() {
        var content = this.cachedContent;
        if (content !== null)
            return content;
        content = imports_1.Content.fromJSON(this.json[2]);
        this.cachedContent = content;
        return content;
    }
    setContent(json) { this.cachedContent = null; this.json[2] = json; }
}
exports.Thread = Thread;
Thread.TYPE = "h";

},{"./imports":10}],17:[function(require,module,exports){
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

},{"./imports":10}],18:[function(require,module,exports){
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
        if (text.startsWith("http:") || text.startsWith("https:"))
            return new DataPath(DataPath.TYPE_URL, community, text);
        var typeI = text.indexOf(':');
        var type = null;
        if (typeI !== -1) {
            type = text.substring(0, typeI);
            text = text.substring(typeI + 1);
        }
        var slash = text.indexOf('/');
        if (slash === 0)
            return new DataPath((type === null) ? DataPath.TYPE_INFO : type, community, text.substring(1));
        if ( /*text.startsWith("hive-") &&*/slash !== -1) {
            community = text.substring(0, slash);
            text = text.substring(slash + 1);
            if (type === null && utils_1.Utils.isWholeNumber(text))
                type = DataPath.TYPE_TEXT;
        }
        return new DataPath((type === null) ? DataPath.TYPE_INFO : type, community, text);
    }
    toString(community) {
        if (this.type === DataPath.TYPE_URL) {
            if (this.path.startsWith("http:") || this.path.startsWith("https:"))
                return this.path;
            return this.type + ':' + this.path;
        }
        else if (this.user === community) {
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
DataPath.TYPE_URL = "u";
DataPath.TYPE_TEXT = "t";
DataPath.TYPE_GROUP = "g";

},{"./utils":28}],19:[function(require,module,exports){
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

},{"./data-path":18,"./permission-set":24}],20:[function(require,module,exports){
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
exports.DefaultStreamDataCache = void 0;
const community_1 = require("./community");
const stream_data_cache_1 = require("./stream-data-cache");
const utils_1 = require("./utils");
/*
Class used for retrieving up-to-date roles, titles of users in communities.
Data is loaded on request and real-time updates are handled by block streaming.
*/
class DefaultStreamDataCache extends stream_data_cache_1.StreamDataCache {
    constructor() {
        super(utils_1.Utils.getDhiveClient());
        this.onUserJoin = null;
        this.onUpdateUser = null;
        this.onUpdateCommunity = null;
        var _this = this;
        this.forCustomJSON("community", (user, json, posting) => __awaiter(this, void 0, void 0, function* () {
            console.log("community", user, json, posting);
            var type = json[0];
            switch (type) {
                case "setRole":
                    _this.onSetRole(user, json[1]);
                    break;
                case "setUserTitle":
                    _this.onSetTitle(user, json[1]);
                    break;
                case "subscribe":
                    if (_this.onUserJoin)
                        _this.onUserJoin(json.community, user, true);
                    break;
                case "unsubscribe":
                    if (_this.onUserJoin)
                        _this.onUserJoin(json.community, user, false);
                    break;
                case "updateProps":
                    _this.onUpdateProps(user, json[1]);
                    break;
            }
        }));
    }
    sheduleCommunityUpdate(community) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!community || !community.startsWith("hive-"))
                return;
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                console.log("community update", community);
                var data = yield community_1.Community.load(community);
                //await data.listJoined();
                //var copy = data.copy();
                //TODO add consistency check to see if reloaded data
                //is equal to current updated data from stream
                data.reload();
            }), 60000);
        });
    }
    onSetRole(user, json) {
        return __awaiter(this, void 0, void 0, function* () {
            var community = json.community;
            var account = json.account;
            var role = json.role;
            if (!community || !community.startsWith("hive-"))
                return;
            //validate role, check if can set
            var roleToSetIndex = community_1.Community.roleToIndex(role);
            if (roleToSetIndex === -1 && roleToSetIndex < 7)
                return;
            var data = yield community_1.Community.load(community);
            if (!data)
                return;
            this.sheduleCommunityUpdate(community);
            if (data.canSetRole(user, account, role)) {
                console.log("update role ", community, account, role);
                data.setRole(account, role);
                if (this.onUpdateUser) {
                    try {
                        this.onUpdateUser(community, account, role, data.getTitles(user));
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
            else
                console.log("update role no permission", community, account, role);
        });
    }
    onSetTitle(user, json) {
        return __awaiter(this, void 0, void 0, function* () {
            var community = json.community;
            var account = json.account;
            var title = json.title;
            if (!community || !community.startsWith("hive-"))
                return;
            //check if can set
            var data = yield community_1.Community.load(community);
            if (!data)
                return;
            this.sheduleCommunityUpdate(community);
            if (data.canSetTitles(user)) {
                console.log("update title ", community, account, title);
                var titles = title.split(",");
                data.setTitles(account, titles);
                if (this.onUpdateUser) {
                    try {
                        this.onUpdateUser(community, account, data.getRole(user), titles);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
            else
                console.log("update title no permission", community, account, title);
        });
    }
    onUpdateProps(user, json) {
        return __awaiter(this, void 0, void 0, function* () {
            var community = json.community;
            var props = json.props;
            if (!community || !community.startsWith("hive-"))
                return;
            if (this.onUpdateCommunity) {
                try {
                    this.onUpdateCommunity(community);
                }
                catch (e) {
                    console.log(e);
                }
            }
            this.sheduleCommunityUpdate(community);
            if (props) {
                var data = yield community_1.Community.load(community);
                if (!data || !data.canUpdateSettings(user))
                    return null;
                var settings = props.settings;
                var communitySettings = data.communityData.settings;
                if (settings) {
                    var streams = settings.streams;
                    if (streams) {
                        console.log("update settings", user);
                        communitySettings.streams = streams;
                        data.initialize(data.communityData);
                    }
                }
            }
        });
    }
    getRole(community, user) {
        return __awaiter(this, void 0, void 0, function* () {
            var data = yield community_1.Community.load(community);
            if (!data)
                return null;
            return data.getRole(user);
        });
    }
    getTitles(community, user) {
        return __awaiter(this, void 0, void 0, function* () {
            var data = yield community_1.Community.load(community);
            if (!data)
                return null;
            return data.getTitles(user);
        });
    }
    getUser(community, user) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = yield community_1.Community.load(community);
            if (!result)
                return null;
            return result.getRoleEntry(user);
        });
    }
    lookup(community, user = null) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = yield community_1.Community.load(community);
            if (!result)
                return null;
            if (user !== null)
                result = result.getOrCreateRoleEntry(user);
            return result;
        });
    }
}
exports.DefaultStreamDataCache = DefaultStreamDataCache;

},{"./community":2,"./stream-data-cache":27,"./utils":28}],21:[function(require,module,exports){
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
exports.DisplayableFlag = exports.DisplayableEmote = exports.DisplayableMessage = void 0;
const imports_1 = require("./content/imports");
const utils_1 = require("./utils");
class DisplayableMessage {
    constructor(message) {
        this.reference = null;
        this.edits = null;
        this.emotes = null;
        this.flags = null;
        this.flagsNum = 0;
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
    flag(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            var content = msg.content;
            if (!(content instanceof imports_1.Flag))
                return;
            if (this.flags === null)
                this.flags = [];
            for (var flag of this.flags)
                if (msg.getUser() === flag.user)
                    return;
            this.flags.push(new DisplayableFlag(msg.getUser(), content.getText(), msg));
            var communityConversation = msg.getCommunity();
            if (communityConversation)
                this.flagsNum += yield utils_1.Utils.getFlagNum(communityConversation, msg.getUser());
            else
                this.flagsNum++;
        });
    }
    isThread() {
        return this.getEditedContent() instanceof imports_1.Thread;
    }
    getThreadName() {
        var content = this.getEditedContent();
        return (content instanceof imports_1.Thread) ? content.getName() : null;
    }
    isEmote() {
        return this.content instanceof imports_1.Emote;
    }
    isFlag() {
        return this.content instanceof imports_1.Flag;
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
    getEditedContent() {
        var edits = this.edits;
        if (edits !== null && edits.length > 0)
            return edits[0].editContent;
        return this.content;
    }
    getContent() {
        var content = this.getEditedContent();
        if (content instanceof imports_1.Thread)
            return content.getContent();
        return content;
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
class DisplayableFlag {
    constructor(user, reason, message) {
        this.user = user;
        this.reason = reason;
        this.message = message;
    }
}
exports.DisplayableFlag = DisplayableFlag;

},{"./content/imports":10,"./utils":28}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Markdown = void 0;
const markdown_ast_1 = require("markdown-ast");
const URL_ABSOLUTE_RE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const URL_IMG_RE = /\.(jpeg|jpg|gif|png|webp)$/;
const GL_URL_HTTP = true;
const GL_HTTP_TO_HTTPS = true;
class Markdown {
    static simpleFilteredURL(url) {
        var r = {
            url: "",
            protocol: "",
            image: false
        };
        if (URL_ABSOLUTE_RE.test(url)) {
            try {
                var u = new URL(url);
                r.protocol = u.protocol;
                if (u.protocol === "http:") { //optionally upgrade to https
                    if (GL_HTTP_TO_HTTPS) {
                        r.url = "https://" + u.href.substring(5);
                        r.protocol = "https:";
                    }
                    else if (GL_URL_HTTP)
                        r.url = u.href;
                    r.image = URL_IMG_RE.test(u.pathname);
                }
                else if (u.protocol === "https:") {
                    r.url = u.href;
                    r.image = URL_IMG_RE.test(u.pathname);
                }
                if (u.protocol === "mailto:")
                    r.url = u.href;
            }
            catch (e) {
                console.log(e);
            }
            return r;
        }
        else {
            return r;
        }
    }
    static simpleHtml(html) {
        /*var result = document.createDocumentFragment();
        var arr = window.htmlAst(html);
        console.log(arr);
        simpleHtml0(arr, result);
        return result;*/ return null;
    }
    static simpleMarkdownTextAdd2(text, result) {
        var lines = text.split(/\n/);
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (i !== 0)
                result.appendChild(document.createElement("br"));
            var words = line.split(/\s+/);
            var str = "";
            for (var j = 0; j < words.length; j++) {
                var word = words[j];
                if (word.startsWith("@")) {
                    result.appendChild(document.createTextNode(str));
                    str = " ";
                    var linkA = document.createElement("a");
                    linkA.setAttribute("href", "/#" + word);
                    linkA.innerText = word;
                    result.appendChild(linkA);
                }
                else if (word.startsWith("https://") || word.startsWith("http://")) {
                    result.appendChild(document.createTextNode(str));
                    str = " ";
                    var u = Markdown.simpleFilteredURL(word);
                    if (u.image) {
                        var linkImg = document.createElement("img");
                        linkImg.setAttribute("src", Markdown.imgPrepend + u.url);
                        linkImg.innerText = word;
                        result.appendChild(linkImg);
                    }
                    else {
                        var linkA = document.createElement("a");
                        linkA.setAttribute("href", u.url);
                        linkA.setAttribute("rel", "noopener noreferrer");
                        linkA.setAttribute("target", "_blank");
                        linkA.innerText = word;
                        result.appendChild(linkA);
                    }
                }
                else
                    str += word + " ";
            }
            result.appendChild(document.createTextNode(str));
        }
        return result;
    }
    static simpleMarkdownTextAdd(text, html) {
        html = false;
        var result = (html) ? Markdown.simpleHtml(text) : Markdown.simpleMarkdownTextAdd2(text, document.createDocumentFragment());
        return result;
    }
    static simpleMarkdownAdd(arr, result, level) {
        var html = true;
        var lastType = "";
        var lastP = null;
        for (var i = 0; i < arr.length; i++) {
            var a = arr[i];
            var item = null;
            var addP = true;
            switch (a.type) {
                case "image":
                    item = document.createElement("img");
                    item.setAttribute("alt", a.alt);
                    item.setAttribute("src", Markdown.imgPrepend + a.url);
                    break;
                case "italic":
                    item = document.createElement("i");
                    break;
                case "bold":
                    item = document.createElement("b");
                    break;
                case "strike":
                    item = document.createElement("del");
                    break;
                case "codeSpan":
                    item = document.createElement("code");
                    item.innerText = a.code;
                    break;
                case "link":
                    item = document.createElement("a");
                    //item.setAttribute("rel", a.rel);
                    item.setAttribute("href", a.url);
                    break;
                case "break":
                    addP = false;
                    /*if(lastType != "bold" && lastType != "italic" && lastType != "text" && lastType != "title" && lastType != "quote")*/
                    //if(lastP === null || !lastP.__skipBreak)
                    if (level > 0)
                        item = document.createElement("br");
                    break;
                case "codeBlock":
                    addP = false;
                    var pre = document.createElement("pre");
                    var code = document.createElement("code");
                    code.innerText = a.code;
                    pre.appendChild(code);
                    result.appendChild(pre);
                    break;
                case "text":
                    if (lastP !== null) {
                        item = Markdown.simpleMarkdownTextAdd(a.text, html); //document.createTextNode(a.text);
                    }
                    else {
                        if (level === 0) {
                            addP = false;
                            item = document.createElement("p");
                            lastP = item;
                            if (a.text !== undefined) {
                                item.appendChild(Markdown.simpleMarkdownTextAdd(a.text.trimLeft(), html));
                                //item.innerText = a.text.trimLeft();
                            }
                        }
                        else
                            item = Markdown.simpleMarkdownTextAdd(a.text, html);
                    }
                    //item = document.createElement("p");
                    //if(a.text !== undefined) { item.innerText = a.text.trim(); }  
                    /*if(level === 0) {
                        item = document.createElement("p");
                        if(a.text !== undefined) { item.innerText = a.text.trim(); }
                    }
                    else {
                        item = document.createTextNode(a.text.trim());
                    }*/
                    /*if(a.text == "\n") {
                        if(level !== 0) item = document.createElement("br");
                    }
                    else if(level === 0) {
                        item = document.createElement("p");
                        if(a.text !== undefined) { item.innerText = a.text.trim(); }
                    }
                    else {
                        item = document.createTextNode(a.text.trim());
                    }*/
                    break;
                case "title":
                    addP = false;
                    item = document.createElement("h" + a.rank);
                    break;
                case "quote":
                    addP = false;
                    item = document.createElement("blockquote");
                    break;
                case "list":
                    addP = false;
                    var d = document.createElement("div");
                    d.setAttribute("class", "md-list");
                    d.appendChild(document.createTextNode(a.bullet));
                    var d2 = document.createElement("span");
                    d.appendChild(d2);
                    result.appendChild(d);
                    Markdown.simpleMarkdownAdd(a.block, d2, level + 1);
                    break;
                // border linkDef
                default:
                    console.log("unknown " + a.type);
                    console.log(a);
                    break;
            }
            if (item !== lastP && !addP)
                lastP = null;
            lastType = a.type;
            if (item !== null) {
                if (level === 0 && addP && lastP === null) {
                    lastP = document.createElement("p");
                    lastP.__skipBreak = true;
                    result.appendChild(lastP);
                }
                ((lastP !== null && addP) ? lastP : result).appendChild(item);
                if (a.block != null) {
                    Markdown.simpleMarkdownAdd(a.block, item, level + 1);
                }
            }
        }
    }
    static simpleMarkdownPreviewText(arr, maxSize = 100000) {
        var lastType = "";
        var str = "";
        for (var i = 0; i < arr.length; i++) {
            var a = arr[i];
            if (a.code != null)
                str += a.code;
            if (a.type === "break") {
                if (lastType !== "break" && str.length > 0 && str[str.length - 1] !== ' ')
                    str += " ";
            }
            else if (a.text != null) {
                str += a.text;
            }
            if (a.block != null && str.length < maxSize)
                str += Markdown.simpleMarkdownPreviewText(a.block, maxSize - str.length);
            if (str.length > maxSize)
                return str.substring(0, maxSize);
            lastType = a.type;
        }
        return str;
    }
    static markdown(text) { return (0, markdown_ast_1.default)(text); }
    static simpleMarkdown(text, result = null) {
        var ast = Markdown.markdown(text);
        var doc = document.createDocumentFragment();
        Markdown.simpleMarkdownAdd(ast, doc, 0);
        if (result)
            result.appendChild(doc);
        return doc;
    }
}
exports.Markdown = Markdown;
Markdown.imgPrepend = "";

},{"markdown-ast":29}],23:[function(require,module,exports){
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
exports.MessageManager = exports.UserOnlineStatus = exports.EventQueue = exports.LoginWithKeychain = exports.LoginKey = void 0;
const client_1 = require("./client");
const community_1 = require("./community");
const utils_1 = require("./utils");
const signable_message_1 = require("./signable-message");
const displayable_message_1 = require("./displayable-message");
const imports_1 = require("./content/imports");
class LoginKey {
    constructor(user, key) {
        this.user = user;
        this.key = utils_1.Utils.dhive().PrivateKey.fromString(key);
        this.publickey = this.key.createPublic('STM');
        this.keystring = key;
        this.publickeystring = this.publickey.toString();
    }
    decodePrivatePreferences(preferences) {
        return __awaiter(this, void 0, void 0, function* () {
            return preferences.getPrivatePreferencesWithKey(this.keystring);
        });
    }
    encodePrivatePreferences(preferences) {
        preferences.encodePrivatePreferencesWithKey(this.keystring, this.publickeystring);
    }
    encodeText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield imports_1.Content.encodeTextWithKey(this.keystring, this.publickeystring, text);
        });
    }
    decodeText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield imports_1.Content.decodeTextWithKey(this.keystring, text);
        });
    }
    encodeContent(content, user, groupUsers, keychainKeyType) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield content.encodeWithKey(user, groupUsers, keychainKeyType, this.keystring);
        });
    }
    signMessage(message, keychainKeyType) {
        return __awaiter(this, void 0, void 0, function* () {
            return message.signWithKey(this.key, keychainKeyType);
        });
    }
}
exports.LoginKey = LoginKey;
class LoginWithKeychain {
    constructor(user) {
        this.user = user;
    }
    decodePrivatePreferences(preferences) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield preferences.getPrivatePreferencesWithKeychain(this.user);
        });
    }
    encodePrivatePreferences(preferences) {
        return __awaiter(this, void 0, void 0, function* () {
            yield preferences.encodePrivatePreferencesWithKeychan(this.user);
        });
    }
    encodeContent(content, user, groupUsers, keychainKeyType) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield content.encodeWithKeychain(user, groupUsers, keychainKeyType);
        });
    }
    encodeText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield imports_1.Content.encodeTextWithKeychain(this.user, text);
        });
    }
    decodeText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield imports_1.Content.decodeTextWithKeychain(this.user, text);
        });
    }
    signMessage(message, keychainKeyType) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield message.signWithKeychain(keychainKeyType);
        });
    }
}
exports.LoginWithKeychain = LoginWithKeychain;
class EventQueue {
    constructor() {
        this.callbacks = {};
    }
    set(name, callback = null) {
        if (callback == null)
            delete this.callbacks[name];
        else
            this.callbacks[name] = callback;
    }
    post(message) {
        var callbacks = this.callbacks;
        for (var callbackName in callbacks) {
            try {
                callbacks[callbackName](message);
            }
            catch (e) {
                console.log(callbackName, e);
            }
        }
    }
}
exports.EventQueue = EventQueue;
class UserOnlineStatus {
    constructor(user, content, message, verified) {
        this.user = user;
        this.content = content;
        this.message = message;
        this.verified = verified;
    }
    isOnline() {
        return this.content && this.content.isOnline();
    }
}
exports.UserOnlineStatus = UserOnlineStatus;
class MessageManager {
    constructor() {
        this.userPreferences = null;
        this.onmessage = new EventQueue();
        this.onstatusmessage = new EventQueue();
        this.onpreferences = new EventQueue();
        this.onlastread = new EventQueue();
        this.oncommunityhide = new EventQueue();
        this.joined = {};
        this.cachedUserMessagesPromise = null;
        this.cachedUserMessages = null;
        this.cachedUserMessagesLoadedAll = false;
        this.cachedUserConversations = null;
        this.recentlySentEncodedContent = [];
        this.conversationsLastReadData = {};
        this.conversationsLastMessageTimestamp = {};
        this.cachedGroupLastMessageTimestamp = null;
        this.selectedCommunityPage = {};
        this.selectedConversation = null;
        this.selectedOnlineStatus = null;
        this.conversations = new utils_1.AccountDataCache();
        this.communities = new utils_1.AccountDataCache();
        this.onlineStatusTimer = null;
        this.cachedGuestData = null;
        this.keys = {};
        this.keychainPromise = null;
        this.pauseAutoDecode = false;
        this.defaultReadHistoryMS = 30 * 24 * 60 * 60000;
    }
    /*
    List of backend messaging nodes to connect to.
    */
    setNodes(nodes) {
        for (var i = 0; i < nodes.length; i++)
            nodes[i] = nodes[i].replace(/^http/, 'ws');
        this.nodes = nodes;
        this.connectionStart = true;
        this.nodeIndex = 0;
        this.connect();
    }
    setCallback(name, callback) {
        this.onmessage.set(name, callback);
    }
    postCallbackEvent(displayableMessage) {
        this.onmessage.post(displayableMessage);
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
            this.client.onupdate = function (data) {
                console.log("update", data);
            };
            this.client.onmessage = function (json) {
                return __awaiter(this, void 0, void 0, function* () {
                    var signableMessage = signable_message_1.SignableMessage.fromJSON(json);
                    if (signableMessage.getMessageType() !== signable_message_1.SignableMessage.TYPE_WRITE_MESSAGE) {
                        _this.handleMessage(signableMessage);
                        return;
                    }
                    var displayableMessage = yield _this.signableToDisplayable(signableMessage);
                    var conversation = displayableMessage.getConversation();
                    var lastRead = _this.conversationsLastReadData[conversation];
                    if (lastRead == null) {
                        lastRead = { number: 0, timestamp: 0 };
                        _this.conversationsLastReadData[conversation] = lastRead;
                    }
                    if (_this.selectedConversation === conversation)
                        _this.setLastRead(conversation, displayableMessage.getTimestamp());
                    else if (displayableMessage.getTimestamp() > lastRead.timestamp) {
                        lastRead.number++;
                        window.localStorage.setItem(_this.user + "#lastReadData", JSON.stringify(_this.conversationsLastReadData));
                    }
                    var data = _this.conversations.lookupValue(displayableMessage.getConversation());
                    if (conversation.indexOf('|') !== -1) {
                        if (_this.cachedUserConversations != null &&
                            _this.cachedUserConversations.indexOf(conversation) === -1)
                            _this.cachedUserConversations.unshift(conversation);
                        if (data == null) {
                            data = yield _this.getSelectedConversations(conversation);
                            if (data != null && (_this.hasMessage(data.encoded, displayableMessage) ||
                                _this.hasMessage(data.messages, displayableMessage)))
                                data = null;
                        }
                    }
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
                            delete data.status[displayableMessage.getUser()];
                            _this.onstatusmessage.post([displayableMessage.getUser(), displayableMessage.getConversation(), null, 0]);
                        }
                    }
                    _this.postCallbackEvent(displayableMessage);
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
    handleMessage(signableMessage) {
        console.log("msg", signableMessage);
        if (signableMessage.getMessageType() !== signable_message_1.SignableMessage.TYPE_MESSAGE)
            return;
        var content = signableMessage.getContent();
        if (content instanceof imports_1.OnlineStatus) {
            var status = [signableMessage.getUser(), signableMessage.getConversation(), content.getStatus(), signableMessage.getTimestamp()];
            if (signableMessage.isOnlineStatus()) {
                this.onstatusmessage.post(status);
            }
            else {
                var data = this.conversations.lookupValue(signableMessage.getConversation());
                if (data != null) {
                    data.status[signableMessage.getUser()] = status;
                    this.onstatusmessage.post(status);
                }
            }
        }
    }
    getClient() { return this.client; }
    setUser(user) {
        if (this.user == user)
            return;
        if (this.user != null) {
            this.userPreferences = null;
            this.cachedUserConversations = null;
        }
        this.user = user;
        try {
            var lastReadData = window.localStorage.getItem(user + "#lastReadData");
            if (lastReadData != null)
                this.conversationsLastReadData = JSON.parse(lastReadData);
        }
        catch (e) {
            console.log(e);
        }
        this.join(user);
        this.join('$online');
    }
    readGuest(username) {
        var guests = this.readGuests();
        if (guests[username] !== undefined)
            return [username, guests[username]];
        username = utils_1.Utils.parseGuest(username)[0];
        for (var name in guests)
            if (username === utils_1.Utils.parseGuest(name)[0])
                return [name, guests[name]];
        return null;
    }
    readGuests() {
        if (this.cachedGuestData != null)
            return this.cachedGuestData;
        var guestData = window.localStorage.getItem("#guestdata");
        var obj = (guestData == null) ? {} : JSON.parse(guestData);
        this.cachedGuestData = obj;
        return obj;
    }
    storeGuestLocally(user, key) {
        var guestData = this.readGuests();
        guestData[user] = key;
        window.localStorage.setItem("#guestdata", JSON.stringify(guestData));
    }
    createGuestAccount(username, publicPostingKey = null, storePrivateKeyLocally = null) {
        return __awaiter(this, void 0, void 0, function* () {
            var client = this.getClient();
            if (!utils_1.Utils.isValidGuestName(username))
                return new client_1.CallbackResult(false, 'username is not valid.');
            if (publicPostingKey == null) {
                var piKey = utils_1.Utils.dhive().PrivateKey.fromLogin(username, utils_1.Utils.createRandomPassword() + Math.random(), "posting");
                publicPostingKey = piKey.createPublic("STM").toString();
                storePrivateKeyLocally = piKey.toString();
            }
            try {
                var result = yield client.createGuestAccount(username, publicPostingKey);
                if (!result.isSuccess())
                    return result;
                var message = result.getResult();
                var guestUsername = message[2];
                if (publicPostingKey !== message[3])
                    return new client_1.CallbackResult(false, 'error creating account.');
                var preferences = imports_1.Content.preferences();
                var privatePref = preferences.getPrivatePreferencesWithKey(storePrivateKeyLocally);
                preferences.createGuestAccount(message);
                MessageManager.setupOnlineStatusGenerateOnlineKey(username, preferences, privatePref);
                preferences.encodePrivatePreferencesWithKey(storePrivateKeyLocally, publicPostingKey);
                var signableMessage = preferences.forUser(guestUsername);
                signableMessage.signWithKey(storePrivateKeyLocally, '@');
                var finalResult = yield client.write(signableMessage);
                if (finalResult.isSuccess()) {
                    this.storeGuestLocally(guestUsername, storePrivateKeyLocally);
                    return new client_1.CallbackResult(true, guestUsername);
                }
                return finalResult;
            }
            catch (e) {
                console.log(e);
            }
            return new client_1.CallbackResult(false, 'error creating account.');
        });
    }
    setOnlineStatusTimer(enabled) {
        if (enabled) {
            if (this.onlineStatusTimer != null)
                return;
            this.onlineStatusTimer = setInterval(() => {
                this.sendOnlineStatus("true");
            }, 5 * 60 * 1000);
        }
        else {
            if (this.onlineStatusTimer == null)
                return;
            clearInterval(this.onlineStatusTimer);
            this.onlineStatusTimer = null;
        }
    }
    joinGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            var groups = yield this.getJoinedAndCreatedGroups();
            for (var conversation in groups)
                this.join(conversation);
        });
    }
    joinCommunities(communities = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.user == null)
                return;
            if (communities === null)
                communities = yield this.getCommunities(this.user);
            var chanMap = {};
            for (var community of communities) {
                try {
                    var chan = community[0] + '/*';
                    this.join(chan);
                    chanMap[chan] = true;
                }
                catch (e) {
                    console.log(e);
                }
            }
            var chanList = Object.keys(chanMap);
            if (chanList.length > 0) {
                var client = this.getClient();
                var result = yield client.readStats(chanList);
                if (result.isSuccess()) {
                    this.conversationsLastMessageTimestamp = result.getResult()[1];
                }
                this.postCallbackEvent(null);
            }
            console.log("join communities ", chanList);
        });
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
            if (this.keychainPromise != null) {
                try {
                    return yield this.keychainPromise;
                }
                catch (e) {
                    console.log(e);
                }
            }
            var promise = this.loginmethod.decodePrivatePreferences(p);
            this.keychainPromise = promise;
            try {
                var preferences = yield promise;
            }
            catch (e) {
                console.log(e);
                this.keychainPromise = null;
            }
            return preferences;
        });
    }
    storeKeyLocallyEncrypted(group, key) {
        return __awaiter(this, void 0, void 0, function* () {
            var encodedText = yield this.loginmethod.encodeText(key);
            window.localStorage.setItem(this.user + "|" + group, encodedText);
            var keys = this.keys;
            keys[group] = key;
        });
    }
    storeKeyGloballyInPrivatePreferences(group, key) {
        return __awaiter(this, void 0, void 0, function* () {
            var pref = yield this.getPreferences();
            var privatePref = yield this.getPrivatePreferences();
            privatePref.setKeyFor(group, key);
            return yield this.updatePreferences(pref);
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
                    keys[group] = key = yield this.loginmethod.decodeText(text);
                }
            }
            return key;
        });
    }
    renameGroup(group, name) {
        return __awaiter(this, void 0, void 0, function* () {
            var array = utils_1.Utils.parseGroupConversation(group);
            if (array == null)
                return false;
            var pref = yield this.getPreferences();
            var groupData = pref.getGroup(array[2]);
            if (groupData == null)
                return false;
            if (groupData['name'] !== name) {
                groupData['name'] = name;
                yield this.updatePreferences(pref);
            }
            return true;
        });
    }
    closeGroup(group) {
        return __awaiter(this, void 0, void 0, function* () {
            var pref = yield this.getPreferences();
            yield this.loginmethod.decodePrivatePreferences(pref);
            pref = pref.copy();
            var privatePref = pref.privatePreferences;
            privatePref.setKeyFor(group, null);
            var updateRequired = privatePref.updated;
            var groupConversation = utils_1.Utils.parseGroupConversation(group);
            if (groupConversation != null) {
                var username = groupConversation[1];
                var id = groupConversation[2];
                if (username === this.user) {
                    if (pref.getGroup(id) != null) {
                        pref.setGroup(id, null);
                        updateRequired = true;
                    }
                }
            }
            if (updateRequired)
                yield this.updatePreferences(pref);
        });
    }
    updatePreferences(preferences) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.user == null)
                return null;
            yield this.loginmethod.encodePrivatePreferences(preferences);
            var signableMessage = preferences.forUser(this.user);
            yield this.loginmethod.signMessage(signableMessage, 'Posting');
            var client = this.getClient();
            var result = yield client.write(signableMessage);
            if (result.isSuccess()) {
                this.userPreferences = preferences;
                this.onpreferences.post(preferences);
            }
            return result;
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
    setLogin(login) { this.loginmethod = login; }
    setLoginKey(postingkey) { this.loginmethod = new LoginKey(this.user, postingkey); }
    setUseKeychain() { this.loginmethod = new LoginWithKeychain(this.user); }
    getSelectedCommunityPage(community, defaultPage = null) {
        var page = this.selectedCommunityPage[community];
        return page == null ? defaultPage : page;
    }
    setSelectedCommunityPage(community, page) {
        this.selectedCommunityPage[community] = page;
    }
    setConversation(conversation) {
        this.selectedConversation = conversation;
        if (conversation != null)
            this.join(conversation);
    }
    setSelectedOnlineStatus(writing) {
        return __awaiter(this, void 0, void 0, function* () {
            var conversation = this.selectedConversation;
            if (conversation) {
                if (conversation === this.selectedOnlineStatus) {
                    if (!writing) {
                        yield this.sendOnlineStatus(null, conversation);
                        this.selectedOnlineStatus = null;
                    }
                }
                else {
                    if (writing) {
                        if (this.selectedOnlineStatus !== null)
                            yield this.sendOnlineStatus(null, this.selectedOnlineStatus);
                        yield this.sendOnlineStatus('writing', conversation);
                        this.selectedOnlineStatus = conversation;
                    }
                }
            }
        });
    }
    getSelectedWritingUsers(conversation = this.selectedConversation, time = 300000) {
        var result = [];
        if (conversation != null) {
            var data = this.conversations.lookupValue(conversation);
            if (data != null) {
                var minTime = utils_1.Utils.utcTime() - time;
                for (var user in data.status) {
                    var status = data.status[user];
                    if (status[2] != null && status[3] >= minTime)
                        result.push(user);
                }
            }
        }
        return result;
    }
    addCommunity(community, add = true, user = this.user) {
        var obj = this.loadCommunityHiddenLocally(user);
        if (obj === null)
            obj = {};
        if (add)
            obj[community] = false;
        else
            delete obj[community];
        this.storeCommunityHiddenLocally(obj, user);
    }
    hideCommunity(community, hide = true, user = this.user) {
        var obj = this.loadCommunityHiddenLocally(user);
        if (obj === null)
            obj = {};
        if (hide)
            obj[community] = true;
        else
            delete obj[community];
        this.storeCommunityHiddenLocally(obj, user);
    }
    storeCommunityHiddenLocally(hidden, user = this.user) {
        window.localStorage.setItem(user + "|hiddenCommunity|", JSON.stringify(hidden));
        this.oncommunityhide.post(hidden);
    }
    loadCommunityHiddenLocally(user = this.user) {
        try {
            var str = window.localStorage.getItem(user + "|hiddenCommunity|");
            if (str == null)
                return null;
            var result = JSON.parse(str);
            if (typeof result === 'object' && result.constructor === Object)
                return result;
        }
        catch (e) {
            console.log(e);
        }
        return null;
    }
    storeCommunitySortOrderLocally(sortOrder, user = this.user) {
        window.localStorage.setItem(user + "|sortOrder|", JSON.stringify(sortOrder));
    }
    loadCommunitySortOrderLocally(user = this.user) {
        try {
            var str = window.localStorage.getItem(user + "|sortOrder|");
            if (str == null)
                return null;
            var result = JSON.parse(str);
            if (Array.isArray(result))
                return result;
        }
        catch (e) {
            console.log(e);
        }
        return null;
    }
    getCommunitiesHidden(user = this.user) {
        return __awaiter(this, void 0, void 0, function* () {
            var tmpArray = [];
            var array = yield this.getCommunities(user);
            var hide = this.loadCommunityHiddenLocally(user);
            if (hide != null) {
                for (var item of array) {
                    if (hide[item[0]] === true)
                        tmpArray.push(item);
                }
                return tmpArray;
            }
            return tmpArray;
        });
    }
    getCommunitiesSorted(user = this.user, sortOrder = null, applyHide = true, prepend = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sortOrder == null)
                sortOrder = this.loadCommunitySortOrderLocally(user);
            var array = yield this.getCommunities(user);
            var added = {};
            for (var item of array)
                added[item[0]] = true;
            var hide = null;
            var tmpPrepend = [];
            if (prepend != null)
                for (var community of prepend) {
                    if (added[community])
                        continue;
                    added[community] = true;
                    var title = "";
                    try {
                        var community0 = yield community_1.Community.load(community);
                        title = community0.getTitle();
                    }
                    catch (e) {
                        console.log(e);
                    }
                    tmpPrepend.push([community, title, "guest", ""]);
                }
            if (applyHide && (hide = this.loadCommunityHiddenLocally(user)) != null) {
                for (var community in hide) {
                    if (hide[community] === false && !added[community]) {
                        added[community] = true;
                        var title = "";
                        try {
                            var community0 = yield community_1.Community.load(community);
                            title = community0.getTitle();
                        }
                        catch (e) {
                            console.log(e);
                        }
                        tmpPrepend.push([community, title, "guest", ""]);
                    }
                }
            }
            array = tmpPrepend.concat(array);
            var sortedArray = [];
            var tmpArray = [];
            for (var item of array) {
                if (hide != null && hide[item[0]] === true)
                    continue;
                var index = sortOrder != null ? sortOrder.indexOf(item[0]) : -1;
                if (index === -1)
                    sortedArray.push(item);
                else
                    tmpArray[index] = item;
            }
            for (var item of tmpArray)
                if (item != null)
                    sortedArray.push(item);
            for (var item of array)
                if (item.account == null)
                    item.account = yield utils_1.Utils.getAccountData(item[0]);
            return sortedArray;
        });
    }
    getCommunities(user = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user === null)
                user = this.user;
            if (user == null)
                return null;
            var _this = this;
            return yield this.communities.cacheLogic(user, (user) => {
                var promise = (utils_1.Utils.isGuest(user)) ? utils_1.Utils.getAccountPreferences(user).then((preferences) => __awaiter(this, void 0, void 0, function* () {
                    var array = (preferences == null) ? [] : preferences.getCommunities();
                    var result = [];
                    for (var name of array) {
                        var data = yield utils_1.Utils.getCommunityData(name);
                        result.push([name, data.title, '', '']);
                    }
                    return result;
                })) : utils_1.Utils.getDhiveClient().hivemind.listAllSubscriptions({ "account": user });
                return promise.then((array) => __awaiter(this, void 0, void 0, function* () {
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
    getCachedGroupTimestamps(conversations) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cachedGroupLastMessageTimestamp == null) {
                try {
                    var client = this.getClient();
                    var result = yield client.readStats(conversations);
                    if (result.isSuccess())
                        this.cachedGroupLastMessageTimestamp = result.getResult()[1];
                }
                catch (e) {
                    console.log(e);
                }
            }
            return this.cachedGroupLastMessageTimestamp;
        });
    }
    getJoinedAndCreatedGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            var pref = yield this.getPreferences();
            var privatePref = yield this.getPrivatePreferences();
            var groups = {};
            var joinedGroup = privatePref.keys();
            for (var conversation in joinedGroup) {
                if (groups[conversation] !== undefined)
                    continue;
                var groupConversation = utils_1.Utils.parseGroupConversation(conversation);
                if (groupConversation == null)
                    continue;
                var username = groupConversation[1];
                var id = groupConversation[2];
                groups[conversation] = {
                    conversation, username, id, lastReadNumber: 0, timestamp: 0, plus: ''
                };
            }
            for (var groupId in pref.getGroups()) {
                var conversation = '#' + this.user + '/' + groupId;
                if (groups[conversation] !== undefined)
                    continue;
                groups[conversation] = {
                    conversation, "username": this.user, "id": groupId,
                    lastReadNumber: 0, timestamp: 0, plus: ''
                };
            }
            for (var conversation in groups) {
                var lastRead = this.getLastRead(conversation);
                if (lastRead != null) {
                    groups[conversation].lastReadNumber = lastRead.number;
                    groups[conversation].timestamp = lastRead.timestamp;
                }
            }
            var stats = yield this.getCachedGroupTimestamps(Object.keys(groups));
            if (stats != null) {
                for (var group in groups) {
                    var timestamp = stats[group];
                    if (timestamp !== undefined && timestamp > groups[group].timestamp) {
                        groups[group].timestamp = timestamp;
                        groups[group].lastReadNumber = Math.max(1, groups[group].lastReadNumber);
                        groups[group].plus = '+';
                        var lastRead = this.getLastRead(group);
                        if (lastRead != null)
                            lastRead.number = Math.max(1, lastRead.number);
                        else
                            this.setLastRead(group, 0, 1);
                    }
                }
            }
            return groups;
        });
    }
    getLastReadNumber(conversation) {
        var lastRead = this.conversationsLastReadData[conversation];
        return lastRead == null ? 0 : lastRead.number;
    }
    getLastRead(conversation) {
        var lastRead = this.conversationsLastReadData[conversation];
        return lastRead == null ? null : lastRead;
    }
    setLastRead(conversation, timestamp, number = 0) {
        var refreshNeeded = false;
        var lastRead = this.conversationsLastReadData[conversation];
        if (lastRead == null)
            this.conversationsLastReadData[conversation] = { number: number, timestamp: timestamp };
        else {
            refreshNeeded = number === 0 && lastRead.number > 0;
            lastRead.number = number;
            lastRead.timestamp = timestamp;
        }
        window.localStorage.setItem(this.user + "#lastReadData", JSON.stringify(this.conversationsLastReadData));
        if (refreshNeeded)
            this.onlastread.post(lastRead);
        return refreshNeeded;
    }
    getLastReadTotalConversations() {
        return __awaiter(this, void 0, void 0, function* () {
            var conversations = yield this.readUserConversations();
            var number = 0;
            for (var conversation of conversations) {
                var lastRead = this.getLastRead(conversation);
                if (lastRead != null && lastRead.number > 0)
                    number++;
            }
            var groups = yield this.getJoinedAndCreatedGroups();
            for (var conversation in groups)
                if (groups[conversation].lastReadNumber > 0)
                    number++;
            return number;
        });
    }
    getLastReadTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var numberOfPrivateMessages = yield this.getLastReadOfUserConversations();
            var numberOfGroupMessages = yield this.getLastReadOfGroupConversations();
            return numberOfPrivateMessages + numberOfGroupMessages;
        });
    }
    getLastReadOfGroupConversations() {
        return __awaiter(this, void 0, void 0, function* () {
            var groups = yield this.getJoinedAndCreatedGroups();
            var number = 0;
            for (var conversation in groups)
                number += groups[conversation].lastReadNumber;
            return number;
        });
    }
    getLastReadOfUserConversations() {
        return __awaiter(this, void 0, void 0, function* () {
            var conversations = yield this.readUserConversations();
            var number = 0;
            for (var conversation of conversations) {
                var lastRead = this.getLastRead(conversation);
                if (lastRead != null)
                    number += lastRead.number;
            }
            return number;
        });
    }
    getLastReadCommunityStream(conversation) {
        return __awaiter(this, void 0, void 0, function* () {
            var lastRead = this.getLastRead(conversation);
            var number = 0;
            if (lastRead != null)
                number += lastRead.number;
            var timestamp = this.conversationsLastMessageTimestamp[conversation];
            if (timestamp != null) {
                if (lastRead == null || lastRead.timestamp < timestamp) {
                    if (lastRead == null)
                        this.setLastRead(conversation, 0, number = 1);
                    else
                        lastRead.number = number = Math.max(1, lastRead.number);
                    return number + '+';
                }
            }
            return "" + number;
        });
    }
    getLastReadCommunity(community) {
        return __awaiter(this, void 0, void 0, function* () {
            var communityStreams = community + '/';
            var data = this.conversationsLastReadData;
            var number = 0;
            for (var conversation in data) {
                if (conversation === community || conversation.startsWith(communityStreams)) {
                    var lastRead = data[conversation];
                    if (lastRead != null)
                        number += lastRead.number;
                }
            }
            var plus = '';
            var timestamps = this.conversationsLastMessageTimestamp;
            for (var conversation in timestamps) {
                if (conversation === community || conversation.startsWith(communityStreams)) {
                    var lastRead = data[conversation];
                    var timestamp = timestamps[conversation];
                    if (lastRead == null || lastRead.timestamp < timestamp) {
                        number++;
                        plus = '+';
                    }
                }
            }
            return number + plus;
        });
    }
    getPreviousConversations(conversation = this.selectedConversation) {
        return __awaiter(this, void 0, void 0, function* () {
            if (conversation == null)
                return null;
            var data = yield this.getSelectedConversations(conversation);
            if (data && data.maxTime > 0) {
                var client = this.getClient();
                var isPrivate = conversation.indexOf('|') !== -1;
                var promise = null;
                var timeNow = utils_1.Utils.utcTime();
                var maxTime = timeNow + 600000;
                for (var msg0 of data.messages)
                    maxTime = Math.min(maxTime, msg0.getTimestamp());
                if (isPrivate) {
                    for (var msg0 of data.encoded)
                        maxTime = Math.min(maxTime, msg0.getTimestamp());
                    var result = yield client.readUserMessages(this.user, 0, maxTime);
                    if (!result.isSuccess())
                        throw result.getError();
                    var messages = yield this.toDisplayable(result);
                    var added = 0;
                    for (var msg of messages)
                        if (!this.hasMessage(this.cachedUserMessages, msg)) {
                            this.cachedUserMessages.push(msg);
                            added++;
                        }
                    if (added > 0) {
                        this.resolveReferences(this.cachedUserMessages);
                        this.cachedUserMessages.sort((a, b) => a.getTimestamp() - b.getTimestamp());
                        data.maxTime = maxTime;
                        this.postCallbackEvent(null);
                    }
                    else {
                        this.cachedUserMessagesLoadedAll = true;
                        data.maxTime = 0;
                    }
                    return data;
                }
                else {
                    var minTime = 0;
                    if (utils_1.Utils.isJoinableGroupConversation(conversation))
                        minTime = yield utils_1.Utils.getGroupTimestamp(conversation);
                    var result = yield client.read(conversation, minTime, maxTime);
                    if (!result.isSuccess())
                        throw result.getError();
                    var messages = yield this.toDisplayable(result);
                    var added = 0;
                    for (var msg of messages)
                        if (!this.hasMessage(data.messages, msg)) {
                            data.messages.push(msg);
                            added++;
                        }
                    if (added > 0) {
                        yield this.resolveReferences(data.messages);
                        data.messages.sort((a, b) => a.getTimestamp() - b.getTimestamp());
                        data.maxTime = maxTime;
                        this.postCallbackEvent(null);
                    }
                    else {
                        data.maxTime = 0;
                    }
                }
                return data;
            }
            return data == null ? null : data;
        });
    }
    getSelectedConversations(conversation = this.selectedConversation) {
        return __awaiter(this, void 0, void 0, function* () {
            if (conversation == null)
                return null;
            var isPrivate = conversation.indexOf('|') !== -1;
            var _this = this;
            return yield this.conversations.cacheLogic(conversation, (conversation) => {
                var client = _this.getClient();
                var timeNow = utils_1.Utils.utcTime();
                var maxTime = timeNow + 600000;
                var promise = null;
                if (isPrivate) {
                    if (_this.cachedUserMessagesPromise == null) {
                        promise = _this.cachedUserMessagesPromise = _this.readUserMessages().then((result) => {
                            this.cachedUserMessages = result;
                            this.cachedUserMessagesLoadedAll = false;
                            return result;
                        });
                    }
                    else if (_this.cachedUserMessages == null)
                        promise = _this.cachedUserMessagesPromise;
                    else
                        promise = Promise.resolve(_this.cachedUserMessages);
                    promise = promise.then((allMessages) => {
                        var messages0 = allMessages.filter((m) => m.getConversation() === conversation);
                        var messages = messages0.filter((m) => !m.isEncoded());
                        var encoded = messages0.filter((m) => m.isEncoded());
                        if (_this.cachedUserMessagesLoadedAll)
                            maxTime = 0;
                        return { messages, encoded, maxTime, status: {} };
                    });
                }
                else {
                    var readFrom = utils_1.Utils.isJoinableGroupConversation(conversation) ?
                        utils_1.Utils.getGroupTimestamp(conversation) : Promise.resolve(0);
                    promise = readFrom.then((minTime) => {
                        return client.read(conversation, minTime, /*timeNow-_this.defaultReadHistoryMS; */ maxTime);
                    }).then((result) => {
                        if (!result.isSuccess())
                            throw result.getError();
                        return _this.toDisplayable(result);
                    }).then((messages) => {
                        _this.resolveReferences(messages);
                        if (messages.length < 100)
                            maxTime = 0;
                        return { messages, maxTime, status: {} };
                    });
                }
                return promise;
            });
        });
    }
    getThreads() {
        return __awaiter(this, void 0, void 0, function* () {
            var map = {};
            var data = yield this.getSelectedConversations();
            if (!data || !data['messages'])
                return map;
            for (var msg of data['messages'])
                if (msg.isThread()) {
                    var threadName = msg.getThreadName();
                    if (map[threadName] === undefined)
                        map[threadName] = [msg];
                    else
                        map[threadName].push(msg);
                }
            return map;
        });
    }
    readUserConversations() {
        return __awaiter(this, void 0, void 0, function* () {
            var user = this.user;
            if (user === null)
                return [];
            var conversations = this.cachedUserConversations;
            if (conversations != null)
                return conversations;
            var client = this.getClient();
            var result = yield client.readUserConversations(user);
            if (!result.isSuccess())
                throw result.getError();
            conversations = result.getResult();
            this.cachedUserConversations = conversations;
            return conversations;
        });
    }
    readCachedUserMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cachedUserMessagesPromise == null) {
                this.cachedUserMessagesPromise = this.readUserMessages().then((result) => {
                    this.cachedUserMessages = result;
                    this.cachedUserMessagesLoadedAll = false;
                    return result;
                });
            }
            if (this.cachedUserMessages == null)
                yield this.cachedUserMessagesPromise;
            return this.cachedUserMessages;
        });
    }
    readUserMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            var user = this.user;
            if (user === null)
                return [];
            var client = this.getClient();
            var timeNow = utils_1.Utils.utcTime();
            var result = yield client.readUserMessages(user, 0, /*timeNow-this.defaultReadHistoryMS,*/ timeNow + 600000);
            if (!result.isSuccess())
                throw result.getError();
            var messages = yield this.toDisplayable(result);
            this.resolveReferences(messages);
            return messages;
        });
    }
    readOnlineUsers(users, verifyOnlineMessages = false) {
        return __awaiter(this, void 0, void 0, function* () {
            var usersMap = {};
            if (users.length === 0)
                return usersMap;
            var maxTime = utils_1.Utils.utcTime() - 7 * 60 * 1000; //7 minutes    
            var client = this.getClient();
            for (var user of users)
                usersMap[user] = null;
            var onlineResult = yield client.readOnlineStatus(users, maxTime);
            if (onlineResult.isSuccess()) {
                var online = onlineResult.getResult();
                for (var json of online) {
                    var username = json[1];
                    var isOnline = false;
                    try {
                        var message = signable_message_1.SignableMessage.fromJSON(json);
                        if (!verifyOnlineMessages || (yield message.verify())) {
                            var content = message.getContent();
                            if (content instanceof imports_1.OnlineStatus) {
                                isOnline = content.isOnline();
                                json.online = isOnline;
                            }
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                    usersMap[username] = isOnline;
                }
            }
            return usersMap;
        });
    }
    readOnlineUsersCommunity(community, verifyOnlineMessages = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof community === 'string')
                community = yield community_1.Community.load(community);
            var roles = community.listRoles();
            var maxTime = utils_1.Utils.utcTime() - 7 * 60 * 1000; //7 minutes      
            var client = this.getClient();
            var onlineResult = yield client.readOnlineStatusForCommunity(community.getName(), maxTime);
            if (onlineResult.isSuccess()) {
                var online = onlineResult.getResult();
                //var onlineMap = {};
                var role = {};
                var title = {};
                var added = {};
                var _online = [];
                for (var json of online) {
                    var username = json[1];
                    //onlineMap[username] = json;
                    var isOnline = false;
                    try {
                        var message = signable_message_1.SignableMessage.fromJSON(json);
                        if (!verifyOnlineMessages || (yield message.verify())) {
                            var content = message.getContent();
                            if (content instanceof imports_1.OnlineStatus) {
                                isOnline = content.isOnline();
                                json.online = isOnline;
                            }
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                    if (isOnline) {
                        added[username] = true;
                        if (roles[username] != null) {
                            var userRole = roles[username][1];
                            var userTitles = roles[username][2];
                            if (userRole != "") {
                                if (role[userRole] === undefined)
                                    role[userRole] = [];
                                role[userRole].push([username, userRole, userTitles, true]);
                            }
                            if (userTitles != null)
                                for (var userTitle of userTitles) {
                                    if (title[userTitle] === undefined)
                                        title[userTitle] = [];
                                    title[userTitle].push([username, userRole, userTitles, true]);
                                }
                        }
                        else {
                            _online.push([username, "", [], true]);
                        }
                    }
                }
                for (var user in roles) {
                    if (added[user])
                        continue;
                    var roleData = roles[user];
                    var userRole = roleData[1];
                    var userTitles = roleData[2];
                    if (userRole != "") {
                        if (role[userRole] === undefined)
                            role[userRole] = [];
                        role[userRole].push([user, userRole, userTitles, false]);
                    }
                    if (userTitles != null)
                        for (var userTitle of userTitles) {
                            if (title[userTitle] === undefined)
                                title[userTitle] = [];
                            title[userTitle].push([user, userRole, userTitles, false]);
                        }
                }
                return { role, title, online: _online };
            }
            return null;
        });
    }
    setupOnlineStatus(enabled, storeLocally = false, onlinePrivateKey = null, onlinePublicKey = null) {
        return __awaiter(this, void 0, void 0, function* () {
            var pref = yield this.getPreferences();
            pref.setValue("showOnline:b", enabled);
            if (enabled) {
                var onlineKey = yield this.getKeyFor('$');
                if (pref.getValue("$:s", null) == null || onlineKey == null) {
                    if (onlinePrivateKey == null && onlinePublicKey == null) {
                        var entropy = utils_1.Utils.createRandomPassword() + Math.random();
                        var privateK = utils_1.Utils.dhive().PrivateKey.fromLogin(this.user, entropy, 'online');
                        var publicK = privateK.createPublic('STM');
                        onlinePrivateKey = privateK.toString();
                        onlinePublicKey = publicK.toString();
                    }
                    pref.setValue("$:s", onlinePublicKey);
                    if (storeLocally)
                        yield this.storeKeyLocallyEncrypted('$', onlinePrivateKey);
                    else
                        return yield this.storeKeyGloballyInPrivatePreferences('$', onlinePrivateKey);
                }
            }
            return yield this.updatePreferences(pref);
        });
    }
    static setupOnlineStatusGenerateOnlineKey(user, pref, privatePref, onlinePrivateKey = null, onlinePublicKey = null) {
        pref.setValue("showOnline:b", true);
        if (onlinePrivateKey == null && onlinePublicKey == null) {
            var entropy = utils_1.Utils.createRandomPassword() + Math.random();
            var privateK = utils_1.Utils.dhive().PrivateKey.fromLogin(user, entropy, 'online');
            var publicK = privateK.createPublic('STM');
            onlinePrivateKey = privateK.toString();
            onlinePublicKey = publicK.toString();
        }
        pref.setValue("$:s", onlinePublicKey);
        privatePref.setKeyFor('$', onlinePrivateKey);
    }
    sendOnlineStatus(online, conversation = '$online') {
        return __awaiter(this, void 0, void 0, function* () {
            var user = this.user;
            if (user === null)
                return null;
            var onlineKey = yield this.getKeyFor('$');
            if (onlineKey === null) {
                console.log("unknown key");
                return null;
            }
            var communities = [];
            var communities2 = yield this.getCommunities(user);
            if (communities2 != null)
                for (var community of communities2)
                    communities.push(community[0]);
            var msg = signable_message_1.SignableMessage.create(user, conversation, imports_1.Content.onlineStatus(online, communities), signable_message_1.SignableMessage.TYPE_MESSAGE);
            msg.signWithKey(onlineKey, '$');
            var client = this.getClient();
            return yield client.write(msg);
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
                var encoded = yield this.loginmethod.encodeContent(msg, user, conversation, keychainKeyType);
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
            yield this.loginmethod.signMessage(signableMessage, keychainKeyType);
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
            if (content instanceof imports_1.Thread)
                content = content.getContent();
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
                        else if (content instanceof imports_1.Flag) {
                            m.flag(msg);
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
            var list0 = [];
            var list = [];
            var array = result.getResult();
            try {
                var batchLoad = {};
                for (var msgJSON of array) {
                    try {
                        var msg = signable_message_1.SignableMessage.fromJSON(msgJSON);
                        if (msg.isSignedWithGroupKey()) {
                            var key = yield this.getKeyFor(msg.getConversation());
                            if (key === null) {
                                console.log("key not found.");
                                continue;
                            }
                            msg.decodeWithKey(key);
                        }
                        list0.push(msg);
                        var user = msg.getUser();
                        if (!utils_1.Utils.isGuest(user))
                            batchLoad[user] = true;
                    }
                    catch (e) {
                        console.log("Error parsing message: ", msgJSON);
                        console.log(e);
                    }
                }
                var batchArray = Object.keys(batchLoad);
                if (batchArray.length > 0)
                    utils_1.Utils.preloadAccountData(batchArray); //no need to await
            }
            catch (e) {
                console.log("error preloading account data");
                console.log(e);
            }
            for (var msg of list0) {
                try {
                    list.push(yield this.signableToDisplayable(msg));
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
    hasMessage(messages, message) {
        if (messages != null && message != null)
            for (var msg of messages)
                if (msg.getTimestamp() === message.getTimestamp() &&
                    msg.getUser() === message.getUser() &&
                    msg.message.getSignature().equals(message.message.getSignature()))
                    return true;
        return false;
    }
    jsonToDisplayable(msgJSON) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.signableToDisplayable(signable_message_1.SignableMessage.fromJSON(msgJSON));
        });
    }
    signableToDisplayable(msg) {
        return __awaiter(this, void 0, void 0, function* () {
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
            if (content instanceof imports_1.Thread) {
                var threadContent = content.getContent();
                if (threadContent instanceof imports_1.Edit) {
                    var editContent = threadContent.getEdit();
                    displayableMessage.editContent = imports_1.Content.thread(content.getName(), (editContent == null) ? null : imports_1.Content.fromJSON(editContent));
                    displayableMessage.isEdit = true;
                }
            }
            else if (content instanceof imports_1.Edit) {
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
                var encodedArray = data.encoded;
                var toAdd = [];
                try {
                    while (encodedArray.length > 0) {
                        var encodedMessage = encodedArray.shift();
                        try {
                            var decodedMessage = yield this.decode(encodedMessage);
                            data.messages.push(decodedMessage);
                            this.resolveReference(data.messages, decodedMessage);
                            this.postCallbackEvent(decodedMessage);
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
                    this.postCallbackEvent(decodedMessage);
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

},{"./client":1,"./community":2,"./content/imports":10,"./displayable-message":21,"./signable-message":25,"./utils":28}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionSet = void 0;
class PermissionSet {
    constructor() {
        this.role = "";
        this.titles = [];
    }
    validateRole(role) { return PermissionSet.roleToIndex(this.role) <= PermissionSet.roleToIndex(role); }
    validateTitles(titles) {
        var arr = this.titles;
        var matches = true;
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item === '|') {
                if (matches)
                    return true;
                matches = true;
            }
            else if (matches && (!titles || titles.indexOf(item) === -1))
                matches = false;
        }
        return matches;
    }
    validate(role, titles) {
        return this.validateRole(role) && this.validateTitles(titles);
    }
    isEmpty() {
        return this.role === "" && this.titles.length === 0;
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
    static roleToIndex(role) {
        switch (role) {
            case "owner": return 7;
            case "admin": return 6;
            case "mod": return 5;
            case "member": return 4;
            case "guest": return 3;
            case "joined": return 2;
            case "onboard": return 1;
        }
        return 0;
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

},{}],25:[function(require,module,exports){
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
    static create(user, conversation, json, type = 'w') {
        var s = new SignableMessage();
        s.setMessageType(type);
        s.setUser(user);
        s.setConversation(conversation);
        s.setJSON(json);
        return s;
    }
    setMessageType(type) { this.type = type; }
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
    getConversationUsername() {
        var i = this.conversation.indexOf('/');
        return (i === -1) ? this.conversation : this.conversation.substring(0, i);
    }
    getJSONString() { return this.json; }
    getContent() { return imports_1.Content.fromJSON(JSON.parse(this.json)); }
    getTimestamp() { return this.timestamp; }
    getGroupUsernames() { return utils_1.Utils.getGroupUsernames(this.conversation); }
    isCommunityConversation() { return utils_1.Utils.isCommunityConversation(this.conversation); }
    isGroupConversation() { return utils_1.Utils.isGroupConversation(this.conversation); }
    isJoinableGroupConversation() { return utils_1.Utils.isJoinableGroupConversation(this.conversation); }
    isEncrypted() { return this.conversation.startsWith("#"); }
    isPreference() { return this.conversation === "@"; }
    isOnlineStatus() { return this.conversation === "$online"; }
    isSigned() { return this.signature != null; }
    isSignedWithMemo() { return this.keytype === "m"; }
    isSignedWithPosting() { return this.keytype === "p"; }
    isSignedWithGroupKey() { return this.keytype === "g"; }
    isSignedWithGuestKey() { return this.keytype === "@"; }
    isSignedWithPreferencesKey() { return this.keytype.startsWith("$"); }
    getSignature() { return this.signature; }
    getSignatureHex() { return this.signature == null ? null : this.signature.toString('hex'); }
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
        return utils_1.Utils.dhive().cryptoUtils.sha256(this.toSignableTextFormat());
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
        if (array.length > 0)
            switch (array.length) {
                default:
                case 7: message.signature = utils_1.Utils.Buffer().from(array[6], 'hex');
                case 6: message.keytype = array[5];
                case 5: message.timestamp = array[4];
                case 4: message.setJSON(array[3]);
                case 3: message.setConversation(array[2]);
                case 2: message.setUser(array[1]);
                case 1: message.type = array[0];
            }
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
            privateK = utils_1.Utils.dhive().PrivateKey.fromString(privateK);
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
        this.signature = utils_1.Utils.Buffer().from(msg[3], 'hex');
        return this;
    }
    signWithKey(privateK, keytype) {
        var _this = this;
        this.timestamp = utils_1.Utils.utcTime();
        this.validateDataLength();
        var keytype0 = keytype.toLowerCase();
        this.keytype = (keytype0 === "posting") ? "p" : (keytype0 === "memo" ? "m" : keytype);
        if (typeof privateK === 'string')
            privateK = utils_1.Utils.dhive().PrivateKey.fromString(privateK);
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
                    _this.signature = utils_1.Utils.Buffer().from(result.result, 'hex');
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
            if (this.getMessageType() === SignableMessage.TYPE_ACCOUNT) {
                var validators = utils_1.Utils.getGuestAccountValidators();
                if (this.isSignedWithGuestKey()) {
                    for (var publicKey of validators)
                        if (publicKey.length >= 50 && this.verifyWithKey(publicKey))
                            return true;
                    return false;
                }
                else {
                    if (validators.indexOf(user) === -1)
                        return false;
                }
            }
            else if (this.getMessageType() === SignableMessage.TYPE_MESSAGE) {
                if (this.isSignedWithPreferencesKey()) {
                    var accountPreferences = yield utils_1.Utils.getAccountPreferences(user);
                    if (accountPreferences == null)
                        return false;
                    var publicKey = accountPreferences.getValueString(this.keytype);
                    return (publicKey == null) ? false : this.verifyWithKey(publicKey);
                }
            }
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
                return (key.key == null) ? false : this.verifyWithKey(key.key);
            }
            else if (utils_1.Utils.isGuest(user) && this.isPreference()) {
                try {
                    var preferences = this.getContent();
                    if (preferences instanceof imports_1.Preferences)
                        return yield preferences.verifyAccount(user);
                }
                catch (e) {
                    console.log(e);
                }
                return false;
            }
            else {
                var accountData = yield utils_1.Utils.getAccountData(user);
                if (accountData === null)
                    return false;
                if (accountData === undefined) {
                    console.log("error: undefined account data for user ", user);
                    return false;
                }
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
        var signature = utils_1.Utils.dhive().Signature.fromBuffer(this.getSignature());
        for (var i = 0; i < keys.length; i++) {
            var key = utils_1.Utils.dhive().PublicKey.fromString(keys[i][0]);
            if (key.verify(messageHash, signature))
                return true;
        }
        return false;
    }
    verifyWithKey(publicKey) {
        //var signature = Signature.fromString(this.getSignature());
        var signature = utils_1.Utils.dhive().Signature.fromBuffer(this.getSignature());
        if (typeof publicKey === 'string')
            publicKey = utils_1.Utils.dhive().PublicKey.fromString(publicKey);
        return publicKey.verify(this.toSignableHash(), signature);
    }
    verifyPermissions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield utils_1.Utils.verifyPermissions(this.getUser(), this.getConversation());
        });
    }
}
exports.SignableMessage = SignableMessage;
SignableMessage.TYPE_ACCOUNT = 'a';
SignableMessage.TYPE_MESSAGE = 'm';
SignableMessage.TYPE_WRITE_MESSAGE = 'w';

},{"./content/imports":10,"./utils":28}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
const community_1 = require("./community");
const imports_1 = require("./content/imports");
const displayable_message_1 = require("./displayable-message");
const message_manager_1 = require("./message-manager");
const markdown_1 = require("./markdown");
const utils_1 = require("./utils");
const signable_message_1 = require("./signable-message");
const permission_set_1 = require("./permission-set");
const data_stream_1 = require("./data-stream");
const data_path_1 = require("./data-path");
if (window !== undefined) {
    window.stlib = {
        Client: client_1.Client, Community: community_1.Community, Content: imports_1.Content, DataStream: data_stream_1.DataStream, DataPath: data_path_1.DataPath, DisplayableEmote: displayable_message_1.DisplayableEmote, DisplayableMessage: displayable_message_1.DisplayableMessage,
        EventQueue: message_manager_1.EventQueue, PermissionSet: permission_set_1.PermissionSet, Markdown: markdown_1.Markdown, MessageManager: message_manager_1.MessageManager, Utils: utils_1.Utils, SignableMessage: signable_message_1.SignableMessage, TransientCache: utils_1.TransientCache,
        newSignableMessage: signable_message_1.SignableMessage.create,
        utcTime: utils_1.Utils.utcTime
    };
}

},{"./client":1,"./community":2,"./content/imports":10,"./data-path":18,"./data-stream":19,"./displayable-message":21,"./markdown":22,"./message-manager":23,"./permission-set":24,"./signable-message":25,"./utils":28}],27:[function(require,module,exports){
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamDataCache = void 0;
class StreamDataCache {
    constructor(dhiveClient, modeType = 0) {
        this.client = null;
        this.isRunning = false;
        this.customJSONCallbacks = {};
        this.modeType = 0;
        this.client = dhiveClient;
        this.modeType = modeType;
    }
    forCustomJSON(id, fn) {
        this.customJSONCallbacks[id] = fn;
    }
    begin() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.isRunning = true;
                try {
                    for (var _b = __asyncValues(this.getOps()), _c; _c = yield _b.next(), !_c.done;) {
                        const tx = _c.value;
                        if (!this.isRunning)
                            return;
                        var op = tx.op;
                        var opName = op[0];
                        if (opName === "custom_json") {
                            var customJSON = op[1];
                            var id = customJSON.id;
                            var fnJSON = this.customJSONCallbacks[id];
                            if (fnJSON) {
                                var json = JSON.parse(customJSON.json);
                                var auths = customJSON.required_auths;
                                var postingAuths = customJSON.required_posting_auths;
                                for (var user of auths)
                                    fnJSON(user, json, false);
                                for (var user of postingAuths)
                                    fnJSON(user, json, true);
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            finally {
                this.isRunning = false;
            }
        });
    }
    getOps() {
        return __asyncGenerator(this, arguments, function* getOps_1() {
            var e_2, _a;
            try {
                for (var _b = __asyncValues(this.client.blockchain.getOperations({ mode: this.modeType })), _c; _c = yield __await(_b.next()), !_c.done;) {
                    const op = _c.value;
                    try {
                        yield yield __await(op);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
                }
                finally { if (e_2) throw e_2.error; }
            }
        });
    }
}
exports.StreamDataCache = StreamDataCache;

},{}],28:[function(require,module,exports){
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
exports.AccountDataCache = exports.TransientCache = exports.Utils = void 0;
const community_1 = require("./community");
const signable_message_1 = require("./signable-message");
const default_stream_data_cache_1 = require("./default-stream-data-cache");
var netname = null;
var guestAccountValidators = [];
var keyChainRequest = null;
var client = null;
var _dhive = null;
var secureRandomFn = null;
var dhiveclient = null;
var isNode = false;
var readPreferencesFn = null;
var lastRandomPublicKey = "";
var uniqueId = 0;
class Utils {
    /*
        Netname is an unique identifier of the network shared between
        all nodes to determine whether they belong to each other.
        Format: name[publickey,account1,account2]
        where name is the name of the network
        the part in [] is optional and provides a comma separated list of
        either public keys or accountnames with the ability to validate
        guest account creation requests.
    */
    static setNetworkname(name) {
        netname = name;
        var from = name.indexOf('[');
        if (from === -1)
            return [];
        var to = name.lastIndexOf(']');
        guestAccountValidators = name.substring(from + 1, to).trim().split(/[, ]+/);
    }
    static getNetworkname() { return netname; }
    static getGuestAccountValidators() { return guestAccountValidators; }
    static getVersion() { return 3; }
    static getClient() {
        return client;
    }
    static setClient(_client) {
        client = _client;
    }
    static setDhive(dhive0) {
        _dhive = dhive0;
    }
    static dhive() {
        if (_dhive === null) {
            var dhive0 = dhive ? dhive : null;
            if (dhive0 != null)
                _dhive = dhive0;
        }
        return _dhive;
    }
    static getDhiveClient() {
        if (dhiveclient === null) {
            var dhiveClient = Utils.dhive().Client;
            dhiveclient = new dhiveClient(["https://api.hive.blog", "https://anyx.io", "https://api.openhive.network", "https://rpc.ecency.com"]);
        }
        return dhiveclient;
    }
    static reputation(value) {
        if (value == null || value === 0)
            return 25;
        var neg = value < 0;
        var rep = Math.abs(value);
        var v = Math.log10((rep > 0 ? rep : -rep) - 10) - 9;
        v = neg ? -v : v;
        return (v * 9 + 25).toFixed(2);
    }
    static Buffer() { return Utils.dhive().NETWORK_ID.constructor; }
    static setSecureRandom(fn) {
        secureRandomFn = fn;
    }
    static randomBytes(len) {
        var bytes = null;
        if (window != null && window.crypto != null && window.crypto.getRandomValues != null) {
            bytes = window.crypto.getRandomValues(new Uint8Array(len));
        }
        else
            bytes = secureRandomFn(len);
        return bytes;
    }
    static createRandomPassword() {
        return Utils.dhive().cryptoUtils.sha256(Utils.randomBytes(32)).toString();
    }
    static randomPublicKey(extraEntropy = "") {
        var seed = extraEntropy + new Date().getTime() + lastRandomPublicKey + Math.random();
        var pi = Utils.dhive().PrivateKey.fromSeed(seed);
        var key = pi.createPublic("STM").toString();
        lastRandomPublicKey = key;
        return key;
    }
    static encodeTextWithKey(text, privateK, publicK) {
        return Utils.dhive().Memo.encode(privateK, publicK, '#' + text);
        //return hive.memo.encode(privateK.toString(), publicK.toString(), '#'+text);
    }
    static decodeTextWithKey(text, privateK) {
        var decoded = Utils.dhive().Memo.decode(privateK, text);
        //var decoded = hive.memo.decode(privateK.toString(), text);
        if (decoded.startsWith("#"))
            decoded = decoded.substring(1);
        return decoded;
    }
    static nextId() { return uniqueId++; }
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
                    setTimeout(() => {
                        fn(keychain, resolve, error);
                    }, 50);
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
    static getConversationPath(conversation) {
        var i = conversation.indexOf('/');
        return i === -1 ? '' : conversation.substring(i + 1);
    }
    static getGroupName(conversation) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!conversation.startsWith('#'))
                return conversation;
            var username = Utils.getConversationUsername(conversation);
            var path = Utils.getConversationPath(conversation);
            var pref = yield Utils.getAccountPreferences(username);
            var groups = pref.getGroups();
            var group = groups[path];
            return (group !== null && group.name != null) ? group.name : conversation;
        });
    }
    static getGroupKey(conversation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!conversation.startsWith('#'))
                    return conversation;
                var username = Utils.getConversationUsername(conversation);
                var path = Utils.getConversationPath(conversation);
                var pref = yield Utils.getAccountPreferences(username);
                var groups = pref.getGroups();
                var group = groups[path];
                return (group !== null && group.key != null) ? group.key : null;
            }
            catch (e) {
                console.log(e);
            }
            return null;
        });
    }
    static getGroupTimestamp(conversation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!conversation.startsWith('#'))
                    return 0;
                var username = Utils.getConversationUsername(conversation);
                var path = Utils.getConversationPath(conversation);
                var pref = yield Utils.getAccountPreferences(username);
                var groups = pref.getGroups();
                var group = groups[path];
                return (group !== null && group.time != null) ? group.time : 0;
            }
            catch (e) {
                console.log(e);
            }
            return 0;
        });
    }
    static getRole(community, user) {
        return __awaiter(this, void 0, void 0, function* () {
            var data = yield community_1.Community.load(community);
            if (!data)
                return null;
            return data.getRole(user);
        });
    }
    static getTitles(community, user) {
        return __awaiter(this, void 0, void 0, function* () {
            var data = yield community_1.Community.load(community);
            if (!data)
                return null;
            return data.getTitles(user);
        });
    }
    static getFlagNum(community, user) {
        return __awaiter(this, void 0, void 0, function* () {
            var data = yield community_1.Community.load(community);
            if (!data)
                return null;
            return data.getFlagNum(user);
        });
    }
    static verifyPermissions(user, conversation) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Utils.isCommunityConversation(conversation)) {
                var communityName = Utils.getConversationUsername(conversation);
                var communityStreamId = conversation.substring(communityName.length + 1);
                var community = yield community_1.Community.load(communityName);
                if (community == null)
                    return false;
                var stream = community.findTextStreamById(communityStreamId);
                if (stream !== null) {
                    if (community.getRole(user) === 'muted')
                        return false;
                    var writePermissions = stream.getWritePermissions();
                    if (!writePermissions.isEmpty()) {
                        var role, titles;
                        if (Utils.isGuest(user)) {
                            role = "";
                            titles = [];
                        }
                        else {
                            role = yield Utils.getRole(communityName, user);
                            titles = yield Utils.getTitles(communityName, user);
                        }
                        if (!writePermissions.validate(role, titles))
                            return false;
                    }
                }
            }
            else if (Utils.isGroupConversation(conversation)) {
                var groupUsernames = Utils.getGroupUsernames(conversation);
                for (var groupUsername of groupUsernames) {
                    if (groupUsername === user)
                        continue;
                    var canDirectMessage = yield Utils.canDirectMessage(groupUsername, groupUsernames);
                    if (!canDirectMessage)
                        return false;
                }
            }
            return true;
        });
    }
    static getConversationUsername(conversation) {
        var i = conversation.indexOf('/');
        return conversation.substring(conversation.startsWith('#') ? 1 : 0, i === -1 ? conversation.length : i);
    }
    static isJoinableGroupConversation(conversation) {
        if (conversation === '' || conversation[0] != '#')
            return false;
        var i = conversation.indexOf('/');
        return i !== -1;
    }
    static getGroupUsernames(conversation) { return conversation.split('|'); }
    static isCommunityConversation(conversation) { return conversation.startsWith('hive-') && conversation.indexOf('/') !== -1; }
    static isGroupConversation(conversation) { return conversation.indexOf('|') !== -1; }
    static canDirectMessage(user, users) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO
            var pref = yield Utils.getAccountPreferences(user);
            if (pref != null) {
                var option = pref.getValueString("directMessage", null);
                if (option != null) {
                    //values: 'everyone' 'accounts' 'communities' 'friends'
                    if (option === 'accounts') {
                        for (var name of users)
                            if (Utils.isGuest(name))
                                return false;
                    }
                    else if (option === 'communities') { }
                    else if (option === 'friends') { }
                }
            }
            return true;
        });
    }
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
                                /*if(Utils.isGuest(msg.getUser())) {
    
                                }*/
                                var verify = yield msg.verify();
                                if (verify) {
                                    return msg.getContent();
                                }
                                else {
                                    //for updated private key, TODO check
                                    return null;
                                    //throw "preferences did not verify";
                                }
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
                    if (store.lookup(user) === undefined && !Utils.isGuest(user)) {
                        usersToLoad.push(user);
                    }
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
                    posting_json_metadata: result.posting_json_metadata,
                    created: result.created,
                    reputation: result.reputation
                });
        });
    }
    static getPreferredKey(_user) {
        return __awaiter(this, void 0, void 0, function* () {
            var data = yield Utils.getAccountData(_user);
            if (data == null)
                return null;
            if (Utils.isGuest(_user))
                return data.posting.key_auths[0][0];
            var usePostingKey = true;
            /*try {
                var prefs = Utils.getAccountPreferences(_user);
                if(prefs && prefs.getValueBoolean("memoKey", false))
                    usePostingKey = false;
            }
            catch(e) { console.log(e); }*/
            return usePostingKey ? data.posting.key_auths[0][0] : data.memo_key;
        });
    }
    static getAccountData(_user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Utils.isGuest(_user)) {
                var preferences = yield Utils.getAccountPreferences(_user);
                if (preferences) {
                    var account = preferences.getAccount();
                    if (account && account.message && account.message.length >= 7) {
                        var message = account.message;
                        return {
                            message: message,
                            name: message[2],
                            posting: { key_auths: [[message[3], 1]] },
                            memo_key: '',
                            posting_json_metadata: '',
                            created: new Date(message[4]).toISOString(),
                            reputation: 0
                        };
                    }
                }
                return null;
            }
            return yield Utils.getHAccountData(_user);
        });
    }
    static getHAccountData(_user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield accountDataCache.cacheLogic(_user, (user) => {
                if (!Array.isArray(user))
                    user = [user];
                return Utils.getDhiveClient().database
                    .getAccounts(user).then((array) => {
                    var result = {};
                    for (var i = 0; i < array.length; i++) {
                        result[array[i].name] = {
                            name: array[i].name,
                            posting: array[i].posting,
                            memo_key: array[i].memo_key,
                            posting_json_metadata: array[i].posting_json_metadata,
                            created: array[i].created,
                            reputation: array[i].reputation
                        };
                    }
                    return result;
                });
            }, 100);
        });
    }
    static delay(ms) {
        return __awaiter(this, void 0, void 0, function* () { return new Promise(r => { setTimeout(r, ms); }); });
    }
    static retrieveAll(api, method, params, delayMs = 500) {
        return __awaiter(this, void 0, void 0, function* () {
            var array = [];
            var limit = params.limit;
            if (!(limit > 0))
                return array;
            var users = {};
            while (true) {
                var result = yield Utils.getDhiveClient().call(api, method, params);
                for (var a of result)
                    array.push(a);
                if (!(result.length > 0) || result.length < limit)
                    return array;
                var added = false;
                for (var a of result) {
                    var item = Array.isArray(item) ? item[0] : item;
                    if (users[item] === undefined) {
                        added = true;
                        users[item] = item;
                    }
                }
                if (!added)
                    return array;
                var lastItem = array[array.length - 1];
                params.last = Array.isArray(lastItem) ? lastItem[0] : lastItem;
                yield Utils.delay(delayMs);
            }
        });
    }
    static getCommunityData(user, loadFromNode = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNode || !loadFromNode) {
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
            }
            else {
                if (Utils.getClient() == null)
                    throw 'client is null, use Utils.setClient(...) to initialize.';
                return yield communityDataCache.cacheLogic(user, (user) => {
                    return Utils.getClient().readCommunity(user).then((res) => __awaiter(this, void 0, void 0, function* () {
                        if (res.isSuccess()) {
                            var result = res.getResult();
                            if (result == null)
                                return null;
                            if (result[1] != null)
                                result[0].joined = result[1];
                            return result[0];
                        }
                        else
                            throw res.getError();
                    }));
                });
            }
        });
    }
    static findGroupInfo(conversation) {
        return __awaiter(this, void 0, void 0, function* () {
            var groupConversation = Utils.parseGroupConversation(conversation);
            if (groupConversation == null)
                return null;
            var prefs = yield Utils.getAccountPreferences(groupConversation[1]);
            if (prefs == null)
                return null;
            return prefs.getGroup(groupConversation[2]);
        });
    }
    static parseGroupConversation(conversation) {
        var array = Utils.parseConversation(conversation);
        if (array.length !== 3 || array[0] !== '#' || !Utils.isWholeNumber(array[2]))
            return null;
        try {
            array[2] = Number.parseInt(array[2]);
        }
        catch (e) {
            return null;
        }
        return array;
    }
    static parseConversation(conversation) {
        var result = [];
        if (conversation.startsWith('#')) {
            result.push('#');
            conversation = conversation.substring(1);
        }
        var slash = conversation.indexOf('/');
        if (slash === -1)
            result.push(conversation);
        else {
            result.push(conversation.substring(0, slash));
            result.push(conversation.substring(slash + 1));
        }
        return result;
    }
    static isWholeNumber(text) {
        return /^\d+$/.test(text);
    }
    static isGuest(user) {
        return user.indexOf(Utils.GUEST_CHAR) !== -1;
    }
    static parseGuest(guestName) {
        var i = guestName.indexOf(Utils.GUEST_CHAR);
        if (i === -1)
            return [guestName];
        return [guestName.substring(0, i), guestName.substring(i + 1)];
    }
    static isValidGuestName(guestName) {
        if (guestName.length > 20)
            return false;
        var i = guestName.indexOf(Utils.GUEST_CHAR);
        var username = (i === -1) ? guestName : guestName.substring(0, i);
        var number = (i === -1) ? null : guestName.substring(i + 1);
        if (username.length <= 2 || username.length > 16)
            return false;
        if (number !== null && (number.length <= 0 || !Utils.isWholeNumber(number)))
            return false;
        return /^[A-Za-z0-9-._]*$/.test(username);
    }
    static xorArray(a, b, result = null) {
        var length = Math.min(a.length, b.length);
        if (result === null)
            result = new Array(length).fill(0);
        for (var i = 0; i < length; i++)
            result[i] = a[i] ^ b[i];
        return result;
    }
    static arrayEquals(a, b) {
        if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length)
            return false;
        for (var i = 0; i < a.length; i++)
            if (a[i] !== b[i])
                return false;
        return true;
    }
    static newCache() {
        return new AccountDataCache();
    }
    static getAccountDataCache() { return accountDataCache; }
    static getCommunityDataCache() { return communityDataCache; }
    static getStreamDataCache() {
        if (streamDataCache === null)
            streamDataCache = new default_stream_data_cache_1.DefaultStreamDataCache();
        return streamDataCache;
    }
}
exports.Utils = Utils;
Utils.GUEST_CHAR = '@';
class TransientCache {
    constructor(duration, binDuration, newBinInstanceFn) {
        this.items = {};
        this.duration = duration;
        this.binDuration = binDuration;
        this.newBinInstanceFn = newBinInstanceFn;
    }
    binTime(time) {
        return time - time % this.binDuration;
    }
    get(time, createIfNotPresent = true) {
        var now = Utils.utcTime();
        var ti = this.binTime(time);
        if (now - this.duration > ti)
            return null;
        var bin = this.items[ti];
        if (bin === undefined) {
            if (createIfNotPresent)
                this.items[ti] = bin = this.newBinInstanceFn();
            else
                bin = null;
        }
        return bin;
    }
    add(time, item) {
        var bin = this.get(time);
        if (bin == null)
            return null;
        bin.add(time, item);
        return bin;
    }
    deleteOldEntries() {
        var now = Utils.utcTime();
        for (var ti in this.items)
            if (now - this.duration > Number(ti))
                delete this.items[ti];
    }
}
exports.TransientCache = TransientCache;
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
        this.batch = null;
        this.batchPromise = null;
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
    reload(user) {
        var cachedData = this.lookup(user);
        if (cachedData !== undefined) {
            if (cachedData.value !== undefined)
                delete this.data[user];
        }
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
    callBatched(dataPromise, batch = this.batch) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.batch = null;
                this.batchPromise = null;
                var results = yield dataPromise(batch);
                for (var i = 0; i < batch.length; i++) {
                    var user = batch[i];
                    var result = results[user];
                    if (result !== undefined)
                        this.store(user, result);
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    cacheLogic(user, dataPromise, aggregate = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO cache for x time
            var cachedData = this.lookup(user);
            if (cachedData !== undefined) {
                if (cachedData.value !== undefined)
                    return cachedData.value;
                if (cachedData.promise !== undefined) {
                    yield cachedData.promise;
                    return cachedData.value;
                }
            }
            var promise;
            if (aggregate > 1) {
                var _this = this;
                var batch = this.batch;
                var batchPromise = this.batchPromise;
                while (batch != null && batch.length === aggregate && batchPromise != null) {
                    yield batchPromise;
                    if (batchPromise === this.batchPromise) {
                        console.log("error cacheLogic");
                        break;
                    }
                    batch = this.batch;
                    batchPromise = this.batchPromise;
                }
                if (batch == null) {
                    this.batch = batch = [user];
                    this.batchPromise = new Promise((resolve) => {
                        batch.resolve = resolve;
                        setTimeout(resolve, 10);
                    }).then(() => __awaiter(this, void 0, void 0, function* () {
                        yield _this.callBatched(dataPromise, batch);
                    }));
                    this.batchPromise.resolve = batch.resolve;
                }
                else if (batch.indexOf(user) === -1) {
                    batch.push(user);
                }
                batchPromise = this.batchPromise;
                if (batch.length === aggregate) {
                    batchPromise.resolve();
                    yield batchPromise;
                    return this.lookupValue(user);
                }
                promise = new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                    yield batchPromise;
                    resolve(_this.lookupValue(user));
                }));
            }
            else {
                promise = dataPromise(user).then((result) => {
                    this.store(user, result);
                    return result;
                });
            }
            this.storeLater(user, promise);
            return yield promise;
        });
    }
}
exports.AccountDataCache = AccountDataCache;
const preferencesDataCache = new AccountDataCache();
const accountDataCache = new AccountDataCache();
const communityDataCache = new AccountDataCache();
var streamDataCache = null;

},{"./community":2,"./default-stream-data-cache":20,"./signable-message":25}],29:[function(require,module,exports){
const returnTrue = () => true

// Returns true when the given string ends with an unescaped escape.
const isEscaped = str => {
  let ESCAPE = '\\'.charCodeAt(0),
    i = str.length,
    n = 0
  while (i && str.charCodeAt(--i) === ESCAPE) n++
  return n % 2 == 1
}

// Escape-aware string search.
const search = (input, target, cursor) => {
  let i = cursor - 1
  while (true) {
    let start = i
    i = input.indexOf(target, i + 1)
    if (i < 0) return -1
    if (!isEscaped(input.slice(start, i))) return i
  }
}

/** Convert markdown into a syntax tree */
const parse = (input, top = []) => {
  // Stack of unclosed nodes
  let blocks = []
  // The last added node
  let prevNode
  // The last character index to be escaped
  let lastEscapeIdx = -1

  // Add text to the previous node if possible.
  // Otherwise, create a new text node and pass it to `addNode`.
  let addText = text =>
    prevNode && prevNode.type == 'text'
      ? ((prevNode.text += text), prevNode)
      : addNode({ type: 'text', text })

  // Add a node to the current block.
  let addNode = node => {
    let len = blocks.length
    ;(len ? blocks[len - 1].block : top).push(node)
    return (prevNode = node)
  }

  let addBlock = node => {
    // Ensure links are closed properly.
    if (node.type == 'link')
      node = { type: 'link', block: node.block, url: '', ref: '' }

    return addNode(node)
  }

  // Gracefully close any unclosed nodes (as long as `filter` returns truthy).
  let flush = (filter = returnTrue) => {
    for (let i = blocks.length; --i >= 0; ) {
      let node = blocks[i]
      if (!filter(node)) return node
      addBlock(blocks.pop())
    }
  }

  // Move the cursor and update the lexer.
  let moveTo = offset => (lexer.lastIndex = cursor = offset)

  // The primary token scanner
  let lexer = /(^([*_-])\s*\2(?:\s*\2)+$)|(?:^(\s*)([>*+-]|\d+[.\)])\s+)|(?:^``` *(\w*)\n([\s\S]*?)```$)|(^(?:(?:\t|    )[^\n]*(?:\n|$))+)|(\!?\[)|(\](?:(\(|\[)|\:\s*(.+)$)?)|(?:^([^\s].*)\n(\-{3,}|={3,})$)|(?:^(#{1,6})(?:[ \t]+(.*))?$)|(?:`([^`].*?)`)|(  \n|\n\n)|(__|\*\*|[_*]|~~)/gm
  let cursor = 0
  while (true) {
    let match = lexer.exec(input),
      matchOffset = match ? match.index : input.length

    // Copy text between this match and the last.
    let text = input.slice(cursor, matchOffset)
    if (text) {
      addText(text)

      // Skip escaped matches.
      if (match && isEscaped(text)) {
        lastEscapeIdx = match.index
        moveTo(match.index + 1)
        addText(match[0][0])
        continue
      }
    }

    if (!match) break
    let i = 1

    // Move the cursor _after_ this match.
    cursor = lexer.lastIndex

    // Borders (-0 to +1)
    if (match[i]) {
      flush()
      addNode({
        type: 'border',
        text: input.slice(matchOffset, matchOffset + match[0].length),
      })
    }

    // Quotes and lists (-1 to +0)
    else if (match[(i += 3)]) {
      flush()

      let bullet = match[i]
      let isQuote = bullet == '>'
      let node = isQuote
        ? addNode({
            type: 'quote',
            block: [],
          })
        : addNode({
            type: 'list',
            block: [],
            indent: match[i - 1],
            bullet,
          })

      // This looks for block-closing lines.
      let breakRE = isQuote
        ? /^\s{0,3}([*+-]|\d+[.\)])[ \t]/
        : /^\s*([>*+-]|\d+[.\)])[ \t]/

      // Find where the first line ends.
      let start = cursor
      cursor = search(input, '\n', start)
      if (cursor < 0) cursor = input.length

      // Parse multi-line blocks.
      let content = input.slice(start, cursor)
      while (cursor < input.length) {
        let start = cursor + 1
        // Look for "\n\n" break node.
        if (input.charAt(start) == '\n') break

        // Find where the current line ends.
        cursor = search(input, '\n', start)
        if (cursor < 0) cursor = input.length

        // Slice after "> " and before "\n"
        let line = input.slice(start, cursor)

        // Avoid swallowing EOF newline.
        if (!line) {
          cursor = start - 1
          break
        }

        // When a line starts with a list/quote node, avoid parsing it here.
        if (line.match(breakRE)) {
          cursor = start
          break
        }

        content +=
          '\n' + line.match(isQuote ? /^\s*>?\s*(.*)$/ : /^\s*(.*)$/)[1]
      }

      parse(content, node.block)
      moveTo(cursor)
    }

    // Code blocks: (-1 to +1)
    else if (match[(i += 2)] != null || match[i + 1]) {
      flush()

      let code = match[i + 1],
        syntax = '',
        indent = ''

      // Indented code
      if (code) {
        indent = /^(\t|    )/.exec(code)[0]
        code = code.replace(/^(\t|    )/gm, '')

        // Avoid capturing the final newline.
        if (code.slice(-1) == '\n') {
          code = code.slice(0, -1)
          moveTo(cursor - 1)
        }
      }
      // Fenced code
      else {
        // Omit the final newline.
        code = match[i].slice(0, -1)
        syntax = match[i - 1].toLowerCase()
      }

      addNode({
        type: 'codeBlock',
        code,
        syntax,
        indent,
      })
    }

    // Images / Links (-0 to +0)
    else if (match[(i += 2)]) {
      if (match[i][0] == '!') {
        // Find the closing bracket.
        let endOffset = search(input, ']', cursor)
        if (endOffset < 0) {
          addText(match[0])
          continue
        }

        // Images are _not_ actually blocks. We treat it as one temporarily so
        // we can reuse code between images and links.
        prevNode = null
        blocks.push({
          type: 'image',
          alt: input.slice(match.index + 2, endOffset),
          url: '',
          ref: '',
        })

        // Process the "]" next.
        moveTo(endOffset)
      }
      // Create a link node.
      else {
        prevNode = null
        blocks.push({
          type: 'link',
          block: [],
          offset: cursor,
        })
      }
    }
    // Closing bracket (-0 to +2)
    else if (match[++i]) {
      let nodeTypes = /^(link|image)$/
      let node = flush(block => !nodeTypes.test(block.type))
      if (node) {
        blocks.pop()

        // [foo]: bar
        if (match[i + 2]) {
          if (node.type == 'link') {
            addNode({
              type: 'linkDef',
              key: input.slice(node.offset, matchOffset),
              url: match[i + 2],
            })
            continue
          }
          moveTo(match.index + 1) // "]".length
        }

        node = addBlock(node)

        // [foo](bar) or [foo][bar]
        if (match[i + 1]) {
          // Find the closing bracket.
          let endOffset = search(input, match[i + 1] == '(' ? ')' : ']', cursor)
          if (endOffset < 0) {
            addText(match[i + 1])
          } else {
            let startOffset = match.index + 2 // "](".length
            let target = input.slice(startOffset, endOffset)
            moveTo(endOffset + 1) // ")".length

            // [foo](bar)
            if (match[i + 1] == '(') {
              node.url = target
            }
            // [foo][bar]
            else {
              node.ref = target
            }
          }
        }
      } else {
        addText(match[0])
      }
    }

    // Titles (-0 to +3)
    else if (match[(i += 3)] || match[i + 2]) {
      flush()
      addNode({
        type: 'title',
        block: parse(match[i] || match[i + 3] || ''),
        rank: match[i + 2]
          ? match[i + 2].length
          : match[i + 1][0] == '='
          ? 1
          : 2,
      })
    }

    // Code spans (-0 to +0)
    else if (match[(i += 4)]) {
      let codeOffset = matchOffset + 1
      addNode({
        type: 'codeSpan',
        code: input.slice(codeOffset, codeOffset + match[i].length),
      })
    }

    // Breaks (-0 to +0)
    else if (match[++i]) {
      flush()
      addNode({ type: 'break', text: match[0] })
    }

    // Inline formatting (-0 to +0)
    else if (match[++i]) {
      let style = match[i]
      let type = style.length < 2 ? 'italic' : style == '~~' ? 'strike' : 'bold'

      // Close a matching block..
      let node = blocks[blocks.length - 1]
      if (node && node.type == type && node.style == style) {
        addNode(blocks.pop())
      }
      // ..or open a new block.
      else {
        // Assume not italic if a word character comes before,
        // unless that character was an escaped match.
        if (type == 'italic' && lastEscapeIdx < matchOffset - 1) {
          let prevChar = input[matchOffset - 1]
          if (prevChar && /\w/.test(prevChar)) {
            addText(style)
            continue
          }
        }
        prevNode = null
        blocks.push({
          type,
          block: [],
          style,
        })
      }
    }
  }

  flush()
  return top
}

Object.defineProperty(parse, 'default', { value: parse })
module.exports = parse

},{}]},{},[26]);
