async function main() {
    const myToken = await ethers.deployContract("StakingToken")
    await myToken.waitForDeployment()

    console.log("MyToken deployed to:", myToken.target)

    const stakingContract = await ethers.deployContract("Staking", [myToken.target])
    await stakingContract.waitForDeployment()

    console.log("staking contract deployed to:", stakingContract.target)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
