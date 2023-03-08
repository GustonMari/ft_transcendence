import React from 'react';
import s from '../../styles/relations/RelationList.module.css'

export const RelationList = ({relations, setRelation, cpnt}: any) => {

    const removeElem = (id: number) => {
        setRelation(relations.filter((relation: any) => relation.id !== id));
    }

    let relatio = [
        {
            id: 1,
            login: "user1"
        },
        {
            id: 2,
            login: "user2"
        },
        {
            id: 3,
            login: "user3"
        },
    ]

    return (
        <>
            <table>
                <tbody className={s.container}>
                    {relatio.map((user: any) => {
                        let clone = React.createElement(cpnt, { user: user, removeElem: () => {removeElem(user.id)} });
                        return (<div>{clone}</div>);
                    })}
                </tbody>
            </table>
        </>
    )
}
