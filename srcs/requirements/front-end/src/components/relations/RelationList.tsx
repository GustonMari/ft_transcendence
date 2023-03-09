import React, { useContext } from 'react';
import { AlertContext } from '../../contexts/Alert.context';
import API from '../../network/api';
import s from '../../styles/relations/RelationList.module.css'

export const RelationList = ({relations, setRelation, cpnt}: any) => {

    const {handleSuccess, handleError}: any = useContext(AlertContext);

    const removeElem = (id: number) => {
        setRelation(relations.filter((relation: any) => relation.user.id !== id));
        API.removeRelation(id,
            () => {
                handleSuccess("Friend has been removed");
            }, (err: any) => {
                handleError(err.message);
            });
    }

    let relatio = [
        {
            id: 1,
            login: "user1",
            first_name: "user",
            last_name: "user",
            state: true,
            description: "je suis un test !je suis un test !"
        },
        {
            id: 2,
            login: "user2",
            first_name: "user",
            last_name: "user",
            state: true,
            description: "je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !"
        },
        {
            id: 3,
            login: "user3",
            first_name: "user",
            last_name: "user",
            state: false,
            description: "je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !je suis un test !"
        },
    ]

    return (
        <>
            <div className={s.container}>
                <div className={s.table_wrap}>
                    <table>
                        {
                            (!relations || !relations[0]) &&
                            <>
                                <p className={s.empty_msg}>Empty List</p>
                            </>
                        }
                        {relations && relations[0] && 
                            <tbody>
                                {
                                relations.map((obj: any) => {
                                    let clone = React.createElement(cpnt, { user: obj.user, removeElem: (id: number) => {removeElem(id)} });
                                    return (<tr>{clone}</tr>);
                                })}
                            </tbody>
                        }
                    </table>
                </div>
            </div>
        </>
    )
}
