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
  isLoading(): boolean;
  hasData(): boolean;
}
export class NotAsked implements IRemoteData {
  readonly kind = RemoteDataKind.NotAsked;
  isLoading() {
    return false;
  }
  hasData() {
    return false;
  }
}

const notAskedConst = new NotAsked();

/**
 * Create NotAsked
 * @returns NotAsked
 */
export function notAsked(): NotAsked {
  return notAskedConst;
}

export class Loading {
  readonly kind = RemoteDataKind.Loading;
  isLoading() {
    return true;
  }
  hasData() {
    return false;
  }
}
const loadingConst = new Loading();

export class Reloading<data> {
  readonly kind = RemoteDataKind.Reloading;
  isLoading() {
    return true;
  }
  hasData() {
    return true;
  }
  constructor(public value: data) {}
}

/**
 * Create either a Loading or Reloading
 * @param  {RemoteData<data, e> | null} previous - previous remote data or null
 * @returns Loading
 */
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
  isLoading() {
    return false;
  }
  hasData() {
    return true;
  }
  constructor(public value: data) {}
}
/**
 * Create a Success
 * @param  {data} value - A success data
 * @returns Success
 */
export function success<data>(value: data): Success<data> {
  return new Success(value);
}

export class Error<e> {
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

export class ErrorWithData<e, data> {
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

/**
 * Create either an Error or ErrorWithData
 * @param  {e} error
 * @param  {RemoteData<data, e> | null} previous - previous remote data or null.
 * @returns Error
 */
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

/**
 * Update the `prev` RemoteData with the `next` data/error. This guarantees we don't lose previous data when updating the state.
 * @param  {RemoteData<data, e>} prev - the old remote data
 * @param  {RemoteData<data, e>} next - the new remote data
 * @returns RemoteData<data, e>
 */
export function update<data, e>(prev: RemoteData<data, e>, next: RemoteData<data, e>): RemoteData<data, e> {
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