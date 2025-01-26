import getBalance from "@/data/balance";
import BalanceCard from "../_components/BalanceCard";
import SendMoney from "../_components/SendMoney";

const p2pPage = async () => {
    const balance = await getBalance();
    return (
        <div className="w-screen">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-extrabold">
                Send P2P Money
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
                <SendMoney/>
            </div>  
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked}/>
            </div>
        </div>
    )
}
export default p2pPage;
