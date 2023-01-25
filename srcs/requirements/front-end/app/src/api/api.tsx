import axios, { AxiosInstance } from "axios";
import { RegisterOptions, SignInOptions } from "../interfaces";
import APP from "./app";

export default class API {

  static async signIn(
    opt: SignInOptions,
    successFunc: () => void,
    errorFunc: (err: any) => void
  ) {
    try {
      await APP.post("/auth/signin", opt);
      successFunc();
    } catch (err) {
      errorFunc(err);
    }
  }

  static async register(
    opt: RegisterOptions,
    successFunc: () => void,
    errorFunc: (err: any) => void
  ) {
    try {
      await APP.post("/auth/register", opt);
      successFunc();
    } catch (err) {
      errorFunc(err);
    }
  }

    static async checkAuth(
        successFunc: () => void,
        errorFunc: (err: any) => void
    ) {
        try {
            await APP.get("/user/me");
            successFunc();
        } catch (err) {
            errorFunc(err);
        }
    }

    static async logOut(
        successFunc: () => void,
        errorFunc: (err: any) => void
    ) {
        try {
            await APP.delete("/auth/logout");
            successFunc();
        } catch (err) {
            errorFunc(err);
        }
    }
}
