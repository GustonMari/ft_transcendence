import { ProfileField } from './../interfaces/profileField.interface';
import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from "@nestjs/common";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
    constructor() {
        super({
            // clientID: process.env.FT_CLIENT_ID,
            // clientSecret: process.env.FT_CLIENT_SECRET,
            // callbackURL: process.env.FT_CALLBACK_URL,
            // passReqToCallback: true,
            // scope: 'public',

            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/api/auth/42/callback',
            profileFields: {
                id: (obj: any) => {return String(obj.id);},
                email: 'email',
                username: 'login',
                avatar: 'image.link',
                displayName: 'displayname',
            },
        });
    }

    async validate (
        _at: string,
        _rt: string,
        profile: ProfileField,
    ) {
        if (profile && !profile.avatar) {profile.avatar = 'METTRE_UN_FICHIER_PAR_DEFAULT';} //TODO : mettre un fichier par default
        if (profile && profile.id && profile.username) {return {profile};}
        else {throw new Error('connect to 42 failed due to invalid profile')}
    }
}