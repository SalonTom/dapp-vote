import { useState, useEffect } from "react";
import ContractUtils from '../../utils/contractUtils';

import Requester from "../requester/Requester";

function RequesterList({ connectedAddress }) {

    const contractUtils = (new ContractUtils()).instance;

    const [requesterList, setRequesterList] = useState([]);

    const whitelistAsync = async (requesterId, owner) => {
      await contractUtils.methods
        .registerVoter(owner)
        .send({ from: connectedAddress });
      
        const updatedRequestList = [...requesterList];
        updatedRequestList[requesterId].wL = true;
        setRequesterList(updatedRequestList);
    };
  
    useEffect(() => {
      const getRequesterListAsync = async () => {
        setRequesterList(await contractUtils.methods.getWhitelist().call());
      };
      getRequesterListAsync();
    }, []);
  
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
                        requesterId= {index}
                        owner={requester.owner}
                        whitelisted={requester.wL}
                        whitelistAsync={whitelistAsync}
                    ></Requester>
                    ))
            }
          </div>
        </div>
      </div>
    );
  }
  
  export default RequesterList;