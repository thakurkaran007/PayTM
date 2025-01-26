import { Header } from "@/components/button/Header"
import { OnRamp } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card"

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        status: OnRamp,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card>
            <CardHeader><CardTitle className="text-2xl text-center font-extrabold text-gray-800">Recent Transaction</CardTitle></CardHeader>
            <CardContent className="text-center">
                No Recent transactions
            </CardContent>
        </Card>
    }
    return <Card>
        <CardHeader><CardTitle className="text-2xl text-center font-extrabold text-gray-800">Recent Transaction</CardTitle></CardHeader>
        <CardContent>
        <div className="pt-2">
            {transactions.map((t, i) => <div key={i} className="flex justify-between">
                <div>
                    <div className="text-sm">
                        Received INR
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    + Rs {t.amount / 100}
                </div>

            </div>)}
        </div>
        </CardContent>
    </Card>
}