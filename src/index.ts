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
  isLoading(): boolean;
  hasError(): boolean;
  hasData(): boolean;
  map<U>(f: (data: T) => U): RemoteData<U, E>;
}
export class NotAsked<T, E> implements IRemoteData<T, E> {
  readonly kind = RemoteDataKind.NotAsked;
  isNotAsked = () => true;
  isLoading = () => false;
  hasData = () => false;
  hasError = () => false;
  map<U>(_f: (data: T) => U): RemoteData<U, E> {
    return notAsked();
  }
}

export function notAsked<T, E>(): NotAsked<T, E> {
  return new NotAsked<T, E>();
}

export class Loading<T, E> implements IRemoteData<T, E> {
  readonly kind = RemoteDataKind.Loading;
  isNotAsked = () => false;
  isLoading = () => true;
  hasData = () => false;
  hasError = () => false;
  map<U>(_f: (data: T) => U): RemoteData<U, E> {
    return loading();
  }
}

export class Reloading<T, E> implements IRemoteData<T, E> {
  readonly kind = RemoteDataKind.Reloading;
  constructor(public value: T) {}
  isNotAsked = () => false;
  isLoading = () => true;
  hasData = () => true;
  hasError = () => false;
  map<U>(f: (data: T) => U): RemoteData<U, E> {
    return new Reloading(f(this.value));
  }
}
export function loading<T, E>(
  previous: RemoteData<T, E> | null = null
): Loading<T, E> | Reloading<T, E> {
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

export class Success<T, E> implements IRemoteData<T, E> {
  constructor(public value: T) {}
  readonly kind = RemoteDataKind.Success;
  isNotAsked = () => false;
  isLoading = () => false;
  hasData = () => true;
  hasError = () => false;
  map<U>(f: (data: T) => U): RemoteData<U, E> {
    return success(f(this.value));
  }
}
export function success<T, E>(value: T): Success<T, E> {
  return new Success(value);
}

export class Failure<T, E> implements IRemoteData<T, E> {
  constructor(public error: E) {}
  readonly kind = RemoteDataKind.Failure;
  isNotAsked = () => false;
  isLoading = () => false;
  hasData = () => false;
  hasError = () => true;
  map<U>(_f: (data: T) => U): RemoteData<U, E> {
    return failure(this.error);
  }
}

export class FailureWithData<T, E> {
  readonly kind = RemoteDataKind.FailureWithData;
  isNotAsked = () => false;
  isLoading = () => false;
  hasData = () => true;
  hasError = () => true;
  constructor(public error: E, public value: T) {}
}
export function failure<T, E>(
  error: E,
  previous: RemoteData<T, E> | null = null
): Failure<T, E> | FailureWithData<T, E> {
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

export type RemoteData<T, E> =
  | NotAsked<T, E>
  | Loading<T, E>
  | Reloading<T, E>
  | Success<T, E>
  | Failure<T, E>
  | FailureWithData<T, E>;
