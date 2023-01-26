import axios, { AxiosError, AxiosInstance } from "axios";
import { RegisterOptions, SignInOptions } from "../interfaces";
import { ApiError } from "../interfaces/error.interface";
import {APP} from "./app";

export default class API {

  static async signIn(
    opt: SignInOptions,
    successFunc: () => void,
    errorFunc: (err: ApiError) => void
  ) {
    try {
      await APP.post("/auth/signin", opt);
      successFunc();
    } catch (err) {
        const error = err as AxiosError;
        if (axios.isAxiosError(err)) {
            errorFunc({
                code: error.code,
                message: error.message,           
            });
        };
    }
  }

  static async register(
    opt: RegisterOptions,
    successFunc: () => void,
    errorFunc: (err: ApiError) => void
  ) {
    
    try {
      await APP.post("/auth/register", opt);
      successFunc();
    } catch (err) {
        const error = err as AxiosError;
        if (axios.isAxiosError(err)) {
            errorFunc({
                code: error.code,
                message: error.message,           
            });
        };
    }
  }

    static async checkAuth(
        successFunc: () => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            await APP.get("/user/me");
            successFunc();
        } catch (err) {
            const error = err as AxiosError;
            if (axios.isAxiosError(err) && error.code !== "401") {
                try {
                    await APP.get("/auth/refresh")
                    successFunc();
                } catch (err2) {
                    const error_2 = err2 as AxiosError;
                    if (axios.isAxiosError(err)) {
                        errorFunc({
                            code: error_2.code,
                            message: error_2.message,           
                        });
                    };
                }
            };
            errorFunc({
                code: error.code,
                message: error.message,           
            });
        }
    }

    static async logOut(
        successFunc: () => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            await APP.delete("/auth/logout");
            successFunc();
        } catch (err) {
            const error = err as AxiosError;
            if (axios.isAxiosError(err)) {
                errorFunc({
                    code: error.code,
                    message: error.message,           
                });
            };
        }
    }

    static async getUser(
        id: number,
        successFunc: (list: any) => void,
        errorFunc: (err: ApiError) => void
    ) : Promise<any> {
        try {
            const res = await APP.get("/user/get/" + id);
            successFunc(res.data);
        } catch (err) {
            const error = err as AxiosError;
            if (axios.isAxiosError(err)) {
                errorFunc({
                    code: error.code,
                    message: error.message,           
                });
            };
        }
    }
}
