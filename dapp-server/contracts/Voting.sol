// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;
import "@openzeppelin/contracts/access/Ownable";

contract Voting is Ownable{
    
    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

    mapping(address=> bool) private _whitelist;
    mapping(address=> bool) private hasVoted;
    mapping(uint=> address) proposalsOwnership;
    mapping(uint=> Proposal) idToProposal;
    uint indexProposal;
    uint maxCount;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }
    
    modifier isWhitelisted () {
        require (_whitelist[msg.sender]==true, "Cannot perform action because you are not whitelisted.");
        _;
    }

    uint[] winningProposalIds;
    WorkflowStatus internal currentStep = WorkflowStatus.RegisteringVoters;

    constructor() Ownable(msg.sender){ 
        _whitelist[msg.sender] = true;
     }

    function nextStep() external onlyOwner{
        emit WorkflowStatusChange(currentStep, WorkflowStatus(uint(currentStep) + 1));
        currentStep = WorkflowStatus(uint(currentStep) + 1);
        
    }

    function registerVoters(address _address) public onlyOwner {
        require (currentStep == WorkflowStatus.RegisteringVoters,"Cannot register voters yet.");
        _whitelist[_address] = true;
        emit VoterRegistered(_address);
    }

    function registerProposal(string memory _description) public isWhitelisted{
        require (currentStep == WorkflowStatus.ProposalsRegistrationStarted,"Cannot register proposal yet.");
        proposalsOwnership[indexProposal] = msg.sender;
        idToProposal[indexProposal] = Proposal(_description,0);
        indexProposal++;
        emit ProposalRegistered(indexProposal);
    }

    function registerVote(uint _proposalId) public isWhitelisted{
        require (_proposalId < indexProposal,"Cannot vote for undefined proposal.");
        require (hasVoted[msg.sender] != true,"You already voted.");
        uint voteCount = ++idToProposal[_proposalId].voteCount;
        if (voteCount > maxCount) {
            maxCount = voteCount;
            winningProposalIds = [_proposalId];
        } else if (voteCount > maxCount) {
            winningProposalIds.push(_proposalId);
        }
        hasVoted[msg.sender] = true;
        emit Voted(msg.sender, _proposalId);
    }
    
    function getWinningProposal() public view returns (Proposal[] memory) {
        Proposal[] memory winningProposals = new Proposal[](winningProposalIds.length);
        
        for (uint i = 0 ; i < winningProposalIds.length ; i++) {
            winningProposals[i] = idToProposal[winningProposalIds[i]];
        }
        
        return winningProposals;
    }
    
}