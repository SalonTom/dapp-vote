// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";

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
        require (_whitelist[msg.sender] == true, "Cannot perform action because you are not whitelisted.");
        _;
    }

    uint[] winningProposalIds;
    WorkflowStatus internal currentStep = WorkflowStatus.RegisteringVoters;

    constructor() Ownable(msg.sender){ 
        _whitelist[msg.sender] = true;
    }

    receive() external payable {}
    fallback() external payable {}

    function nextStep() public onlyOwner {
        emit WorkflowStatusChange(currentStep, WorkflowStatus(uint(currentStep) + 1));
        currentStep = WorkflowStatus(uint(currentStep) + 1);
        
        // If last step, reset whitelist ... to be ready to start a new voting session.
        // Maybe add a mapping (uint => mapping(proposition)) to store propositions by voting session id.
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
        require (currentStep == WorkflowStatus.VotingSessionStarted,"Cannot register vote yet.");
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
        require (currentStep == WorkflowStatus.VotingSessionEnded,"Cannot get winner yet.");
        Proposal[] memory winningProposals = new Proposal[](winningProposalIds.length);
        
        for (uint i = 0 ; i < winningProposalIds.length ; i++) {
            winningProposals[i] = idToProposal[winningProposalIds[i]];
        }
        
        return winningProposals;
    }

    function getCurrentStep() public view returns (WorkflowStatus) {
        return currentStep;
    }
    
}