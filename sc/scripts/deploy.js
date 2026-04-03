const { VRF_COORDINATOR, KEY_HASH, SUBSCRIPTION_ID, ETH_USD_FEED, LOOT_USD_FEED, USDC } = process.env

async function main() {
    // Deploy Mock contracts
    const MockERC20 = await ethers.getContractFactory("MockERC20")
    const mockUsdcToken = await MockERC20.deploy("USDC", "USDC", 6, ethers.parseUnits("1000000", 6))

    // Deploy NAME
    const Contract1 = await ethers.getContractFactory("NAME")
    const contract1 = await Contract1.deploy(VAR1, VAR2)
    console.log("NAME deployed to:", contract1.target)

    // Set properties
    console.log("Setting Properties...")
    await contract1.writeFunctionName("test")
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
