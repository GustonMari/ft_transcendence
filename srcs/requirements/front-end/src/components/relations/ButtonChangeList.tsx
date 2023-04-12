import s from '../../styles/relations/ButtonChangeList.module.css'

export const ButtonChangeList = ({setList, title, listNumber}: any) => {

    const handleAction = (e: any) => {
        e.preventDefault();
        setList(listNumber);
    }

    return (
        <>
            <div>
                <button className={s.button} onClick={(e: any) => {handleAction(e)}}>
                    {title}
                </button>
            </div>
        </>
    )
}