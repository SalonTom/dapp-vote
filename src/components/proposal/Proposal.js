import ContractUtils from '../../utils/contractUtils';

function Proposal({ connecteddAddress, description, owner, currentStep, id, votes, userVote }) {

    const contractUtils = (new ContractUtils()).instance;

    const voteProposalAsync = async () => {

        await contractUtils.methods.registerVote(id).send({ from : connecteddAddress });
        window.location.reload();
    }

    console.log(userVote)
    return (
        <div className="rounded" style={{ border: "1px white solid", display: "flex", justifyContent: "space-between" }}>
            <div>
                <div className="body bold">{description}</div>
                <div>{owner}</div>
            </div>
            <div>{Number(votes)}</div>
            {
                (currentStep == '3' || currentStep == '4') ? (
                    <>
                        {
                            id == userVote ?
                            <i className='icon' style={{ mask: "url(./assets/svg/selected.svg)" }}></i>
                            :
                            <>
                                {
                                    userVote == -1 ?
                                        <div className='button' onClick={voteProposalAsync}>
                                            <i className='icon' style={{ mask: "url(./assets/svg/vote.svg)" }}></i>
                                        </div>
                                    :
                                        null
                                }
                            </>

                        }
                    </>
            ) : 
            <>
                {
                    currentStep == "5" ?
                    <>
                        <i className='icon' style={{ mask: "url(./assets/svg/trophy.svg)" }}></i>
                    </>

                    :

                    null
                }
            </> }

        </div>
    );
}

export default Proposal;