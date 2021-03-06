import {
  loading,
  RemoteDataKind,
  success,
  failure,
  notAsked,
  RemoteData
} from "../src/index";

describe("RemoteData", () => {
  describe("notAsked", () => {
    it("should create notAsked", () => {
      const remoteData = notAsked();
      expect(remoteData.kind).toEqual(RemoteDataKind.NotAsked);
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.isNotAsked()).toBeTruthy();
      expect(remoteData.hasData()).toBeFalsy();
      expect(remoteData.hasError()).toBeFalsy();
    });
    it("should return return nothing", () => {
      const remoteData: RemoteData<string, string> = notAsked();
      const maybe = remoteData.toMaybe();
      expect(maybe.isNothing()).toBeTruthy();
    });
  });

  describe("success", () => {
    it("should create success with data", () => {
      const data = "Data";
      const remoteData = success(data);
      expect(remoteData.kind).toEqual(RemoteDataKind.Success);
      if (remoteData.hasData()) {
        expect(remoteData.data).toEqual(data);
      }
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.isNotAsked()).toBeFalsy();
      expect(remoteData.hasData()).toBeTruthy();
      expect(remoteData.hasError()).toBeFalsy();
    });
    it("should map string to number", () => {
      const str = "Hello World";
      const num = str.length;
      const remoteData = success(str).map(data => data.length);
      expect(remoteData.hasData()).toBeTruthy();
      if (remoteData.kind === RemoteDataKind.Success) {
        expect(remoteData.data).toEqual(num);
      }
    });
    it("should return the data when withDefault is called", () => {
      const str = "Hello World";
      const defaultData = "This is default data";
      const remoteData = success(str);
      const data = remoteData.withDefault(defaultData);
      expect(data).toEqual(str);
    });
    it("should return default error when withDefaultError is called", () => {
      const defaultError = "This is a default error";
      const error = success("Hello World").withDefaultError(defaultError);
      expect(error).toEqual(defaultError);
    });

    it("should be able to access .data after checking for hasData()", () => {
      const str = "Hello World";
      const remoteData: RemoteData<string, string> = success(str);
      if (remoteData.hasData()) {
        expect(remoteData.data).toEqual(str);
      }
    });
    it("should return return just", () => {
      const str = "Hello World";
      const remoteData: RemoteData<string, string> = success(str);
      const maybe = remoteData.toMaybe();
      expect(maybe.isJust()).toBeTruthy();
    });
    it("should do side effect", () => {
      const value = { counter: 0 };
      success("Hello World").do(_ => {
        value.counter = value.counter + 1;
      });
      expect(value.counter).toEqual(1);
    });
  });

  describe("loading", () => {
    it("should create loading when given no argument", () => {
      const remoteData = loading();
      expect(remoteData.kind).toEqual(RemoteDataKind.Loading);
      expect(remoteData.isNotAsked()).toBeFalsy();
      expect(remoteData.isLoading()).toBeTruthy();
      expect(remoteData.hasData()).toBeFalsy();
      expect(remoteData.hasError()).toBeFalsy();
    });
    it("should create loading when given notAsked", () => {
      const remoteData = loading(notAsked());
      expect(remoteData.kind).toEqual(RemoteDataKind.Loading);
      expect(remoteData.isLoading()).toBeTruthy();
      expect(remoteData.hasData()).toBeFalsy();
    });
    it("should create reloading when given success", () => {
      const data = "Data";
      const remoteData = loading(success(data));
      if (remoteData.kind === RemoteDataKind.Reloading) {
        expect(remoteData.isLoading()).toBeTruthy();
        expect(remoteData.data).toEqual(data);
        expect(remoteData.hasData()).toBeTruthy();
      } else {
        expect(remoteData.kind).toEqual(RemoteDataKind.Reloading);
      }
    });
    it("should create reloading when given error with data", () => {
      const data = "Data";
      const remoteData = loading(failure("Error", success(data)));
      if (remoteData.kind === RemoteDataKind.Reloading) {
        expect(remoteData.isLoading()).toBeTruthy();
        expect(remoteData.data).toEqual(data);
        expect(remoteData.hasData()).toBeTruthy();
      } else {
        expect(remoteData.kind).toEqual(RemoteDataKind.Reloading);
      }
    });
    it("should create loading when given error with no data", () => {
      const remoteData = loading(failure("Error"));
      if (remoteData.kind === RemoteDataKind.Loading) {
        expect(remoteData.isLoading()).toBeTruthy();
        expect(remoteData.hasData()).toBeFalsy();
      } else {
        expect(remoteData.kind).toEqual(RemoteDataKind.Loading);
      }
    });
    it("should create loading when given loading", () => {
      const remoteData = loading(loading());
      expect(remoteData.kind).toEqual(RemoteDataKind.Loading);
      expect(remoteData.isLoading()).toBeTruthy();
      expect(remoteData.hasData()).toBeFalsy();
    });
    it("should create reloading when given reloading", () => {
      const data = "Data";
      const remoteData = loading(loading(success(data)));
      if (remoteData.kind === RemoteDataKind.Reloading) {
        expect(remoteData.data).toEqual(data);
        expect(remoteData.isLoading()).toBeTruthy();
        expect(remoteData.hasData()).toBeTruthy();
      } else {
        expect(remoteData.kind).toEqual(RemoteDataKind.Reloading);
      }
    });
    it("should be able to access .data after checking for hasData()", () => {
      const str = "Hello World";
      const remoteData = loading(success(str));
      if (remoteData.hasData()) {
        expect(remoteData.data).toEqual(str);
      }
    });
    it("should return return just", () => {
      const str = "Hello World";
      const remoteData: RemoteData<string, string> = loading(success(str));
      const maybe = remoteData.toMaybe();
      expect(maybe.isJust()).toBeTruthy();
    });
    it("should return return nothing", () => {
      const remoteData: RemoteData<string, string> = loading();
      const maybe = remoteData.toMaybe();
      expect(maybe.isNothing()).toBeTruthy();
    });
    it("should not do side effect", () => {
      const value = { counter: 0 };
      loading().do(_ => {
        value.counter = value.counter + 1;
      });
      expect(value.counter).toEqual(0);
    });
  });

  describe("error", () => {
    const errorMessage = "Help!";
    it("should create error when given no argument", () => {
      const remoteData = failure(errorMessage);
      expect(remoteData.kind).toEqual(RemoteDataKind.Failure);
      if (remoteData.hasError()) {
        expect(remoteData.error).toEqual(errorMessage);
      }
      expect(remoteData.isNotAsked()).toBeFalsy();
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.hasData()).toBeFalsy();
      expect(remoteData.hasError()).toBeTruthy();
    });
    it("should create error with no data when given notAsked", () => {
      const remoteData = failure(errorMessage, notAsked());
      expect(remoteData.kind).toEqual(RemoteDataKind.Failure);
      if (remoteData.hasError()) {
        expect(remoteData.error).toEqual(errorMessage);
      }
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.hasData()).toBeFalsy();
    });
    it("should create error with no data when given loading", () => {
      const remoteData = failure(errorMessage, loading());
      expect(remoteData.kind).toEqual(RemoteDataKind.Failure);
      if (remoteData.hasError()) {
        expect(remoteData.error).toEqual(errorMessage);
      }
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.hasData()).toBeFalsy();
    });
    it("should create error with data when given success", () => {
      const data = "Data";
      const remoteData = failure(errorMessage, success(data));
      if (remoteData.kind === RemoteDataKind.FailureWithData) {
        expect(remoteData.error).toEqual(errorMessage);
        expect(remoteData.data).toEqual(data);
        expect(remoteData.isLoading()).toBeFalsy();
        expect(remoteData.hasData()).toBeTruthy();
      } else {
        expect(remoteData.kind).toEqual(RemoteDataKind.FailureWithData);
      }
    });
    it("should create error with data when given reloading", () => {
      const data = "Data";
      const remoteData = failure(errorMessage, loading(success(data)));
      if (remoteData.kind === RemoteDataKind.FailureWithData) {
        expect(remoteData.error).toEqual(errorMessage);
        expect(remoteData.data).toEqual(data);
        expect(remoteData.isLoading()).toBeFalsy();
        expect(remoteData.hasData()).toBeTruthy();
      } else {
        expect(remoteData.kind).toEqual(RemoteDataKind.FailureWithData);
      }
    });
    it("should create error with new message and no data when given error", () => {
      const remoteData = failure(errorMessage, failure("Old Error Message"));
      expect(remoteData.kind).toEqual(RemoteDataKind.Failure);
      if (remoteData.hasError()) {
        expect(remoteData.error).toEqual(errorMessage);
      }
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.hasData()).toBeFalsy();
    });
    it("should create error with new message and data when given error with data", () => {
      const data = "Data";
      const remoteData = failure(
        errorMessage,
        failure("Old Error Message", success(data))
      );
      if (remoteData.hasData() && remoteData.hasError()) {
        expect(remoteData.data).toEqual(data);
        expect(remoteData.error).toEqual(errorMessage);
        expect(remoteData.isLoading()).toBeFalsy();
      } else {
        expect(remoteData.kind).toEqual(RemoteDataKind.FailureWithData);
      }
    });
    it("should mapError from string to number", () => {
      const errStr = "This is an error";
      const errNum = errStr.length;
      const remoteData = failure(errStr).mapError(err => err.length);
      expect(remoteData.hasError()).toBeTruthy();
      if (remoteData.kind === RemoteDataKind.Failure) {
        expect(remoteData.error).toEqual(errNum);
      }
    });
    it("should return error when withDefaultError is called", () => {
      const err = "This is an error";
      const defaultError = "This is a default error";
      const remoteData = failure(err);
      const errData = remoteData.withDefaultError(defaultError);
      expect(errData).toEqual(err);
    });
    it("should return default data when withDefault", () => {
      const err = "This is an error";
      const defaultData = "This is a default data";
      const data = failure(err).withDefault(defaultData);
      expect(data).toEqual(defaultData);
    });
    it("should not do side effect", () => {
      const value = { counter: 0 };
      failure("This is an error").do(_ => {
        value.counter = value.counter + 1;
      });
      expect(value.counter).toEqual(0);
    });
    it("should return return just", () => {
      const str = "Hello World";
      const remoteData: RemoteData<string, string> = failure(
        "This is an error",
        success(str)
      );
      const maybe = remoteData.toMaybe();
      expect(maybe.isJust()).toBeTruthy();
    });
    it("should return return nothing", () => {
      const remoteData: RemoteData<string, string> = failure(
        "This is an error"
      );
      const maybe = remoteData.toMaybe();
      expect(maybe.isNothing()).toBeTruthy();
    });
  });
});
