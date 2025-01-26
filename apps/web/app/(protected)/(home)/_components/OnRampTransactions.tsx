import { Header } from "@/components/button/Header"
import { OnRamp } from "@prisma/client"
import { Card, CardHeader } from "@repo/ui/card"

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
            <CardHeader><Header label="Recent Transactions"/></CardHeader>
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card>
        <CardHeader><Header label="Recent Transactions"/></CardHeader>
        <div className="pt-2">
            {transactions.map(t => <div className="flex justify-between">
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
    </Card>
}