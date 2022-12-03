const { expect, assert } = require("chai");
const { network, ethers, deployments } = require("hardhat");

describe("Wave Portal unit tests", () => {
	let wavePortalDeployer, wavePortalWaver1, wavePortalWaver2;
	let message = "Yo bruh";

	beforeEach(async () => {
		let [deployer, ...accounts] = await ethers.getSigners();
		waver1 = accounts[1];
		waver2 = accounts[2];
		await deployments.fixture(["WavePortal"]);

		wavePortalDeployer = await ethers.getContract("WavePortal", deployer);
		wavePortalWaver1 = wavePortalDeployer.connect(waver1);
		wavePortalWaver2 = wavePortalDeployer.connect(waver2);
	});

	describe("Send wave", () => {
		it("reverts TX if wave sender is contract owner", async () => {
			const tx = wavePortalDeployer.wave(message);
			await expect(tx).to.be.revertedWith("WavePortal__MsgToYourself()");
		});

		it("sends wave and emits event", async () => {
			const tx = await wavePortalWaver1.wave(message);
			await tx.wait(1);
			const wave = await wavePortalWaver1.getWaveById(0);
			expect(wave.message).to.equal(message);
			const wavesCounts = await wavePortalWaver1.getTotalWavesCount();
			expect(wavesCounts).to.equal(1);
			expect().to.emit("NewWave");
		});
	});

	describe("Delete wave", () => {
		const waveId = 0;

		it("reverts TX if wave doesn't exist", async () => {
			const tx = wavePortalWaver1.deleteWave(waveId);
			await expect(tx).to.be.reverted;
		});

		it("reverts TX if wave sender is not wave owner", async () => {
			const waveTx = await wavePortalWaver1.wave(message);
			await waveTx.wait(1);
			const tx = wavePortalWaver2.deleteWave(waveId);
			await expect(tx).to.be.revertedWith("WavePortal__WaveWasntSentByYou()");
		});

		it("deletes wave and emits event", async () => {
			const waveTx = await wavePortalWaver1.wave(message);
			await waveTx.wait(1);
			const tx = await wavePortalWaver1.deleteWave(waveId);
			await tx.wait(1);
			expect(tx).to.emit("WaveRemoved");

			const getWave = wavePortalWaver1.getWaveById(waveId);
			await expect(getWave).to.be.reverted;
		});

		it("Wave portal owner can delete any wave", async () => {
			const wave1Tx = await wavePortalWaver1.wave(message);
			await wave1Tx.wait(1);

			const tx1 = await wavePortalDeployer.deleteWave(waveId);
			expect(tx1).to.emit("WaveRemoved");
			await expect(wavePortalWaver1.getWaveById(waveId)).to.be.reverted;
		});
	});

	describe("Like/Dislike wave", () => {
		const waveId = 0;

		it("reverts TX if wave doesn't exist", async () => {
			const tx = wavePortalWaver1.toggleLike(waveId);
			await expect(tx).to.be.reverted;
		});

		it("Likes wave and emits event", async () => {
			const wave1Tx = await wavePortalWaver1.wave(message);
			await wave1Tx.wait(1);

			const tx = await wavePortalWaver1.toggleLike(waveId);
			expect(tx).to.emit("ToggleLike");

			const wave = await wavePortalWaver1.getWaveById(waveId);

			expect(wave.likesAmount.toNumber()).to.be.equal(1);
		});

		it("Removes like and emits event", async () => {
			const wave1Tx = await wavePortalWaver1.wave(message);
			await wave1Tx.wait(1);

			const like = await wavePortalWaver1.toggleLike(waveId);
			expect(like).to.emit("ToggleLike");

			const dislike = await wavePortalWaver1.toggleLike(waveId);
			expect(dislike).to.emit("ToggleLike");

			const wave = await wavePortalWaver1.getWaveById(waveId);

			expect(wave.likesAmount.toNumber()).to.be.equal(0);
		});
	});
});
