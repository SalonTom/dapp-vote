const { ethers } = require("hardhat");
const path = require("path");

async function main() {
  const voting = await ethers.deployContract("Voting");

  await voting.waitForDeployment();

  console.log(`Contract deployed to ${voting.target}`);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(voting);
}

function saveFrontendFiles(voting) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "Address.json"),
    JSON.stringify({ Voting: voting.target }, undefined, 2)
  );

  const VotingArtifact = artifacts.readArtifactSync("Voting");

  fs.writeFileSync(
    path.join(contractsDir, "Voting.json"),
    JSON.stringify(VotingArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
