"use client"

import { useState, useEffect } from "react"
import { StakeCard } from "@/components/staking/stake-card"
import { WithdrawCard } from "@/components/staking/withdraw-card"
import {
    connectWallet,
    hasEthereum,
    getTokenName,
    getTokenSymbol,
    getEarlyWithdrawalPenalty,
    getLockPeriod,
} from "@/lib/contracts"
import { StakingProvider } from "@/lib/staking-context"

import { useWallet } from "@/lib/wallet-context"

export default function StakingPage() {
    const [tokenName, setTokenName] = useState<string>("Loading Token")
    const [tokenSymbol, setTokenSymbol] = useState<string>("TOKEN")
    const [earlyWithdrawalPenalty, setEarlyWithdrawalPenalty] = useState<number>(0)
    const [stakingDuration, setStakingDuration] = useState<number>(0)

    const { account, isCheckingConnection, isConnected: isWalletConnected } = useWallet()

    // Mock data - we'll replace earlyWithdrawalPenalty and stakingDuration with real values
    const tokenData = {
        symbol: "TOKEN",
        price: 1.25,
        totalStaked: 1250000,
        timeStaked: 15, // days
    }

    // Fetch token information and contract parameters
    useEffect(() => {
        const fetchContractData = async () => {
            try {
                //@note fetch several data using Promise.all
                const [name, symbol, penalty, lockPeriod] = await Promise.all([
                    getTokenName(),
                    getTokenSymbol(),
                    getEarlyWithdrawalPenalty(),
                    getLockPeriod(),
                ])

                setTokenName(name)
                setTokenSymbol(symbol || tokenData.symbol)

                // Set real values from contract
                setEarlyWithdrawalPenalty(penalty / 100) // Convert basis points to percentage
                setStakingDuration(lockPeriod)

                console.log("Contract data loaded:", {
                    name,
                    symbol,
                    earlyWithdrawalPenalty: penalty / 100,
                    stakingDuration: lockPeriod,
                })
            } catch (error) {
                console.error("Error fetching contract data:", error)
            }
        }

        fetchContractData()
    }, [])

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Staking</h1>
                    <p className="text-muted-foreground">
                        You can stake {tokenSymbol} ({tokenName}) and earn rewards. A {earlyWithdrawalPenalty}% penalty
                        applies for early withdrawals (before {stakingDuration} days).
                    </p>
                    {isCheckingConnection && (
                        <p className="text-sm text-muted-foreground mt-2">Checking wallet connection...</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StakeCard
                        tokenSymbol={tokenSymbol}
                        tokenPrice={tokenData.price}
                        totalStaked={tokenData.totalStaked}
                    />

                    <WithdrawCard
                        isWalletConnected={isWalletConnected}
                        tokenSymbol={tokenSymbol}
                        tokenPrice={tokenData.price}
                        earlyWithdrawalPenalty={earlyWithdrawalPenalty}
                        stakingDuration={stakingDuration}
                        account={account}
                    />
                </div>
            </div>
        </div>
    )
}
