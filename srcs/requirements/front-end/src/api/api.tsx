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
        successFunc: (data: any) => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            const r = await APP.get("/user/me");
            successFunc(r.data);
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

    static async getFriends(
        successFunc: (list: any) => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            const res = await APP.get("/relation/friend/get/list");
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

    static async getIncomingRequest(
        successFunc: (list: any) => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            const res = await APP.get("/relation/friend/request/get/incoming");
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

    static async getOutgoinRequest(
        successFunc: (list: any) => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            const res = await APP.get("/relation/friend/request/get/incoming");
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

    static async sendFriendRequest(
        uid: number,
        successFunc: () => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            await APP.put("/relation/friend/request/add/id/" + uid);
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

    static async acceptRequest(
        rid: number,
        successFunc: (list: any) => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            const res = await APP.patch("/relation/friend/request/accept/id/" + rid);
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

    static async removeRequest(
        rid: number,
        successFunc: (list: any) => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            const res = await APP.delete("/relation/friend/request/remove/id/" + rid);
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

    static async updateProfile (
        opt: any,
        successFunc: () => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            await APP.patch("/user/profile/me/update", opt);
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

    static async searchUser (
        opt: string | null,
        successFunc: (r: any) => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            const r = await APP.get("/user/match/string/" + opt);
            successFunc(r.data);
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
