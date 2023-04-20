import axios, { AxiosError, AxiosInstance } from "axios";
import { RegisterOptions, SignInOptions } from "../interfaces";
import { ApiError } from "../interfaces/error.interface";
import {APP} from "./app";

export default class API {

  static async signIn(
    opt: SignInOptions,
    successFunc: (url: string) => void,
    errorFunc: (err: ApiError) => void
  ) {
    try {
      const d: any = await (await APP.post("/auth/signin", opt)).data;
      successFunc(d.url);
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

    /* ------------------------------------------------------------------------------ */

    static async getRelation (
        url: string,
        successFunc: (list: any) => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            const res = await APP.get(url);
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
            await APP.post("/relation/create", {
                id_target: uid,
                relation_type: "PENDING",

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

    static async acceptRequest (
        rid: number,
        successFunc: () => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            await APP.put("/relation/accept/id/" + rid);
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

    static async removeRelation (
        rid: number,
        successFunc: () => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            await APP.delete("/relation/delete/id/" + rid);
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

    static async blockUser(
        uid: number,
        successFunc: () => void,
        errorFunc: (err: any) => void
        ) {
            try {
                await APP.post("/relation/create", {
                    id_target: uid,
                    relation_type: "BLOCKED",
                    
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

    /* ------------------------------------------------------------------------------ */
        
    static async getUser(
        id: number,
        successFunc: (user: any) => void,
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

    static async changePP (
        opt: FormData,
        successFunc: (r: any) => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            const r = await APP.post("/user/profile/upload", opt, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
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

    static async getHistory (
        id: number,
        successFunc: (r: any) => void,
        errorFunc: (err: ApiError) => void
    ) {
        try {
            const r = await APP.get("/user/history/get/" + id);
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
