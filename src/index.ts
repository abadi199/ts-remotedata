export enum RemoteDataKind {
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
class NotAsked implements IRemoteData {
  readonly kind = RemoteDataKind.NotAsked;
  isLoading() {
    return false;
  }
  hasData() {
    return false;
  }
}

const notAskedConst = new NotAsked();

export function notAsked(): NotAsked {
  return notAskedConst;
}

class Loading {
  readonly kind = RemoteDataKind.Loading;
  isLoading() {
    return true;
  }
  hasData() {
    return false;
  }
}
const loadingConst = new Loading();

class Reloading<data> {
  readonly kind = RemoteDataKind.Reloading;
  isLoading() {
    return true;
  }
  hasData() {
    return true;
  }
  constructor(public value: data) {}
}
export function loading<data, e>(
  previous: RemoteData<data, e> | null = null
): Loading | Reloading<data> {
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

class Success<data> {
  readonly kind = RemoteDataKind.Success;
  isLoading() {
    return false;
  }
  hasData() {
    return true;
  }
  constructor(public value: data) {}
}
export function success<data>(value: data): Success<data> {
  return new Success(value);
}

class Error<e> {
  readonly kind = RemoteDataKind.Error;
  isLoading() {
    return false;
  }
  hasData() {
    return false;
  }
  // tslint:disable-next-line:no-shadowed-variable
  constructor(public error: e) {}
}

class ErrorWithData<e, data> {
  readonly kind = RemoteDataKind.ErrorWithData;
  isLoading() {
    return false;
  }
  hasData() {
    return true;
  }
  // tslint:disable-next-line:no-shadowed-variable
  constructor(public error: e, public value: data) {}
}
export function error<e, data>(
  // tslint:disable-next-line:no-shadowed-variable
  error: e,
  previous: RemoteData<data, e> | null = null
): Error<e> | ErrorWithData<e, data> {
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

export type RemoteData<data, e> =
  | NotAsked
  | Loading
  | Reloading<data>
  | Success<data>
  | Error<e>
  | ErrorWithData<e, data>;
