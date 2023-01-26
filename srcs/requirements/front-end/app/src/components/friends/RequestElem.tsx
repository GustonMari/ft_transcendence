import API from "../../api/api";

export const RequestElem = (props: any) => {
    return (
      <>
        <div className="container">
          <li className="friend">
            <div className="friend_name">
              <h2 className="text_friend_name">{props.login}</h2>
            </div>
            <button className="accept_relation" onClick={(e) => {
                console.log("accept");
                e.preventDefault();
                API.acceptRequest(props.id, () => {
                    console.log("accepted");
                }, (err: any) => {
                    console.log(err);
                });
            }
            }>Accept</button>
            <button className="refuse_relation">Refuse</button>


          </li>
        </div>
      </>
    );
  };
  