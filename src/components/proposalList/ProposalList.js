import { useEffect, useState } from 'react';
import '../../App.css';

import ContractUtils from '../../utils/contractUtils';
import Proposal from '../proposal/Proposal';
import UserUtils from '../../utils/userUtils';

function ProposalList({ connecteddAddress, currentStep }) {

    const contractUtils = (new ContractUtils()).instance;

    const  [proposalList, setProposalList] = useState([]);
    const [newProposalDescription, setInputValue] = useState('');

    const registerProposalAsync = async () => {
        console.log('Description : ', newProposalDescription);

        await contractUtils.methods.registerProposal(newProposalDescription).send({ from : connecteddAddress });
        const updatedProposalList = [...proposalList];
        updatedProposalList.push({ id : proposalList.length, owner : connecteddAddress , proposal : { description : newProposalDescription, voteCount: 0}});

        setProposalList(updatedProposalList);
        setInputValue('');
        manageModale();
    };

    const voteProposalAsync = async (proposalId) => {
        await contractUtils.methods.registerVote(proposalId).send({ from : connecteddAddress });
        const updatedProposalListWithVote = [...proposalList];
        updatedProposalListWithVote[proposalId].proposal.voteCount++;

        setProposalList(updatedProposalListWithVote);
        setUserVote(proposalId);
    }

    const [modaleIsOpen, setModaleIsOpen] = useState(false);
    const [userHasVoted, setUserHasVoted] = useState(false);
    const [userVote, setUserVote] = useState(-1);
    
    const manageModale = () => {
        setModaleIsOpen(!modaleIsOpen);
    }

    useEffect(() => {
        const getProposalListAsync = async () => {
            if (currentStep == '5') {
                setProposalList(await contractUtils.methods.getWinningProposal().call());
            } else {
                setProposalList(await contractUtils.methods.getAllProposals().call());
            }
          };

        const getUserVote = async () => {
            const uhs = await contractUtils.methods.getUserHasVoted(connecteddAddress).call();
            setUserHasVoted(uhs)
            console.log(uhs)
            if (uhs) {
                setUserVote(Number(await contractUtils.methods.getUserVote(connecteddAddress).call()))
            }
          };
      
          getProposalListAsync();
          getUserVote();

    }, []);

    return (
        <>
            <div className='gradient-container rounded' style={{ margin: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className='title'>Proposition list</div>
                    {currentStep == '1'? (
                        <div className='logout-button-link' onClick={manageModale}>
                            <i className='icon' style={{ mask : "url(./assets/svg/add.svg)"}}></i>
                            <div>Register new process</div>
                        </div>
                    ) : null}
                </div>
                <div style={{ display: "flex", gap: '12px', flexDirection: "column", marginTop: proposalList.length ? "32px" : "" }}>
                    {
                        proposalList.map((proposal, index) => 
                            <Proposal 
                                key={index}
                                description={proposal.proposal.description}
                                owner={proposal.owner} currentStep={currentStep}
                                id={proposal.id} votes={proposal.proposal.voteCount}
                                userVote={userVote}
                                voteProposalAsync={voteProposalAsync}>
                                </Proposal>
                        )
                    }
                </div>
            </div>
            {
                modaleIsOpen ?
                <div className='modale-container'>
                    <div className='modale-proposal gradient-container rounded' style={{ boxSizing:"content-box"}}>
                        <div className='title'>
                            Add new proposition
                        </div>
                        <div style={{ marginTop : "36px"}}>
                            <input
                                type='text'
                                placeholder='Proposal Description'
                                value={newProposalDescription}
                                onChange={(e) => setInputValue(e.target.value)}
                            ></input>
                        </div>
                        <div style={{ display: "flex", justifyContent : "end", gap : "24px", marginTop : "36px"}}>
                            <div className='logout-button-link' onClick={manageModale}>
                                Cancel
                            </div>
                            <div className='button' onClick={registerProposalAsync}>
                                <div className='body bold'>Add proposition</div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <></>
                }
        </>
    )
}

export default ProposalList;