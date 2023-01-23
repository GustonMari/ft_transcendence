import { RemoveRelationOptions } from '.';

export declare type FindRelationOptions = RemoveRelationOptions & {
    include?: {
        from?: boolean;
        to?: boolean;
    };
};