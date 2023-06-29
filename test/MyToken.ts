import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken unit Test", () => {
  async function deployMyToken() {
    const supplyInit = 10_000;
    const [owner, otherAccount] = await ethers.getSigners();
    const MToken = await ethers.getContractFactory("MyToken");
    const mtoken = await MToken.deploy(supplyInit);
    return { supplyInit, mtoken, owner, otherAccount };
  }

  describe("Deployment", () => {
    it("totalSupply should be equal to supplyInit", async () => {
      const { supplyInit, mtoken } = await loadFixture(deployMyToken);
      expect(await mtoken.totalSupply()).to.equal(supplyInit);
    });

    it("owner should be equal deployer's address", async () => {
      const { mtoken, owner } = await loadFixture(deployMyToken);
      expect(await mtoken.owner()).to.equal(owner.address);
    });
  });

  describe("mint && burn", () => {
    it("mint reward should be equal to val * 100", async () => {
      const { mtoken, otherAccount } = await loadFixture(deployMyToken);
      await mtoken.connect(otherAccount).mint({ value: 1_000 });

      expect(await mtoken.balanceOf(await otherAccount.address)).to.equal(
        1_000 * 100
      );
    });
    it("burn invoke should be owner", async () => {
      const { mtoken, otherAccount } = await loadFixture(deployMyToken);
      expect(mtoken.connect(otherAccount).burn(1_000)).to.be.revertedWith(
        "Forbidden"
      );
    });
    it("burn owner's balance should be equal to input amount", async () => {
      const { mtoken, otherAccount, owner } = await loadFixture(deployMyToken);
      const balanceOfBefore = await mtoken.balanceOf(owner.address);
      await mtoken.burn(1000);
      const balanceOfAfter = await mtoken.balanceOf(owner.address);

      expect(balanceOfBefore).to.equal(balanceOfAfter + BigInt(1000));
    });
  });

  describe("approve && allowances", async () => {
    it("approve to spender should be added in allowances", async () => {
      const { mtoken, otherAccount, owner } = await loadFixture(deployMyToken);
      await mtoken.approve(otherAccount, 1000);
      expect(await mtoken.allowance(owner, otherAccount)).to.equal(1000);
    });
    it("transferFrom should be invoke right", async () => {
      const { mtoken, otherAccount, owner } = await loadFixture(deployMyToken);
      await mtoken.approve(otherAccount, 1000);
      await mtoken
        .connect(otherAccount)
        .transferFrom(owner, otherAccount, 1000);
      expect(await mtoken.balanceOf(otherAccount)).to.equal(1000);
    });
  });
});
