import {
  loading,
  RemoteDataKind,
  success,
  error,
  notAsked
} from "../src/index";

describe("RemoteData", () => {
  describe("notAsked", () => {
    it("should create notAsked", () => {
      const remoteData = notAsked();
      expect(remoteData.kind).toEqual(RemoteDataKind.NotAsked);
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.hasData()).toBeFalsy();
    });
  });
  describe("success", () => {
    it("should create success with data", () => {
      const data = "Data";
      const remoteData = success(data);
      expect(remoteData.kind).toEqual(RemoteDataKind.Success);
      expect(remoteData.value).toEqual(data);
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.hasData()).toBeTruthy();
    });
  });
  describe("loading", () => {
    it("should create loading when given no argument", () => {
      const remoteData = loading();
      expect(remoteData.kind).toEqual(RemoteDataKind.Loading);
      expect(remoteData.isLoading()).toBeTruthy();
      expect(remoteData.hasData()).toBeFalsy();
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
        expect(remoteData.value).toEqual(data);
        expect(remoteData.hasData()).toBeTruthy();
      } else {
        expect(remoteData.kind).toEqual(RemoteDataKind.Reloading);
      }
    });
    it("should create reloading when given error with data", () => {
      const data = "Data";
      const remoteData = loading(error("Error", success(data)));
      if (remoteData.kind === RemoteDataKind.Reloading) {
        expect(remoteData.isLoading()).toBeTruthy();
        expect(remoteData.value).toEqual(data);
        expect(remoteData.hasData()).toBeTruthy();
      } else {
        expect(remoteData.kind).toEqual(RemoteDataKind.Reloading);
      }
    });
    it("should create loading when given error with no data", () => {
      const remoteData = loading(error("Error"));
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
        expect(remoteData.value).toEqual(data);
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
      const remoteData = error(errorMessage);
      expect(remoteData.kind).toEqual(RemoteDataKind.Error);
      expect(remoteData.error).toEqual(errorMessage);
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.hasData()).toBeFalsy();
    });
    it("should create error with no data when given notAsked", () => {
      const remoteData = error(errorMessage, notAsked());
      expect(remoteData.kind).toEqual(RemoteDataKind.Error);
      expect(remoteData.error).toEqual(errorMessage);
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.hasData()).toBeFalsy();
    }); 
    it("should create error with no data when given loading", () => {
      const remoteData = error(errorMessage, loading());
      expect(remoteData.kind).toEqual(RemoteDataKind.Error);
      expect(remoteData.error).toEqual(errorMessage);
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.hasData()).toBeFalsy();
    });
    it("should create error with data when given success", () => {
      const data = "Data";
      const remoteData = error(errorMessage, success(data));
      if (remoteData.kind === RemoteDataKind.ErrorWithData) {
        expect(remoteData.error).toEqual(errorMessage);
        expect(remoteData.value).toEqual(data);
        expect(remoteData.isLoading()).toBeFalsy();
        expect(remoteData.hasData()).toBeTruthy();
      } else {
        expect(remoteData.kind).toEqual(RemoteDataKind.ErrorWithData);
      }
    });
    it("should create error with data when given reloading", () => {
      const data = "Data";
      const remoteData = error(errorMessage, loading(success(data)));
      if (remoteData.kind === RemoteDataKind.ErrorWithData) {
        expect(remoteData.error).toEqual(errorMessage);
        expect(remoteData.value).toEqual(data);
        expect(remoteData.isLoading()).toBeFalsy();
        expect(remoteData.hasData()).toBeTruthy();
      } else {
        expect(remoteData.kind).toEqual(RemoteDataKind.ErrorWithData);
      }
    });
    it("should create error with new message and no data when given error", () => {
      const remoteData = error(errorMessage, error("Old Error Message"));
      expect(remoteData.kind).toEqual(RemoteDataKind.Error);
      expect(remoteData.error).toEqual(errorMessage);
      expect(remoteData.isLoading()).toBeFalsy();
      expect(remoteData.hasData()).toBeFalsy();
    });
    it("should create error with new message and data when given error with data", () => {
      const data = "Data";
      const remoteData = error(
        errorMessage,
        error("Old Error Message", success(data))
      );
      if (remoteData.kind === RemoteDataKind.ErrorWithData) {
        expect(remoteData.error).toEqual(errorMessage);
        expect(remoteData.value).toEqual(data);
        expect(remoteData.isLoading()).toBeFalsy();
        expect(remoteData.hasData()).toBeTruthy();
      } else {
        expect(remoteData.kind).toEqual(RemoteDataKind.ErrorWithData);
      }
    });
  });
});
