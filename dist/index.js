"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RemoteDataKind;
(function (RemoteDataKind) {
    RemoteDataKind[RemoteDataKind["NotAsked"] = 1] = "NotAsked";
    RemoteDataKind[RemoteDataKind["Loading"] = 2] = "Loading";
    RemoteDataKind[RemoteDataKind["Reloading"] = 3] = "Reloading";
    RemoteDataKind[RemoteDataKind["Success"] = 4] = "Success";
    RemoteDataKind[RemoteDataKind["Failure"] = 5] = "Failure";
    RemoteDataKind[RemoteDataKind["FailureWithData"] = 6] = "FailureWithData";
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
        case RemoteDataKind.Failure:
            return loading();
        case RemoteDataKind.FailureWithData:
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
var Failure = /** @class */ (function () {
    function Failure(error) {
        this.error = error;
        this.kind = RemoteDataKind.Failure;
        this.isNotAsked = function () { return false; };
        this.isLoading = function () { return false; };
        this.hasData = function () { return false; };
        this.hasError = function () { return true; };
    }
    Failure.prototype.map = function (_f) {
        return failure(this.error);
    };
    return Failure;
}());
exports.Failure = Failure;
var FailureWithData = /** @class */ (function () {
    function FailureWithData(error, value) {
        this.error = error;
        this.value = value;
        this.kind = RemoteDataKind.FailureWithData;
        this.isNotAsked = function () { return false; };
        this.isLoading = function () { return false; };
        this.hasData = function () { return true; };
        this.hasError = function () { return true; };
    }
    return FailureWithData;
}());
exports.FailureWithData = FailureWithData;
function failure(error, previous) {
    if (previous === void 0) { previous = null; }
    if (previous === null) {
        return new Failure(error);
    }
    switch (previous.kind) {
        case RemoteDataKind.Failure:
            return new Failure(error);
        case RemoteDataKind.FailureWithData:
            return new FailureWithData(error, previous.value);
        case RemoteDataKind.Loading:
            return new Failure(error);
        case RemoteDataKind.NotAsked:
            return new Failure(error);
        case RemoteDataKind.Reloading:
            return new FailureWithData(error, previous.value);
        case RemoteDataKind.Success:
            return new FailureWithData(error, previous.value);
    }
    return new Failure(error);
}
exports.failure = failure;
