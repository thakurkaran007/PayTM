import { OnRamp } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";

export const OnRampTransactions = ({
    transactions,
}: {
    transactions: {
        time: Date;
        amount: number;
        status: OnRamp; // Status should ideally be a string or enum like "Processing", "Failure", or "Success"
        provider: string;
    }[];
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
                    No Recent transactions
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
                        // Determine styles based on the transaction status
                        const amountStyle =
                            t.status === "Success"
                                ? "text-green-600 font-bold"
                                : t.status === "Failure"
                                ? "text-red-600 font-bold"
                                : "text-yellow-600 font-bold"; // For "Processing"

                        return (
                            <div
                                key={i}
                                className="flex justify-between items-center border-b pb-2 mb-2 last:border-b-0"
                            >
                                {/* Transaction Details */}
                                <div>
                                    <div className="text-sm font-medium text-gray-700">
                                        Received INR
                                    </div>
                                    <div className="text-slate-600 text-xs">
                                        {t.time.toDateString()}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Provider: {t.provider}
                                    </div>
                                </div>

                                {/* Transaction Amount */}
                                <div className={`flex flex-col justify-center ${amountStyle}`}>
                                    + Rs {t.amount / 100}
                                    <span className="text-xs capitalize">
                                        {t.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
