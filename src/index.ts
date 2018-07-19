export enum RemoteDataKind {
  NotAsked = 1,
  Loading = 2,
  Reloading = 3,
  Success = 4,
  Error = 5,
  ErrorWithData = 6
}

export interface IRemoteData<data, e> {
  kind: RemoteDataKind;
  isNotAsked(): boolean;
  isLoading(): boolean;
  hasError(): boolean;
  hasData(): boolean;
  map<b>(f: (data: data) => b): RemoteData<b, e>;
}
export class NotAsked<data, error> implements IRemoteData<data, error> {
  readonly kind = RemoteDataKind.NotAsked;
  isNotAsked = () => true;
  isLoading = () => false;
  hasData = () => false;
  hasError = () => false;
  map<b>(_f: (data: data) => b): RemoteData<b, error> {
    return notAsked();
  }
}

export function notAsked<data, error>(): NotAsked<data, error> {
  return new NotAsked<data, error>();
}

export class Loading<data, error> implements IRemoteData<data, error> {
  readonly kind = RemoteDataKind.Loading;
  isNotAsked = () => false;
  isLoading = () => true;
  hasData = () => false;
  hasError = () => false;
  map<b>(_f: (data: data) => b): RemoteData<b, error> {
    return loading();
  }
}

export class Reloading<data, error> implements IRemoteData<data, error> {
  readonly kind = RemoteDataKind.Reloading;
  constructor(public value: data) {}
  isNotAsked = () => false;
  isLoading = () => true;
  hasData = () => true;
  hasError = () => false;
  map<b>(f: (data: data) => b): RemoteData<b, error> {
    return new Reloading(f(this.value));
  }
}
export function loading<data, error>(
  previous: RemoteData<data, error> | null = null
): Loading<data, error> | Reloading<data, error> {
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

export class Success<data, error> implements IRemoteData<data, error> {
  constructor(public value: data) {}
  readonly kind = RemoteDataKind.Success;
  isNotAsked = () => false;
  isLoading = () => false;
  hasData = () => true;
  hasError = () => false;
  map<b>(f: (data: data) => b): RemoteData<b, error> {
    return success(f(this.value));
  }
}
export function success<data, error>(value: data): Success<data, error> {
  return new Success(value);
}

export class Error<data, error> implements IRemoteData<data, error> {
  constructor(public error: error) {}
  readonly kind = RemoteDataKind.Error;
  isNotAsked = () => false;
  isLoading = () => false;
  hasData = () => false;
  hasError = () => true;
  map<b>(_f: (data: data) => b): RemoteData<b, error> {
    return error(this.error);
  }
}

export class ErrorWithData<data, error> {
  readonly kind = RemoteDataKind.ErrorWithData;
  isNotAsked = () => false;
  isLoading = () => false;
  hasData = () => true;
  hasError = () => true;
  constructor(public error: error, public value: data) {}
}
export function error<data, error>(
  // tslint:disable-next-line:no-shadowed-variable
  error: error,
  previous: RemoteData<data, error> | null = null
): Error<data, error> | ErrorWithData<data, error> {
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

export type RemoteData<data, error> =
  | NotAsked<data, error>
  | Loading<data, error>
  | Reloading<data, error>
  | Success<data, error>
  | Error<data, error>
  | ErrorWithData<data, error>;
