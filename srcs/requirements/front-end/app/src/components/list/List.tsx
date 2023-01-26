export const List = (props: any) => {
  return (
    <>
      <div className="container">
        <div className="list_title">
          <h2 className="text_title">{props.title}</h2>
        </div>
        <div className="list">
          <ul>
            {props.relations.map((friend: any) => {
              console.log("friend", friend);
              // if (friend.user === undefined) return ;
              return (
                <div key={friend.id} className="relation_elem">
                  {
                    <props.comp
                      login={friend.user.login}
                      state={friend.user.state}
                      id={friend.id}
                    />
                  }
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};
