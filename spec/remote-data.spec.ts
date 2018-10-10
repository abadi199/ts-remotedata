import {
  loading,
  RemoteDataKind,
  success,
  failure,
  notAsked
} from "../src/index";

describe("RemoteData", () => {
  describe("notAsked", () => {
    it("should create notAsked", () => {
      const remoteData = notAsked();
      console.log(typeof remoteData);
      expect(remoteData.kind).toEqual(RemoteDataKind.NotAsked);
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.isNotAsked()).toBeTruthy();
      expect(remoteData.hasData()).toBeFalsy();
      expect(remoteData.hasError()).toBeFalsy();
    });
  });

  describe("success", () => {
    it("should create success with data", () => {
      const data = "Data";
      const remoteData = success(data);
      expect(remoteData.kind).toEqual(RemoteDataKind.Success);
      expect(remoteData.data).toEqual(data);
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.isNotAsked()).toBeFalsy();
      expect(remoteData.hasData()).toBeTruthy();
      expect(remoteData.hasError()).toBeFalsy();
    });
    it("should map string to int", () => {
      const str = "Hello World";
      const num = str.length;
      const data = success(str).map(d => d.length);
      expect(data.hasData()).toBeTruthy();
      if (data.kind === RemoteDataKind.Success) {
        expect(data.data).toEqual(num);
      }
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
  });

  describe("error", () => {
    const errorMessage = "Help!";
    it("should create error when given no argument", () => {
      const remoteData = failure(errorMessage);
      expect(remoteData.kind).toEqual(RemoteDataKind.Failure);
      expect(remoteData.error).toEqual(errorMessage);
      expect(remoteData.isNotAsked()).toBeFalsy();
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.hasData()).toBeFalsy();
      expect(remoteData.hasError()).toBeTruthy();
    });
    it("should create error with no data when given notAsked", () => {
      const remoteData = failure(errorMessage, notAsked());
      expect(remoteData.kind).toEqual(RemoteDataKind.Failure);
      expect(remoteData.error).toEqual(errorMessage);
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.hasData()).toBeFalsy();
    });
    it("should create error with no data when given loading", () => {
      const remoteData = failure(errorMessage, loading());
      expect(remoteData.kind).toEqual(RemoteDataKind.Failure);
      expect(remoteData.error).toEqual(errorMessage);
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
      expect(remoteData.error).toEqual(errorMessage);
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.hasData()).toBeFalsy();
    });
    it("should create error with new message and data when given error with data", () => {
      const data = "Data";
      const remoteData = failure(
        errorMessage,
        failure("Old Error Message", success(data))
      );
      if (remoteData.kind === RemoteDataKind.FailureWithData) {
        expect(remoteData.error).toEqual(errorMessage);
        expect(remoteData.data).toEqual(data);
        expect(remoteData.isLoading()).toBeFalsy();
        expect(remoteData.hasData()).toBeTruthy();
      } else {
        expect(remoteData.kind).toEqual(RemoteDataKind.FailureWithData);
      }
    });
  });
});
