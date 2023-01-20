import { User } from "@prisma/client";

export default class UserRO {
    id: number;
    created_at: Date;
    updated_at: Date;
    login: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    email: string;
    state: boolean;

    constructor(obj: User) {
        this.id = obj.id;
        this.created_at = obj.created_at;
        this.updated_at = obj.updated_at;
        this.login = obj.login;
        this.first_name = obj.first_name;
        this.last_name = obj.last_name;
        this.avatar_url = obj.avatar_url;
        this.email = obj.email;
        this.state = obj.state;
    }
}
