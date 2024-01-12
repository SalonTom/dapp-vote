import RequesterList from "../requesterList/RequesterList";
import ContractUtils from '../../utils/contractUtils';
import UserUtils from '../../utils/userUtils';
import '../../App.css';
import { useState, useEffect } from "react";

function AdminDashboard() {

    const contractUtils = (new ContractUtils()).instance;
    const connectedAddress = localStorage.getItem("user_address");
    const currentStep = localStorage.getItem("currentStep");
    
    const [proposalList, setProposalList] = useState([])

    const nextStepAsync = async () => {
        UserUtils.checkUserConnected();
        await contractUtils.methods.nextStep().send({ from: connectedAddress });
        window.location.reload();
    }

    useEffect(() => {
        const getProposalListAsync = async () => {
            setProposalList(await contractUtils.methods.getAllProposals().call());
        };

        getProposalListAsync();
    });

    return (
        <>
            <div className='gradient-container rounded' style={{ margin: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between"}}>
                    <div>
                        Current step : <span className='title'>{ currentStep }</span>
                    </div>
                    <div className='button' onClick={nextStepAsync}>
                        Next session status
                    </div>
                </div>
            </div>
            <div style={{display : "flex", gap : '12px', margin: "0px 32px"}}>
                <div className='gradient-container rounded' style={{ flexGrow: 1 }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "36px"
                        }}
                        >
                        <div className="title">Propositions list</div>
                        <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
                            {
                                proposalList.length == 0 ?
                                <span className="body">No proposal have been registered yet...</span>
                                :
                                proposalList.map((proposal, index) => 
                                    <div className="rounded" style={{ border: "1px white solid", display: "flex", justifyContent: "space-between" }}>
                                        <div>
                                            <div className="body bold">{proposal.proposal.description}</div>
                                            <div>{proposal.owner}</div>
                                        </div>
                                        <div>{Number(proposal.proposal.voteCount)}</div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div style={{ flexGrow: 1 }}>
                    <RequesterList></RequesterList>
                </div>
            </div>
        </>
    )
}

export default AdminDashboard;