import getBalance from "@/data/balance";
import BalanceCard from "../_components/BalanceCard";
import SendMoney from "../_components/SendMoney";
import { getP2pTransactions } from "@/data/transaction";
import { P2pTransactions } from "../_components/P2pTransactions";
import { auth } from "@/auth";

const p2pPage = async () => {
    const balance = await getBalance();
    const transactions = await getP2pTransactions();
    const session = await auth();

    return (
        <div className="w-screen">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-extrabold">
                Send P2P Money
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
                <div>
                    <SendMoney />
                </div>
                <div>
                    <BalanceCard amount={balance.amount} locked={balance.locked} />
                    <div className="pt-4">
                        <P2pTransactions transactions={transactions} userId={session?.user?.id || ''} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default p2pPage;
