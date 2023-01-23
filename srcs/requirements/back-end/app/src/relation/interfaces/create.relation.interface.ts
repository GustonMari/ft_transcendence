import { RELATION_STATE } from '@prisma/client';

export interface CreateRelationOptions {

    from_id: number;

    to_id: number;

    state: RELATION_STATE;
}