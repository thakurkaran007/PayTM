-- DropForeignKey
ALTER TABLE "merchantAccount" DROP CONSTRAINT "merchantAccount_id_fkey";

-- AddForeignKey
ALTER TABLE "merchantAccount" ADD CONSTRAINT "merchantAccount_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
