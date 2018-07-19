"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RemoteDataKind;
(function (RemoteDataKind) {
    RemoteDataKind[RemoteDataKind["NotAsked"] = 1] = "NotAsked";
    RemoteDataKind[RemoteDataKind["Loading"] = 2] = "Loading";
    RemoteDataKind[RemoteDataKind["Reloading"] = 3] = "Reloading";
    RemoteDataKind[RemoteDataKind["Success"] = 4] = "Success";
    RemoteDataKind[RemoteDataKind["Error"] = 5] = "Error";
    RemoteDataKind[RemoteDataKind["ErrorWithData"] = 6] = "ErrorWithData";
})(RemoteDataKind = exports.RemoteDataKind || (exports.RemoteDataKind = {}));
var NotAsked = /** @class */ (function () {
    function NotAsked() {
        this.kind = RemoteDataKind.NotAsked;
        this.isNotAsked = function () { return true; };
        this.isLoading = function () { return false; };
        this.hasData = function () { return false; };
        this.hasError = function () { return false; };
    }
    NotAsked.prototype.map = function (_f) {
        return notAsked();
    };
    return NotAsked;
}());
exports.NotAsked = NotAsked;
function notAsked() {
    return new NotAsked();
}
exports.notAsked = notAsked;
var Loading = /** @class */ (function () {
    function Loading() {
        this.kind = RemoteDataKind.Loading;
        this.isNotAsked = function () { return false; };
        this.isLoading = function () { return true; };
        this.hasData = function () { return false; };
        this.hasError = function () { return false; };
    }
    Loading.prototype.map = function (_f) {
        return loading();
    };
    return Loading;
}());
exports.Loading = Loading;
var Reloading = /** @class */ (function () {
    function Reloading(value) {
        this.value = value;
        this.kind = RemoteDataKind.Reloading;
        this.isNotAsked = function () { return false; };
        this.isLoading = function () { return true; };
        this.hasData = function () { return true; };
        this.hasError = function () { return false; };
    }
    Reloading.prototype.map = function (f) {
        return new Reloading(f(this.value));
    };
    return Reloading;
}());
exports.Reloading = Reloading;
function loading(previous) {
    if (previous === void 0) { previous = null; }
    if (previous === null) {
        return loading();
    }
    switch (previous.kind) {
        case RemoteDataKind.Error:
            return loading();
        case RemoteDataKind.ErrorWithData:
            return new Reloading(previous.value);
        case RemoteDataKind.Loading:
            return previous;
        case RemoteDataKind.NotAsked:
            return loading();
        case RemoteDataKind.Reloading:
            return previous;
        case RemoteDataKind.Success:
            return new Reloading(previous.value);
    }
    return loading();
}
exports.loading = loading;
var Success = /** @class */ (function () {
    function Success(value) {
        this.value = value;
        this.kind = RemoteDataKind.Success;
        this.isNotAsked = function () { return false; };
        this.isLoading = function () { return false; };
        this.hasData = function () { return true; };
        this.hasError = function () { return false; };
    }
    Success.prototype.map = function (f) {
        return success(f(this.value));
    };
    return Success;
}());
exports.Success = Success;
function success(value) {
    return new Success(value);
}
exports.success = success;
var Error = /** @class */ (function () {
    function Error(error) {
        this.error = error;
        this.kind = RemoteDataKind.Error;
        this.isNotAsked = function () { return false; };
        this.isLoading = function () { return false; };
        this.hasData = function () { return false; };
        this.hasError = function () { return true; };
    }
    Error.prototype.map = function (_f) {
        return error(this.error);
    };
    return Error;
}());
exports.Error = Error;
var ErrorWithData = /** @class */ (function () {
    function ErrorWithData(error, value) {
        this.error = error;
        this.value = value;
        this.kind = RemoteDataKind.ErrorWithData;
        this.isNotAsked = function () { return false; };
        this.isLoading = function () { return false; };
        this.hasData = function () { return true; };
        this.hasError = function () { return true; };
    }
    return ErrorWithData;
}());
exports.ErrorWithData = ErrorWithData;
function error(
// tslint:disable-next-line:no-shadowed-variable
error, previous) {
    if (previous === void 0) { previous = null; }
    if (previous === null) {
        return new Error(error);
    }
    switch (previous.kind) {
        case RemoteDataKind.Error:
            return new Error(error);
        case RemoteDataKind.ErrorWithData:
            return new ErrorWithData(error, previous.value);
        case RemoteDataKind.Loading:
            return new Error(error);
        case RemoteDataKind.NotAsked:
            return new Error(error);
        case RemoteDataKind.Reloading:
            return new ErrorWithData(error, previous.value);
        case RemoteDataKind.Success:
            return new ErrorWithData(error, previous.value);
    }
    return new Error(error);
}
exports.error = error;
