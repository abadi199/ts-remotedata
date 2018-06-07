export declare enum RemoteDataKind {
    NotAsked = 1,
    Loading = 2,
    Reloading = 3,
    Success = 4,
    Error = 5,
    ErrorWithData = 6
}
interface IRemoteData {
    kind: RemoteDataKind;
    isLoading(): boolean;
    hasData(): boolean;
}
declare class NotAsked implements IRemoteData {
    readonly kind: RemoteDataKind;
    isLoading(): boolean;
    hasData(): boolean;
}
export declare function notAsked(): NotAsked;
declare class Loading {
    readonly kind: RemoteDataKind;
    isLoading(): boolean;
    hasData(): boolean;
}
declare class Reloading<data> {
    value: data;
    readonly kind: RemoteDataKind;
    isLoading(): boolean;
    hasData(): boolean;
    constructor(value: data);
}
export declare function loading<data, e>(previous?: RemoteData<data, e> | null): Loading | Reloading<data>;
declare class Success<data> {
    value: data;
    readonly kind: RemoteDataKind;
    isLoading(): boolean;
    hasData(): boolean;
    constructor(value: data);
}
export declare function success<data>(value: data): Success<data>;
declare class Error<e> {
    error: e;
    readonly kind: RemoteDataKind;
    isLoading(): boolean;
    hasData(): boolean;
    constructor(error: e);
}
declare class ErrorWithData<e, data> {
    error: e;
    value: data;
    readonly kind: RemoteDataKind;
    isLoading(): boolean;
    hasData(): boolean;
    constructor(error: e, value: data);
}
export declare function error<e, data>(error: e, previous?: RemoteData<data, e> | null): Error<e> | ErrorWithData<e, data>;
export declare type RemoteData<data, e> = NotAsked | Loading | Reloading<data> | Success<data> | Error<e> | ErrorWithData<e, data>;
export {};
