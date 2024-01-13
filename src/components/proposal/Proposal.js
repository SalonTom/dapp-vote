function Proposal({ description, owner, currentStep, id, votes, userVote, voteProposalAsync }) {

    const handleOnClick = () => {
        voteProposalAsync(id);
    }

    return (
        <div className="rounded list-entry" style={{ border: "1px white solid", display: "flex", justifyContent: "space-between", cursor: "default", backgroundColor : userVote == id ? "rgba(255,255,255,0.3)" : ""}}>
            <div>
                <div className="body bold">{description}</div>
                <div>{owner}</div>
            </div>
            <div style={{ display: "flex", gap:"16px", alignItems: "center"}}>
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
                                        <div className='button' onClick={handleOnClick}>
                                            <i className='icon' style={{ mask: "url(./assets/svg/vote.svg)" }}></i>
                                        </div>
                                    :
                                        null
                                }
                            </>

                        }
                        <div className='bold'>{Number(votes)}</div>
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

        </div>
    );
}

export default Proposal;