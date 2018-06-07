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
    }
    NotAsked.prototype.isLoading = function () {
        return false;
    };
    NotAsked.prototype.hasData = function () {
        return false;
    };
    return NotAsked;
}());
var notAskedConst = new NotAsked();
function notAsked() {
    return notAskedConst;
}
exports.notAsked = notAsked;
var Loading = /** @class */ (function () {
    function Loading() {
        this.kind = RemoteDataKind.Loading;
    }
    Loading.prototype.isLoading = function () {
        return true;
    };
    Loading.prototype.hasData = function () {
        return false;
    };
    return Loading;
}());
var loadingConst = new Loading();
var Reloading = /** @class */ (function () {
    function Reloading(value) {
        this.value = value;
        this.kind = RemoteDataKind.Reloading;
    }
    Reloading.prototype.isLoading = function () {
        return true;
    };
    Reloading.prototype.hasData = function () {
        return true;
    };
    return Reloading;
}());
function loading(previous) {
    if (previous === void 0) { previous = null; }
    if (previous === null) {
        return loadingConst;
    }
    switch (previous.kind) {
        case RemoteDataKind.Error:
            return loadingConst;
        case RemoteDataKind.ErrorWithData:
            return new Reloading(previous.value);
        case RemoteDataKind.Loading:
            return previous;
        case RemoteDataKind.NotAsked:
            return loadingConst;
        case RemoteDataKind.Reloading:
            return previous;
        case RemoteDataKind.Success:
            return new Reloading(previous.value);
    }
}
exports.loading = loading;
var Success = /** @class */ (function () {
    function Success(value) {
        this.value = value;
        this.kind = RemoteDataKind.Success;
    }
    Success.prototype.isLoading = function () {
        return false;
    };
    Success.prototype.hasData = function () {
        return true;
    };
    return Success;
}());
function success(value) {
    return new Success(value);
}
exports.success = success;
var Error = /** @class */ (function () {
    // tslint:disable-next-line:no-shadowed-variable
    function Error(error) {
        this.error = error;
        this.kind = RemoteDataKind.Error;
    }
    Error.prototype.isLoading = function () {
        return false;
    };
    Error.prototype.hasData = function () {
        return false;
    };
    return Error;
}());
var ErrorWithData = /** @class */ (function () {
    // tslint:disable-next-line:no-shadowed-variable
    function ErrorWithData(error, value) {
        this.error = error;
        this.value = value;
        this.kind = RemoteDataKind.ErrorWithData;
    }
    ErrorWithData.prototype.isLoading = function () {
        return false;
    };
    ErrorWithData.prototype.hasData = function () {
        return true;
    };
    return ErrorWithData;
}());
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
}
exports.error = error;
