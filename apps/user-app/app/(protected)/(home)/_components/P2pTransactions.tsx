import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";

export const P2pTransactions = ({
    transactions,
    userId,
}: {
    transactions: {
        time: Date;
        amount: number;
        sender: any;
        receiver: any;
    }[];
    userId: string; 
}) => {
    if (!transactions.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl border-b font-extrabold text-gray-800">
                        Recent Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    No Recent Transactions
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl border-b font-extrabold text-gray-800">
                    Recent Transactions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="pt-2">
                    {transactions.map((t, i) => {
                        const isSent = t.sender.id === userId; // Check if the transaction is sent by the user
                        const amountStyle = isSent
                            ? "text-red-600 font-bold" // Sent money
                            : "text-green-600 font-bold"; // Received money

                        return (
                            <div
                                key={i}
                                className="flex justify-between items-center border-b pb-2 mb-2 last:border-b-0"
                            >
                                {/* Transaction Details */}
                                <div>
                                    <div className="text-sm font-medium text-gray-700">
                                        {isSent ? "Sent to" : "Received from"}{" "}
                                        {isSent ? t.receiver.name : t.sender.name}
                                    </div>
                                    <div className="text-slate-600 text-xs">
                                        {new Date(t.time).toLocaleString()}
                                    </div>
                                </div>

                                {/* Transaction Amount */}
                                <div className={`flex flex-col justify-center ${amountStyle}`}>
                                    {isSent ? "-" : "+"} Rs {t.amount / 100}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
