export enum RemoteDataKind {
  NotAsked = 1,
  Loading = 2,
  Reloading = 3,
  Success = 4,
  Error = 5,
  ErrorWithData = 6
}

export interface IRemoteData {
  kind: RemoteDataKind;
  isNotAsked(): boolean;
  isLoading(): boolean;
  hasError(): boolean;
  hasData(): boolean;
}
export class NotAsked implements IRemoteData {
  readonly kind = RemoteDataKind.NotAsked;
  isNotAsked = () => true;
  isLoading = () => false;
  hasData = () => false;
  hasError = () => false;
}

const notAskedConst = new NotAsked();

export function notAsked(): NotAsked {
  return notAskedConst;
}

export class Loading {
  readonly kind = RemoteDataKind.Loading;
  isNotAsked = () => false;
  isLoading = () => true;
  hasData = () => false;
  hasError = () => false;
}
const loadingConst = new Loading();

export class Reloading<data> {
  readonly kind = RemoteDataKind.Reloading;
  isNotAsked = () => false;
  isLoading = () => true;
  hasData = () => true;
  hasError = () => false;
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

export class Success<data> {
  readonly kind = RemoteDataKind.Success;
  isNotAsked = () => false;
  isLoading = () => false;
  hasData = () => true;
  hasError = () => false;
  constructor(public value: data) {}
}
export function success<data>(value: data): Success<data> {
  return new Success(value);
}

export class Error<e> {
  readonly kind = RemoteDataKind.Error;
  isNotAsked = () => false;
  isLoading = () => false;
  hasData = () => false;
  hasError = () => true;
  constructor(public error: e) {}
}

export class ErrorWithData<e, data> {
  readonly kind = RemoteDataKind.ErrorWithData;
  isNotAsked = () => false;
  isLoading = () => false;
  hasData = () => true;
  hasError = () => true;
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
