export enum RemoteDataKind {
  NotAsked = 1,
  Loading = 2,
  Reloading = 3,
  Success = 4,
  Failure = 5,
  FailureWithData = 6
}

export interface IRemoteData<T, E> {
  kind: RemoteDataKind;
  isNotAsked(): boolean;
  isLoading(): this is Loading<T, E> | Reloading<T, E>;
  hasError(): this is Failure<T, E> | FailureWithData<T, E>;
  hasData(): this is Reloading<T, E> | Success<T, E> | FailureWithData<T, E>;
  map<U>(f: (data: T) => U): RemoteData<U, E>;
  withDefault(data: T): T;
  mapError<E2>(f: (error: E) => E2): RemoteData<T, E2>;
  withDefaultError(error: E): E;
}
export class NotAsked<T, E> implements IRemoteData<T, E> {
  readonly kind = RemoteDataKind.NotAsked;
  isNotAsked = () => true;
  hasData(): this is Reloading<T, E> | Success<T, E> | FailureWithData<T, E> {
    return false;
  }
  isLoading = () => false;
  hasError = () => false;
  map<U>(_f: (data: T) => U): RemoteData<U, E> {
    return notAsked();
  }
  withDefault(data: T) {
    return data;
  }
  mapError<E2>(_f: (error: E) => E2): RemoteData<T, E2> {
    return notAsked();
  }
  withDefaultError(error: E): E {
    return error;
  }
}

export function notAsked<T, E>(): NotAsked<T, E> {
  return new NotAsked<T, E>();
}

export class Loading<T, E> implements IRemoteData<T, E> {
  readonly kind = RemoteDataKind.Loading;
  isNotAsked = () => false;
  isLoading = () => true;
  hasData(): this is Reloading<T, E> | Success<T, E> | FailureWithData<T, E> {
    return false;
  }
  hasError = () => false;
  map<U>(_f: (data: T) => U): RemoteData<U, E> {
    return loading();
  }
  withDefault(data: T) {
    return data;
  }
  mapError<E2>(_f: (error: E) => E2): RemoteData<T, E2> {
    return loading();
  }
  withDefaultError(error: E): E {
    return error;
  }
}

export class Reloading<T, E> implements IRemoteData<T, E> {
  readonly kind = RemoteDataKind.Reloading;
  constructor(public data: T) {}
  isNotAsked = () => false;
  isLoading = () => true;
  hasData(): this is Reloading<T, E> | Success<T, E> | FailureWithData<T, E> {
    return true;
  }
  hasError = () => false;
  map<U>(f: (data: T) => U): RemoteData<U, E> {
    return new Reloading(f(this.data));
  }
  withDefault(_data: T) {
    return this.data;
  }
  mapError<E2>(_f: (error: E) => E2): RemoteData<T, E2> {
    return new Reloading(this.data);
  }
  withDefaultError(error: E): E {
    return error;
  }
}

export function loading<T, E>(
  previous: RemoteData<T, E> | null = null
): RemoteData<T, E> {
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

export class Success<T, E> implements IRemoteData<T, E> {
  constructor(public data: T) {}
  readonly kind = RemoteDataKind.Success;
  isNotAsked = () => false;
  isLoading = () => false;
  hasData(): this is Reloading<T, E> | Success<T, E> | FailureWithData<T, E> {
    return true;
  }
  hasError = () => false;
  map<U>(f: (data: T) => U): RemoteData<U, E> {
    return success(f(this.data));
  }
  withDefault(_data: T) {
    return this.data;
  }
  mapError<E2>(_f: (error: E) => E2): RemoteData<T, E2> {
    return success(this.data);
  }
  withDefaultError(error: E): E {
    return error;
  }
}

export function success<T, E>(value: T): RemoteData<T, E> {
  return new Success(value);
}

export class Failure<T, E> implements IRemoteData<T, E> {
  constructor(public error: E) {}
  readonly kind = RemoteDataKind.Failure;
  isNotAsked = () => false;
  isLoading = () => false;
  hasData(): this is Reloading<T, E> | Success<T, E> | FailureWithData<T, E> {
    return false;
  }
  hasError(): this is Failure<T, E> | FailureWithData<T, E> {
    return true;
  }
  map<U>(_f: (data: T) => U): RemoteData<U, E> {
    return failure(this.error);
  }
  withDefault(data: T) {
    return data;
  }
  mapError<E2>(f: (error: E) => E2): RemoteData<T, E2> {
    return failure(f(this.error));
  }
  withDefaultError(_error: E): E {
    return this.error;
  }
}

export class FailureWithData<T, E> implements IRemoteData<T, E> {
  constructor(public error: E, public data: T) {}
  readonly kind = RemoteDataKind.FailureWithData;
  isNotAsked = () => false;
  isLoading = () => false;
  hasData(): this is Reloading<T, E> | Success<T, E> | FailureWithData<T, E> {
    return true;
  }
  hasError(): this is Failure<T, E> | FailureWithData<T, E> {
    return true;
  }
  map<U>(f: (data: T) => U): RemoteData<U, E> {
    return new FailureWithData(this.error, f(this.data));
  }
  withDefault(_data: T) {
    return this.data;
  }
  mapError<E2>(f: (error: E) => E2): RemoteData<T, E2> {
    return new FailureWithData(f(this.error), this.data);
  }
  withDefaultError(_error: E): E {
    return this.error;
  }
}

export function failure<T, E>(
  error: E,
  previous: RemoteData<T, E> | null = null
): RemoteData<T, E> {
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

export type RemoteData<T, E> =
  | NotAsked<T, E>
  | Loading<T, E>
  | Reloading<T, E>
  | Success<T, E>
  | Failure<T, E>
  | FailureWithData<T, E>;
