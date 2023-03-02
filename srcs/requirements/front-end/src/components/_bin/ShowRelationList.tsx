import { useState } from "react";
import API from "../../network/api";
import { RelationList } from "./RelationList";

export const ShowRelationList = (props: any) => {
  const [showList, setShowList] = useState(false);

  return (
    <>
      <div className="container">
        {showList && (
            <RelationList title="friend"/>
        )}
        {(
            <>
                <button className="show_requests" onClick={(e) => {
                    e.preventDefault();
                    setShowList(showList ? false : true);
                }}>Show requests</button>
            </>
        )}
      </div>
    </>
  );
};
