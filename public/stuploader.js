(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const upload_1 = require("./upload");
const uploader_1 = require("./uploader");
if (window !== undefined) {
    window.stuploader = {
        Upload: upload_1.Upload, Uploader: uploader_1.Uploader, uploadImage: uploader_1.Uploader.uploadImage
    };
}

},{"./upload":2,"./uploader":3}],2:[function(require,module,exports){
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
exports.Upload = void 0;
const uploader_1 = require("./uploader");
class Upload {
    constructor() {
        this.id = null;
        this.user = null;
        this.shared = null;
        this.name = null;
        this.accessed = null;
        this.created = null;
        this.mime = null;
        this.data = null;
        this.size = null;
        this.signature = null;
        this.link = null;
    }
    setSharedUsers(users) {
        this.shared = users.join('|');
    }
    hasReadPermission(user) {
        var shared = this.shared;
        if (shared != null && shared !== "") {
            if (user == null || shared.split('|').indexOf(user) === -1)
                return false;
        }
        return true;
    }
    setData(data) { this.data = data; }
    upload() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield uploader_1.Uploader.upload(this);
        });
    }
    toSignableMessage() {
        var data = this.data;
        var length = (data.length !== undefined) ? data.length : data.size;
        var hash = dhive.cryptoUtils.sha256(data).toString("hex");
        return 'upload/' + length + '/' + hash;
    }
    signWithKey(privateK) {
        if (typeof privateK === 'string')
            privateK = dhive.PrivateKey.fromString(privateK);
        var signableMessage = dhive.cryptoUtils.sha256(this.toSignableMessage());
        this.signature = privateK.sign(signableMessage).toString("hex");
        return this.signature;
    }
    signWithKeychain() {
        return __awaiter(this, void 0, void 0, function* () {
            var user = this.user;
            var signableMessage = this.toSignableMessage();
            var result = yield new Promise((resolve, error) => {
                window.hive_keychain.requestSignBuffer(user, signableMessage, "Posting", (result) => {
                    if (result.success) {
                        var signature = result.result;
                        resolve(signature);
                    }
                    else
                        error();
                });
            });
            this.signature = result;
            return result;
        });
    }
    static create(user, filename = null, mime = null) {
        var upload = new Upload();
        upload.user = user;
        upload.name = filename;
        upload.mime = mime;
        return upload;
    }
    static fromJSON(obj) {
        var file = new Upload();
        if (obj.id !== undefined)
            file.id = obj.id;
        if (obj.user !== undefined)
            file.user = obj.user;
        if (obj.name !== undefined)
            file.name = obj.name;
        if (obj.mime !== undefined)
            file.mime = obj.mime;
        if (obj.accessed !== undefined)
            file.accessed = obj.accessed;
        if (obj.created !== undefined)
            file.created = obj.created;
        if (obj.size !== undefined)
            file.size = obj.size;
        if (obj.shared !== undefined)
            file.shared = obj.shared;
        if (obj.data !== undefined)
            file.data = obj.data;
        return file;
    }
}
exports.Upload = Upload;

},{"./uploader":3}],3:[function(require,module,exports){
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
exports.Uploader = void 0;
const upload_1 = require("./upload");
class Uploader {
    static uploadImage(user, file, name = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file.type.startsWith("image/"))
                return null;
            if (name === null)
                name = file.name;
            if (file.type === "image/gif") {
                var upload = upload_1.Upload.create(user, name, file.type);
                var bytes = new Uint8Array(yield file.arrayBuffer());
                upload.setData(bytes);
                return upload;
            }
            else {
                var upload = upload_1.Upload.create(user, name, "image/jpeg");
                var bytes = yield Uploader.rescaleImage(file);
                upload.setData(bytes);
                return upload;
            }
        });
    }
    /*static async uploadFile(user: string, file: any) {
        var upload = Upload.create(user, file.name, file.type);

    }*/
    static upload(upload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (upload.user == null)
                throw "user is null";
            if (upload.data == null)
                throw "data is null";
            if (upload.signature == null)
                throw "signature is null";
            const response = yield fetch(Uploader.uploaderDomain +
                '/upload?user=' + encodeURIComponent(upload.user) +
                '&name=' + encodeURIComponent(upload.name) +
                '&mime=' + encodeURIComponent(upload.mime) +
                '&shared=' + encodeURIComponent(upload.shared == null ? '' : upload.shared) +
                '&signature=' + upload.signature, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/octet-stream",
                },
                body: upload.data
            });
            var result = yield response.json();
            if (result.success) {
                upload.id = result.id;
                upload.created = upload.accessed = result.created;
                upload.link = result.link;
                return upload;
            }
            return null;
        });
    }
    static uploadBytes(user, bytes) {
        return __awaiter(this, void 0, void 0, function* () {
            var signature = yield Uploader.signFileKC(user, bytes);
            const response = yield fetch(Uploader.uploaderDomain + '/upload/' + user + '/' + signature, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/octet-stream",
                },
                body: bytes
            });
            return yield response.json();
        });
    }
    uploadBlob(user, blob) {
        return __awaiter(this, void 0, void 0, function* () {
            var bytes = new Uint8Array(yield blob.arrayBuffer());
            return yield Uploader.uploadBytes(user, bytes);
        });
    }
    static rescaleImage(file, MAX_WIDTH = 2048, MAX_HEIGHT = 2048, compressedFormat = "image/jpeg", quality = 0.95) {
        var p = new Promise((resolve, error) => {
            var reader = new FileReader();
            reader.onload = function (event) {
                var img = new Image();
                img.onload = function () {
                    var nw = img.width, nh = img.height;
                    if (nw > MAX_WIDTH) {
                        nw = MAX_WIDTH;
                        nh = Math.round((MAX_WIDTH / img.width) * img.height);
                    }
                    if (nh > MAX_HEIGHT) {
                        nw = Math.round((MAX_HEIGHT / img.height) * img.width);
                        nh = MAX_HEIGHT;
                    }
                    var canvas = document.createElement('canvas');
                    var g = canvas.getContext('2d');
                    canvas.width = nw;
                    canvas.height = nh;
                    g.drawImage(img, 0, 0, nw, nh);
                    canvas.toBlob((blob) => __awaiter(this, void 0, void 0, function* () {
                        resolve(new Uint8Array(yield blob.arrayBuffer()));
                    }), compressedFormat, quality);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
        return p;
    }
    static signFileKC(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var length = (data.length !== undefined) ? data.length : data.size;
            var hash = dhive.cryptoUtils.sha256(data).toString("hex");
            console.log('upload/' + length + '/' + hash);
            return new Promise((resolve, error) => {
                window.hive_keychain.requestSignBuffer(user, 'upload/' + length + '/' + hash, "Posting", (result) => {
                    if (result.success) {
                        var signature = result.result;
                        resolve(signature);
                    }
                    else
                        error();
                });
            });
        });
    }
    static downloadWithKeychain(user, id, time) {
        return __awaiter(this, void 0, void 0, function* () {
            var signature = yield new Promise((resolve, error) => {
                window.hive_keychain.requestSignBuffer(user, 'download/' + id + '/' + time, "Posting", (result) => {
                    if (result.success) {
                        var signature = result.result;
                        resolve(signature);
                    }
                    else
                        error();
                });
            });
            return yield Uploader.download(user, id, time, signature);
        });
    }
    static downloadWithKey(user, id, time, privateK) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof privateK === 'string')
                privateK = dhive.PrivateKey.fromString(privateK);
            var signableMessage = dhive.cryptoUtils.sha256('download/' + id + '/' + time);
            var signature = privateK.sign(signableMessage).toString("hex");
            return yield Uploader.download(user, id, time, signature);
        });
    }
    static download(user, id, time, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(Uploader.uploaderDomain + '/file/' + id +
                '?user=' + encodeURIComponent(user) +
                '&time=' + time +
                '&signature=' + signature, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/octet-stream",
                }
            });
            if (response.ok) {
                var result = yield response.arrayBuffer();
                return result;
            }
            if (response.status === 404)
                return null;
            throw "error " + response.status;
        });
    }
    static list(user, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            var params = '';
            if (query != null) {
                for (var param in query)
                    params += (params.length === 0 ? '?' : '&') + param + '=' + encodeURIComponent(query[param]);
            }
            const response = yield fetch(Uploader.uploaderDomain + '/upload/list/' + user + params, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/octet-stream",
                }
            });
            if (response.ok) {
                var result = yield response.json();
                if (result.success) {
                    var arr = [];
                    for (var item of result.result)
                        arr.push(upload_1.Upload.fromJSON(item));
                    return arr;
                }
            }
            return null;
        });
    }
}
exports.Uploader = Uploader;
Uploader.uploaderDomain = "";

},{"./upload":2}]},{},[1]);
