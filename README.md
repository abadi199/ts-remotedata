# RemoteData for TypeScript
Inspired by Kris Jenkin's Elm RemoteData package and his blog post:
http://blog.jenkster.com/2016/06/how-elm-slays-a-ui-antipattern.html

## Example
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

## Install
```
npm install -S @abadi199/remotedata
```

## Contributing
- Submit a pull request! If you're missing a feature you want to have, or just found a bug, or found an error in the docs, please submit a pull request.
- Create an issue! If you found a bug or want a new feature that you think will make the library better, but don't have time to do it yourself, please submit an issue.