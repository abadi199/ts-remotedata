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
        this.hasError = function () { return false; };
    }
    NotAsked.prototype.hasData = function () {
        return false;
    };
    NotAsked.prototype.map = function (_f) {
        return notAsked();
    };
    NotAsked.prototype.withDefault = function (data) {
        return data;
    };
    NotAsked.prototype.mapError = function (_f) {
        return notAsked();
    };
    NotAsked.prototype.withDefaultError = function (error) {
        return error;
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
        this.hasError = function () { return false; };
    }
    Loading.prototype.hasData = function () {
        return false;
    };
    Loading.prototype.map = function (_f) {
        return loading();
    };
    Loading.prototype.withDefault = function (data) {
        return data;
    };
    Loading.prototype.mapError = function (_f) {
        return loading();
    };
    Loading.prototype.withDefaultError = function (error) {
        return error;
    };
    return Loading;
}());
exports.Loading = Loading;
var Reloading = /** @class */ (function () {
    function Reloading(data) {
        this.data = data;
        this.kind = RemoteDataKind.Reloading;
        this.isNotAsked = function () { return false; };
        this.isLoading = function () { return true; };
        this.hasError = function () { return false; };
    }
    Reloading.prototype.hasData = function () {
        return true;
    };
    Reloading.prototype.map = function (f) {
        return new Reloading(f(this.data));
    };
    Reloading.prototype.withDefault = function (_data) {
        return this.data;
    };
    Reloading.prototype.mapError = function (_f) {
        return new Reloading(this.data);
    };
    Reloading.prototype.withDefaultError = function (error) {
        return error;
    };
    return Reloading;
}());
exports.Reloading = Reloading;
function loading(previous) {
    if (previous === void 0) { previous = null; }
    if (previous === null) {
        return new Loading();
    }
    switch (previous.kind) {
        case RemoteDataKind.Failure:
            return new Loading();
        case RemoteDataKind.FailureWithData:
            return new Reloading(previous.data);
        case RemoteDataKind.Loading:
            return previous;
        case RemoteDataKind.NotAsked:
            return new Loading();
        case RemoteDataKind.Reloading:
            return previous;
        case RemoteDataKind.Success:
            return new Reloading(previous.data);
    }
    return new Loading();
}
exports.loading = loading;
var Success = /** @class */ (function () {
    function Success(data) {
        this.data = data;
        this.kind = RemoteDataKind.Success;
        this.isNotAsked = function () { return false; };
        this.isLoading = function () { return false; };
        this.hasError = function () { return false; };
    }
    Success.prototype.hasData = function () {
        return true;
    };
    Success.prototype.map = function (f) {
        return success(f(this.data));
    };
    Success.prototype.withDefault = function (_data) {
        return this.data;
    };
    Success.prototype.mapError = function (_f) {
        return success(this.data);
    };
    Success.prototype.withDefaultError = function (error) {
        return error;
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
    }
    Failure.prototype.hasData = function () {
        return false;
    };
    Failure.prototype.hasError = function () {
        return true;
    };
    Failure.prototype.map = function (_f) {
        return failure(this.error);
    };
    Failure.prototype.withDefault = function (data) {
        return data;
    };
    Failure.prototype.mapError = function (f) {
        return failure(f(this.error));
    };
    Failure.prototype.withDefaultError = function (_error) {
        return this.error;
    };
    return Failure;
}());
exports.Failure = Failure;
var FailureWithData = /** @class */ (function () {
    function FailureWithData(error, data) {
        this.error = error;
        this.data = data;
        this.kind = RemoteDataKind.FailureWithData;
        this.isNotAsked = function () { return false; };
        this.isLoading = function () { return false; };
    }
    FailureWithData.prototype.hasData = function () {
        return true;
    };
    FailureWithData.prototype.hasError = function () {
        return true;
    };
    FailureWithData.prototype.map = function (f) {
        return new FailureWithData(this.error, f(this.data));
    };
    FailureWithData.prototype.withDefault = function (_data) {
        return this.data;
    };
    FailureWithData.prototype.mapError = function (f) {
        return new FailureWithData(f(this.error), this.data);
    };
    FailureWithData.prototype.withDefaultError = function (_error) {
        return this.error;
    };
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
            return new FailureWithData(error, previous.data);
        case RemoteDataKind.Loading:
            return new Failure(error);
        case RemoteDataKind.NotAsked:
            return new Failure(error);
        case RemoteDataKind.Reloading:
            return new FailureWithData(error, previous.data);
        case RemoteDataKind.Success:
            return new FailureWithData(error, previous.data);
    }
    return new Failure(error);
}
exports.failure = failure;
