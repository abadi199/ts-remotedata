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
exports.NotAsked = NotAsked;
var notAskedConst = new NotAsked();
/**
 * Create NotAsked
 * @returns NotAsked
 */
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
exports.Loading = Loading;
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
exports.Reloading = Reloading;
/**
 * Create either a Loading or Reloading
 * @param  {RemoteData<data, e> | null} previous - previous remote data or null
 * @returns Loading
 */
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
exports.Success = Success;
/**
 * Create a Success
 * @param  {data} value - A success data
 * @returns Success
 */
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
exports.Error = Error;
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
exports.ErrorWithData = ErrorWithData;
/**
 * Create either an Error or ErrorWithData
 * @param  {e} error
 * @param  {RemoteData<data, e> | null} previous - previous remote data or null.
 * @returns Error
 */
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
/**
 * Update the `prev` RemoteData with the `next` data/error. This guarantees we don't lose previous data when updating the state.
 * @param  {RemoteData<data, e>} prev - the old remote data
 * @param  {RemoteData<data, e>} next - the new remote data
 * @returns RemoteData<data, e>
 */
function update(prev, next) {
    switch (next.kind) {
        case RemoteDataKind.Error: {
            return error(next.error, prev);
        }
        case RemoteDataKind.Loading: {
            return loading(prev);
        }
        case RemoteDataKind.ErrorWithData: {
            return next;
        }
        case RemoteDataKind.NotAsked: {
            return next;
        }
        case RemoteDataKind.Reloading: {
            return next;
        }
        case RemoteDataKind.Success: {
            return next;
        }
    }
}
exports.update = update;
