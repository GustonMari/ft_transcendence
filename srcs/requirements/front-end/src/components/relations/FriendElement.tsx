import s from '../../styles/relations/FriendElement.module.css'

export const FriendElement = ({user, removeElem} : any) => {
    return (
        <>
            <tr className={s.line}>
                <td className={s.name_section}>
                    <img className={s.profile_picture} src="https://placehold.co/150x150"></img>
                    <div className={s.names}>
                        <p className={s.login}>{user.login}</p>
                    </div>
                </td>
                <td className={s.btn}>
                    {/* <button className={s.btn_remove} onClick={() => {removeElem()}}>Remove</button> */}
                </td>
            </tr>
        </>
    )
}