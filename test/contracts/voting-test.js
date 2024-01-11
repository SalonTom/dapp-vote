const { expect } = require("chai");

let owner;
let voting;

const WorkflowStatus = {
  RegisteringVoters : 0,
  ProposalsRegistrationStarted : 1,
  ProposalsRegistrationEnded : 2,
  VotingSessionStarted : 3,
  VotingSessionEnded : 4,
  VotesTallied : 5
}

// TODO : use the libray provided in notion to deal with expected events.

describe("Voting contract", function () {

  beforeEach(async () => {
    voting = await ethers.deployContract("Voting");
    [owner, nonOwner, thirdOwner] = await ethers.getSigners()
  });


  it("Deployment should transfer the ownership of the contract to the deployer.", async function () {
    const contractOwner = await voting.owner();
    expect(owner).to.equal(contractOwner);
  });

  describe("nextStep()", function () {
    it("Owner can go to next step", async () => {
      const formerStep = Number(await voting.getCurrentStep());

      await voting.nextStep();

      const newStep = Number(await voting.getCurrentStep());

      expect(newStep).to.equal(formerStep + 1);
    });

    it("Access resticted to non-owner.", async () => {
      
      try {
        await voting.connect(nonOwner).nextStep();
      } catch(error) {
        expect(error.message).to.include("OwnableUnauthorizedAccount");
      }
    });

    it("When going to next step from last status VotesTallied, should go back to RegisteringVoters", async () => {
      
      for (i = 0; i < 5; i++) {
        await voting.nextStep();
      }

      expect(await voting.getCurrentStep()).to.equal(WorkflowStatus.VotesTallied);

      await voting.nextStep();

      expect(await voting.getCurrentStep()).to.equal(WorkflowStatus.RegisteringVoters);
    });
  });

  describe("registerVoters()", function () {
    it("Owner can register voters", async () => {
      await voting.registerVoters(nonOwner);
    });

    it("Access resticted to non-owner.", async () => {
      try {
        await voting.connect(nonOwner).registerVoters(owner);
      } catch(error) {
        expect(error.message).to.include("OwnableUnauthorizedAccount");
      }
    });

    it("Cannot register voters if status not RegisteringVoters", async () => {
      try {
        await voting.nextStep()
        await voting.registerVoters(nonOwner);
      } catch(error) {
        expect(error.message).to.include("Cannot register voters yet.");
      }
    });

    // TODO : Check if voter is well registered (waiting for smart contrat method getRegisteredVoters())
  });

  describe("registerProposal()", function () {
    it("Whitelisted addresses can register proposals", async () => {
      await voting.registerVoters(nonOwner);
      await voting.nextStep();

      await voting.registerProposal("Proposal Description");
      await voting.connect(nonOwner).registerProposal("Proposal Description");
    });

    it("Access resticted to non-whitelisted addresses.", async () => {
      try {
        await voting.nextStep();
        await voting.connect(nonOwner).registerProposal("Proposal Descriptio");
      } catch(error) {
        expect(error.message).to.include("Cannot perform action because you are not whitelisted.");
      }
    });

    it("Cannot register proposals if status not RegisteringProposals.", async () => {
      try {
        await voting.registerProposal("Proposal Description");
      } catch(error) {
        expect(error.message).to.include("Cannot register proposal yet.");
      }
    });


    // TODO : Check if proposal is well registered (waiting for smart contrat method getRegisteredProposals())
  });

  describe("registerVote()", function () {
    it("Whitelisted addresses can vote for a proposal", async () => {
      await voting.registerVoters(nonOwner);

      // Status ProposalsRegistrationStarted
      await voting.nextStep();
      await voting.registerProposal("Proposal Description 1");
      await voting.connect(nonOwner).registerProposal("Proposal Description 2");

      // Status ProposalsRegistrationEnded
      await voting.nextStep();

      // Status VotingSessionStarted
      await voting.nextStep();
      await voting.registerVote(0);
      await voting.connect(nonOwner).registerVote(0);
    });

    it("Access resticted to non-whitelisted addresses.", async () => {
      try {

        // Status ProposalsRegistrationStarted
        await voting.nextStep();
        await voting.registerProposal("Proposal Description 1");

        // Status ProposalsRegistrationEnded
        await voting.nextStep();

        // Status VotingSessionStarted
        await voting.nextStep();
        await voting.connect(nonOwner).registerVote(0);
      } catch(error) {
        expect(error.message).to.include("Cannot perform action because you are not whitelisted.");
      }

    });

    it("Cannot register proposals if status not RegisteringVotes.", async () => {
      try {
        await voting.registerVote(0);
      } catch(error) {
        expect(error.message).to.include("Cannot register vote yet.");
      }
    });



    // TODO : Check if vote is well registered (waiting for smart contrat method getRegisteredProposals()).
    // TODO : Check if the winning propositions Ids are well updated after each vote.
  });


  describe("getWinnignPorposal", function () {

    it("Get winning proposals", async () => {
      await voting.registerVoters(nonOwner);
      await voting.registerVoters(thirdOwner);

      // Status ProposalsRegistrationStarted
      await voting.nextStep();
      await voting.registerProposal("Proposal Description 1");
      await voting.connect(nonOwner).registerProposal("Proposal Description 2");

      // Status ProposalsRegistrationEnded
      await voting.nextStep();

      // Status VotingSessionStarted
      await voting.nextStep();

      // Fist vote, only one proposition is winning.
      await voting.registerVote(0);
      let winningPorposalIds = await voting.getWinningProposal();

      expect(winningPorposalIds.length).to.equal(1);
      expect(winningPorposalIds[0].description).to.equal("Proposal Description 1");

      // Second vote, two proposals are tied. They are both winning.
      await voting.connect(nonOwner).registerVote(1);
      winningPorposalIds = await voting.getWinningProposal();

      expect(winningPorposalIds.length).to.equal(2);
      expect(winningPorposalIds[0].description).to.equal("Proposal Description 1");
      expect(winningPorposalIds[1].description).to.equal("Proposal Description 2");

      // Third vote, the second proposal has more vote than the first proposal.
      await voting.connect(thirdOwner).registerVote(1);
      winningPorposalIds = await voting.getWinningProposal();

      expect(winningPorposalIds.length).to.equal(1);
      expect(winningPorposalIds[0].description).to.equal("Proposal Description 2");
    });
  });
});