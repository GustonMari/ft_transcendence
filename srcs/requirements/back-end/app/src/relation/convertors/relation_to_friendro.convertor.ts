import { FriendRO } from "../ros/friend.ro";

export function RelationToFriendROConvertor(
    id: number,
    relation: any
): FriendRO {
    return {
        id: relation.id,
        created_at: relation.created_at,
        user: (relation.from_id === id ? relation.to : relation.from),
    };
}