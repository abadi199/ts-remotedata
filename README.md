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

### `notAsked()`

TBA

#### Example
```
```

### `success()`

TBA

#### Example
```
```

### `loading()`

TBA

#### Example
```
```

### `failture()`

TBA

#### Example
```
```

## Method

### `map<U>(f: (data: T) => U): RemoteData<U, E>`

TBA

#### Example
```
```

### `withDefault(defaultData: T): T`

TBA

#### Example
```
```

### `isSuccess(): boolean`

TBA

#### Example
```
```

### `isNotAsked(): boolean`

TBA

#### Example
```
```

### `isLoading(): boolean`


TBA

#### Example
```
```

### `hasError(): boolean`

TBA

#### Example
```
```

### `hasData(): boolean`


TBA

#### Example
```
```

### `mapError<E2>(f: (error: E) => E2): RemoteData<T, E2>`

TBA

#### Example
```
```

### `withDefaultError(error: E): E`

TBA

#### Example
```
```

### `do(f: (data: T) => void): RemoteData<T, E>`

TBA

#### Example 
```
```

### `toMaybe(): Maybe<T>`

TBA

### Example
```
```


## Install
```
npm install -S @abadi199/remotedata
```

## Contributing
- Submit a pull request! If you're missing a feature you want to have, or just found a bug, or found an error in the docs, please submit a pull request.
- Create an issue! If you found a bug or want a new feature that you think will make the library better, but don't have time to do it yourself, please submit an issue.