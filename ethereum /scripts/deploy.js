const hre = require("hardhat");

async function main() {
  // Get the ContractFactory and signer
  const Inventory = await hre.ethers.getContractFactory("Inventory");
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  // Deploy the contract
  const inventory = await Inventory.deploy();
  await inventory.deployed();

  console.log("Inventory deployed to:", inventory.address);
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
