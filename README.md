# RemoteData for TypeScript
Inspired by Kris Jenkin's Elm RemoteData package and his blog post:
http://blog.jenkster.com/2016/06/how-elm-slays-a-ui-antipattern.html

`RemoteData` is implemented using TypeScript's Discriminated Union (See: https://www.typescriptlang.org/docs/handbook/advanced-types.html)

It's a data type used to represent possible state in data that come from remote server such as API call. All possible state of the data is:

- `NotAsked` User has not make the request to fetch the data yet.
- `Loading` User has make an initial request to fetch the data, so the program is waiting for the request to be completed.
- `Reloading` User has make another request to fetch the data, but the program already have data from previous request.
- `Error` There's an error from previous request, which typically mean http request, but can also be data validation error, or any other kind of error.
- `ErrorWithData` Similar to `Error`, but the program contain data from previous successful request.
- `Success` User has make a successful request, and now the program has the data.

Since `RemoteData` is a Discrimated Union, it has the property `kind` as the *discriminant* or *tag*, and you can use it inside a `switch` statement to narrow down the type. (See [Example using Switch](##Example using Switch))

## Example using Switch
```ts
function renderFruits(RemoteData<string[], string> fruits) {
    switch (fruits.kind) {
      case RemoteDataKind.Loading:
        renderLoading();
        break;
      case RemoteDataKind.Error:
        renderError(fruits.error);
        break;
      case RemoteDataKind.ErrorWithData:
        renderErrorWithData(fruits.value, fruits.error);
        break;
      case RemoteDataKind.NotAsked:
        clear();
        break;
      case RemoteDataKind.Reloading:
        renderReloading(fruits.value);
        break;
      case RemoteDataKind.Success:
        renderSuccess(fruits.value);
        break;
    }
}

function main() {
    renderFruits(success(["Apple", "Orange", "Mango"])); // Success
    renderFruits(loading()); // Loading
    renderFruits(error("Error loading fruits")); // Error
    renderFruits(loading(success(["Apple", "Orange", "Mango"])); // Reloading
    renderFruits(error("", success(["Apple", "Orange", "Mango"]))); // ErrorWithData
}
```

## Constructor Function

### `notAsked<T, E>()`

Create a `RemoteData` with not asked state.

#### Example
```ts
const userProfile = notAsked(); // NotAsked
```

### `success<T, E>(data: T)`

Create a `RemoteData` with success state with the given data

#### Example
```ts
const userProfile = success({
  id: 1,
  username: "jane",
  firstName: "Jane",
  lastName: "Doe"
}); // Success
```

### `loading<T, E>(previous: RemoteData<T, E>)`

Create a `RemoteData` with loading state. If previous `RemoteData` is given as an argument, it will create a reloading state.

#### Example
```ts
const userProfile1 = loading(); // Loading

const oldUserProfile = success({
  id: 1,
  username: "jane",
  firstName: "Jane",
  lastName: "Doe"
}); // Success
const userProfile2 = loading(oldUserProfile); // Reloading
```

### `failure<T, E>(error: E, previous: RemoteData<T, E>)`

Create a `RemoteData` with failure state with the given error data. If previous `RemoteData` is given as an argument, it will create an error with data.

#### Example
```ts
const error = failure("Unable to load user profile!"); // Failure

const userProfile = success({
  id: 1,
  username: "jane",
  firstName: "Jane",
  lastName: "Doe"
});
const errorWithUserProfile = failure("Unable to update user profile",  userProfile); // FailureWithData
```

## Method

### `map<U>(f: (data: T) => U): RemoteData<U, E>`

TBA

#### Example
```ts
```

### `withDefault(defaultData: T): T`

TBA

#### Example
```ts
```

### `isSuccess(): boolean`

TBA

#### Example
```ts
```

### `isNotAsked(): boolean`

TBA

#### Example
```ts
```

### `isLoading(): boolean`


TBA

#### Example
```ts
```

### `hasError(): boolean`

TBA

#### Example
```ts
```

### `hasData(): boolean`


TBA

#### Example
```ts
```

### `mapError<E2>(f: (error: E) => E2): RemoteData<T, E2>`

TBA

#### Example
```ts
```

### `withDefaultError(error: E): E`

TBA

#### Example
```ts
```

### `do(f: (data: T) => void): RemoteData<T, E>`

TBA

#### Example
```ts
```

### `toMaybe(): Maybe<T>`

TBA

### Example
```ts
```


## Install
```
npm install -S @abadi199/remotedata
```

## Contributing
- Submit a pull request! If you're missing a feature you want to have, or just found a bug, or found an error in the docs, please submit a pull request.
- Create an issue! If you found a bug or want a new feature that you think will make the library better, but don't have time to do it yourself, please submit an issue.