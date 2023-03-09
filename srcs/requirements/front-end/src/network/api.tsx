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
        if (axios.isAxiosError(err)) {
                const error = err as any;
                errorFunc({
                    code: error.code,
                    message: error.response?.data?.message,           
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
        if (axios.isAxiosError(err)) {
                const error = err as any;
                errorFunc({
                    code: error.code,
                    message: error.response?.data?.message,           
                });
            };
    }
  }

  static async ftConnect(
    successFunc: (url: string) => void,
    errorFunc: (err: ApiError) => void
    ) {
        try {
            const data = await (await APP.get("/auth/42/connect")).data;
            successFunc(data.url);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const error = err as any;
                errorFunc({
                    code: error.code,
                    message: error.response?.data?.message,           
                });
            };
        }
    }

    static async tfaCheck(
        tfaCode: string,
        username: string,
        successFunc: () => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            await APP.get("/auth/tfa/validation/", {
                params: {
                    token: tfaCode,
                    username: username,
                },
            });
            successFunc();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const error = err as any;
                errorFunc({
                    code: error.code,
                    message: error.response?.data?.message,           
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
            if (axios.isAxiosError(err)) {
                const error = err as any;
                errorFunc({
                    code: error.code,
                    message: error.response?.data?.message,           
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
            if (axios.isAxiosError(err)) {
                const error = err as any;
                errorFunc({
                    code: error.code,
                    message: error.response?.data?.message,           
                });
            };
        }
    }

    static async getFriends(
        successFunc: (list: any) => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            const res = await APP.get("/relation/get/friend");
            successFunc(res.data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const error = err as any;
                errorFunc({
                    code: error.code,
                    message: error.response?.data?.message,           
                });
            };
        }
    }

    static async getIncomingRequest(
        successFunc: (list: any) => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            const res = await APP.get("/relation/get/incoming");
            successFunc(res.data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const error = err as any;
                errorFunc({
                    code: error.code,
                    message: error.response?.data?.message,           
                });
            };
        }
    }

    static async getOutgoinRequest(
        successFunc: (list: any) => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            const res = await APP.get("/relation/get/outgoing");
            successFunc(res.data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const error = err as any;
                errorFunc({
                    code: error.code,
                    message: error.response?.data?.message,           
                });
            };
        }
    }

    static async sendFriendRequest(
        uid: number,
        successFunc: () => void,
        errorFunc: (err: any) => void
    ) {
        try {
            await APP.put("/relation/create/friend/id/" + uid);
            successFunc();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const error = err as any;
                errorFunc({
                    code: error.code,
                    message: error.response?.data?.message,           
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
            if (axios.isAxiosError(err)) {
                const error = err as any;
                errorFunc({
                    code: error.code,
                    message: error.response?.data?.message,           
                });
            };
        }
    }

    static async removeRelation(
        rid: number,
        successFunc: (list: any) => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            const res = await APP.delete("/relation/delete/userid/" + rid);
            successFunc(res.data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const error = err as any;
                errorFunc({
                    code: error.code,
                    message: error.response?.data?.message,           
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
            if (axios.isAxiosError(err)) {
                const error = err as any;
                errorFunc({
                    code: error.code,
                    message: error.response?.data?.message,           
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
            if (axios.isAxiosError(err)) {
                const error = err as any;
                errorFunc({
                    code: error.code,
                    message: error.response?.data?.message,           
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
            if (axios.isAxiosError(err)) {
                const error = err as any;
                errorFunc({
                    code: error.code,
                    message: error.response?.data?.message,           
                });
            };
        }
    }
}
