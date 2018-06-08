import {
  loading,
  RemoteDataKind,
  success,
  error,
  notAsked,
  update
} from "../src/index";

describe("RemoteData", () => {
  describe("notAsked", () => {
    it("should create notAsked", () => {
      const remoteData = notAsked();
      console.log(typeof remoteData);
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

describe("update", () => {
  it("should keep prev data when given an error with no data", () => {
    const data = "Data";
    const err = "Error"
    const prev = success(data);
    const next = error(err);
    const actual = update(prev, next);
    if (actual.kind === RemoteDataKind.ErrorWithData) {
      expect(actual.value).toEqual(data);
      expect(actual.error).toEqual(err); 
    } else {
      expect(actual.kind).toEqual(RemoteDataKind.ErrorWithData)
    }
  });
  it("should keep prev data when given a loading", () => {
    const data = "Data";
    const prev = success(data);
    const next = loading();
    const actual = update(prev, next);
    if (actual.kind === RemoteDataKind.Reloading) {
      expect(actual.value).toEqual(data);
    } else {
      expect(actual.kind).toEqual(RemoteDataKind.Reloading)
    }
  });
  it("should keep next when given a success", () => {
    const data = "Data";
    const prev = success("Old");
    const next = success(data);
    const actual = update(prev, next);
    if (actual.kind === RemoteDataKind.Success) {
      expect(actual.value).toEqual(data);
    } else {
      expect(actual.kind).toEqual(RemoteDataKind.Success)
    }
  });
  it("should keep next when given an error with data", () => {
    const data = "Data";
    const err = "Error"
    const prev = success("Old");
    const next = error(err, success(data));
    const actual = update(prev, next);
    if (actual.kind === RemoteDataKind.ErrorWithData) {
      expect(actual.value).toEqual(data);
      expect(actual.error).toEqual(err);
    } else {
      expect(actual.kind).toEqual(RemoteDataKind.ErrorWithData)
    }
  });
  it("should keep next when given a not asked", () => {
    const prev = success("Old");
    const next = notAsked();
    const actual = update(prev, next);
    expect(actual.kind).toEqual(RemoteDataKind.NotAsked)
  });
  it("should keep prev data when given a reloading", () => {
    const data = "Data";
    const prev = success("Old");
    const next = loading(success(data));
    const actual = update(prev, next);
    if (actual.kind === RemoteDataKind.Reloading) {
      expect(actual.value).toEqual(data);
    } else {
      expect(actual.kind).toEqual(RemoteDataKind.Reloading)
    }
  });
});