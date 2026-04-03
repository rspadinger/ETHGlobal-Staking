"use client"

import { useState, useEffect } from "react"
import { useSmartContractRead } from "../lib/web3/wagmiHelper"
import { formatEther, formatUnits } from "viem"
import { usePrivy } from "@privy-io/react-auth"
// @ts-expect-error working fine
import { useAccount, useBalance } from "wagmi"
import { insertUserAction } from "@/app/actions/user"

// import { Button } from "@/components/ui/button"
// import { toast } from "sonner"
// import { useSendTransaction } from "wagmi"
// import type { SendTransactionVariables } from "wagmi/query"
// import { parseEther } from "viem"

export default function Home() {
    //****************** hooks //******************
    const { user, ready } = usePrivy()
    const { address } = useAccount()
    const { data: ethBalance, isLoading: loadingEthBalance } = useBalance({ address })

    ////****************** state //******************
    const [var1, setVar1] = useState(0)

    //TEST Send TXN => for mainnet testing => seems like smart wallets work only on mainnet
    // const { data, isPending, isSuccess, sendTransaction } = useSendTransaction()
    // const transactionRequest: SendTransactionVariables<Config, number> = {
    //     to: "0x346..." as `0x${string}`,
    //     value: parseEther("0.001"),
    //     type: "eip1559",
    // }

    //****************** smart contract hooks //******************

    const {
        data: data1,
        isLoading: loadingCount,
        error: errorCount,
        refetch: refetchCount,
    } = useSmartContractRead({
        contract: "contr1",
        functionName: "getCount",
        args: [user?.wallet?.address],
    })

    //****************** useEffect hooks //******************

    //@note save data to backend, when Privy does signup/login
    // useEffect(() => {
    //     const insertUser = async () => {
    //         if (ready && user) {
    //             //console.log("Privy user:", user.id, user.wallet?.address)
    //             if (!user.id || !user.wallet?.address) {
    //                 console.error("Missing user ID or wallet address")
    //                 return
    //             }

    //             // save data to DB
    //             await insertUserAction(user.id, user.wallet?.address)
    //         }
    //     }

    //     insertUser()
    // }, [ready, user])

    //@note polling to update stale data => no need to use useState
    useEffect(() => {
        const interval = setInterval(() => {
            if (ready && user) {
                refetchCount() // add additional refetches if required
            }
        }, 15_000) // check every 15 seconds

        return () => clearInterval(interval)
    }, [])

    // Optional: one useEffect for logging or global error handling
    // useEffect(() => {
    //     if (ready && user) {
    //         if (errorCount || errorCount2) {
    //             console.error("Smart contract read error:", {
    //                 c1: errorCount,
    //                 c2: errorCount2,
    //             })
    //         }
    //     }
    // }, [errorCount, errorCount2])

    const isLoading = loadingCount // || loadingCount2 //show spinner in middle of page

    return (
        <div className="force-dark container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="hero-title">Title!</h1>
                    <p className="hero-subtitle max-w-3xl">Short description...!</p>
                    <p className="hero-subtitle max-w-3xl mt-2">... continued....</p>
                </div>
            </div>
        </div>
    )
}
