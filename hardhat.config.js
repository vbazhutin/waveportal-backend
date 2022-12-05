require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

module.exports = {
	defaultNetwork: "hardhat",
	networks: {
		hardhat: {
			// forking: {
			//   url: MAINNET_RPC_URL
			// }
			chainId: 31337,
		},
		localhost: {
			chainId: 31337,
		},
		goerli: {
			url: GOERLI_RPC_URL,
			accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
			//   accounts: {
			//     mnemonic: MNEMONIC,
			//   },
			saveDeployments: true,
			chainId: 5,
		},
		// mainnet: {
		// 	url: MAINNET_RPC_URL,
		// 	accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
		//   accounts: {
		//     mnemonic: MNEMONIC,
		//   },
		// 	saveDeployments: true,
		// 	chainId: 1,
		// },
		// polygon: {
		// 	url: POLYGON_MAINNET_RPC_URL,
		// 	accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
		// 	saveDeployments: true,
		// 	chainId: 137,
		// },
	},
	etherscan: {
		// yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
		apiKey: {
			goerli: ETHERSCAN_API_KEY,
			// 	polygon: POLYGONSCAN_API_KEY,
		},
		customChains: [
			{
				network: "goerli",
				chainId: 5,
				urls: {
					apiURL: "https://api-goerli.etherscan.io/api",
					browserURL: "https://goerli.etherscan.io",
				},
			},
		],
	},
	gasReporter: {
		enabled: false,
		// enabled: REPORT_GAS,
		currency: "USD",
		outputFile: "gas-report.txt",
		noColors: true,
		// coinmarketcap: process.env.COINMARKETCAP_API_KEY,
	},
	contractSizer: {
		runOnCompile: false,
	},
	namedAccounts: {
		deployer: {
			default: 0,
			1: 0,
		},
		player: {
			default: 1,
		},
	},
	solidity: {
		compilers: [
			{
				version: "0.8.17",
			},
		],
	},
	mocha: {
		timeout: 300000,
	},
};
