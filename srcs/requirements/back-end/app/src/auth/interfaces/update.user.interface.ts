export interface UpdateUserOptions {
    avatar_url?: string;
    password?: string;
    rt? : string;
    first_name?: string;
    last_name?: string;
    description?: string;
    tfa?: boolean;
    tfa_secret?: string;
    login?: string;
}
