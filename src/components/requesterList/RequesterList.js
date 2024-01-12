import { useState, useEffect } from "react";
import ContractUtils from '../../utils/contractUtils';

import Requester from "../requester/Requester";

function RequesterList() {

    const contractUtils = (new ContractUtils()).instance;

    const [requesterList, setRequesterList] = useState([]);
  
    useEffect(() => {
      const getRequesterListAsync = async () => {
        setRequesterList(await contractUtils.methods.getWhitelist().call());
      };
      getRequesterListAsync();
    });
  
    return (
      <div className="gradient-container rounded">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "36px"
          }}
        >
          <div className="title">Voters list</div>
          <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
            {
                requesterList.length == 0 ?
                <span className="body">No voter whitelisted or waiting to be ...</span>
                :
                requesterList.map((requester, index) => (
                    <Requester
                        key={index}
                        owner={requester.owner}
                        whitelisted={requester.wL}
                    ></Requester>
                    ))
            }
          </div>
        </div>
      </div>
    );
  }
  
  export default RequesterList;