const { getNamedAccounts, deployments, network } = require("hardhat");

module.exports = async function () {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();
	const args = [];

	const wavePortal = await deploy("WavePortal", {
		from: deployer,
		args: args,
		log: true,
		waitConfirmations: network.config.blockConfirmations || 1,
	});
	log("--------------------------");
};

module.exports.tags = ["WavePortal"];
