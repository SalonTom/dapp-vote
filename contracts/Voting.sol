// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Voting is a smart contract manage voting sessions.
/// @author Quentin GILLOT & Tom SALON
/// @notice You can use this contract to register voters, proposals and run a voting session. Some features are only accessible by the owner of the contract.
contract Voting is Ownable{

    /// Event emitted when a voter is registered.
    /// @param voterAddress Address of the registered voter.
    event VoterRegistered(address voterAddress);

    /// Event emittedd when the status changes.
    /// @param previousStatus Old status.
    /// @param newStatus New status.
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

    /// Event emitted when a proposal is registered.
    /// @param proposalId proposal id.
    event ProposalRegistered(uint proposalId);

    /// Event emitted when a vote is registered.
    /// @param voter Voter address.
    /// @param proposalId Proposal Id.
    event Voted (address voter, uint proposalId);

    /// Struct to represent a voter.
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    /// Struct to represent a proposal.
    struct Proposal {
        string description;
        uint voteCount;
    }

    /// Enum for the different status of a voting session.
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    // Mapping of whitelisted voters.
    mapping(address => bool) private _whitelist;

    // Mapping to track whether a voter has voted.
    mapping(address => bool) private _hasVoted;

    // Mapping to link proposal id to its owner's address.
    mapping(uint => address) private _proposalsOwnership;

    // Mapping to linj the proposal id to the proposal itself.
    mapping(uint => Proposal) private _idToProposal;

    /// Mapping to link the address requesting to be whitelisted to the index in the array requesters.
    mapping(address => uint) private _adressIndex;

    // Index of the next proposal id during registration.
    uint private _indexProposal;

    /// Number of count for the winnning(s) proposals.
    uint private _maxCount;

    /// Array to store the winning proposals ids.
    uint[] winningProposalIds;

    /// Current status the session is in.
    WorkflowStatus internal currentStep = WorkflowStatus.RegisteringVoters;

    /// Array with the address requesting to be whitelisted.
    address[] requesters;
    
    /// Modifier to check wheter the sender is whitelisted or not.
    modifier isWhitelisted () {
        require (_whitelist[msg.sender] == true, "Cannot perform action because you are not whitelisted.");
        _;
    }

    constructor() Ownable(msg.sender) { 
        _whitelist[msg.sender] = true;
    }

    receive() external payable {}
    fallback() external payable {}

    /// Function to advance to the next step in the voting workflow. Restricted to the owner.
    function nextStep() public onlyOwner {

        // Loop between all the status. Once the workflow comes to an end, the next step is to register voters again.
        emit WorkflowStatusChange(currentStep, WorkflowStatus((uint(currentStep) + 1) % 6));
        currentStep = WorkflowStatus((uint(currentStep) + 1) % 6);
    }

    /// Method to ask to be whitelisted.
    function askAccess() public {
        uint requesterId = requesters.length;
        _adressIndex[msg.sender] = requesterId;

        requesters.push(msg.sender);
    }

    /// Function to whitelist/register voters. Restricted to the owner.
    function registerVoters(address _address) public onlyOwner {

        // TODO : Add require to check if the address asked for access before.

        // Check if the status is right.
        require (currentStep == WorkflowStatus.RegisteringVoters, "Cannot register voters yet.");

        // Whitelist the address.
        _whitelist[_address] = true;
        delete requesters[_adressIndex[msg.sender]];

        emit VoterRegistered(_address);
    }

    /// Function to register proposals. Restricted to the whitelised voters.
    function registerProposal(string memory _description) public isWhitelisted {

        // Check if the status is right.
        require (currentStep == WorkflowStatus.ProposalsRegistrationStarted,"Cannot register proposal yet.");

        // Link the proposal id to the address of the sender and to the proposal itself.
        _proposalsOwnership[_indexProposal] = msg.sender;
        _idToProposal[_indexProposal] = Proposal(_description,0);

        // Update the _indexProposal uint so the next registered proposal has the right id.
        _indexProposal++;


        emit ProposalRegistered(_indexProposal);
    }

    /// Function to register votes. Restricted to the whitelised voters.
    /// @param _proposalId Proposal Id.
    function registerVote(uint _proposalId) public isWhitelisted {

        // Check if current status is right, if the proposal the user wants to vote for exist and if the sender hasn't voted already.
        // Here, checking if the proposalId < _indexProposal is enough to see if the proposal exists since there is no deletion allowed.
        require (currentStep == WorkflowStatus.VotingSessionStarted,"Cannot register vote yet.");
        require (_proposalId < _indexProposal,"Cannot vote for undefined proposal.");
        require (_hasVoted[msg.sender] != true,"You already voted.");

        // We keep track of the winning proposal(s) each time a vote is tallied.
        uint voteCount = ++_idToProposal[_proposalId].voteCount;
        if (voteCount > _maxCount) {
            _maxCount = voteCount;
            winningProposalIds = [_proposalId];
        } else if (voteCount == _maxCount) {
            winningProposalIds.push(_proposalId);
        }

        // Register the vote for the sender. He won't be able to vote for an other proposal.
        _hasVoted[msg.sender] = true;

        emit Voted(msg.sender, _proposalId);
    }
    
    /// Function to get the winning proposals.
    function getWinningProposal() public view returns (Proposal[] memory) {

        // Check if the current step is right.
        // require (currentStep == WorkflowStatus.VotingSessionEnded, "Cannot get winner yet.");
        Proposal[] memory winningProposals = new Proposal[](winningProposalIds.length);
        
        for (uint i = 0 ; i < winningProposalIds.length ; i++) {
            winningProposals[i] = _idToProposal[winningProposalIds[i]];
        }
        
        return winningProposals;
    }

    /// Getter for the session's current status.
    function getCurrentStep() public view returns (WorkflowStatus) {
        return currentStep;
    }

    /// Merhod that returns true if the _address is whitelisted.
    /// @param _address Address to check.
    function isUserWhitelisted(address _address) public view returns (bool) {
        return _whitelist[_address];
    }

    /// Method to get the list of the addresses requesting to be whitelisted.
    function getRequesters() public view returns (address[] memory) {
        return requesters;
    }
}