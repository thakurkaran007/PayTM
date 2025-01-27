"use client";

import { Button } from "@repo/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { useState, useTransition } from "react";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/src/components/label";
import { createOnRampTransaction } from "@/actions/onRampTransaction";

const SUPPORTED_BANKS = [
  { name: "HDFC Bank", redirectUrl: "https://netbanking.hdfcbank.com", imgPath: "https://cdn.brandfetch.io/idx4TDMW7R/w/134/h/134/theme/dark/icon.jpeg?c=1bfwsmEH20zzEfSNTed" },
  { name: "Axis Bank", redirectUrl: "https://www.axisbank.com/", imgPath: "https://cdn.brandfetch.io/id78YVtrRp/w/350/h/350/theme/dark/icon.png?c=1bfwsmEH20zzEfSNTed" },
];

export const AddMoney = () => {
  const [isPending, startTransition] = useTransition();
  const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
  const [provider, serProvider] = useState(SUPPORTED_BANKS[0]?.name);
  const [amount, setAmount] = useState("");

  const handleAddMoney = async (amount: string, provider: string) => {

    startTransition(async() => {
      if (!amount || isNaN(Number(amount))) {
        alert("Please enter a valid amount.");
        return;
      }
  
      await createOnRampTransaction(Number(amount), provider);
  
      if (redirectUrl) {
        window.open(redirectUrl, "_blank");
      }
    })
  };

  return (
    <Card className="shadow-lg rounded-2xl border border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-extrabold text-gray-800">Add Money</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full space-y-6">
          {/* Amount Input */}
          <div>
            <Label htmlFor="amount" className="block text-sm font-semibold text-gray-700">
              Amount
            </Label>
            <Input
              id="amount"
              placeholder="Enter amount"
              value={amount}
              type="number"
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2"
              disabled={isPending}
            />
          </div>

          {/* Bank Selection */}
          <div>
            <Label htmlFor="bank" className="block text-sm font-semibold text-gray-700">
              Select Bank
            </Label>
            <Select
              onValueChange={(value) => {
                const selectedBank = SUPPORTED_BANKS.find((bank) => bank.name === value);
                setRedirectUrl(selectedBank?.redirectUrl || "");
                serProvider(selectedBank?.name || "");
              }}
            >
              <SelectTrigger id="bank" className="mt-2">
                <SelectValue placeholder="Select a Bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {SUPPORTED_BANKS.map((bank) => (
                    <SelectItem key={bank.name} value={bank.name}>
                      <div className="flex items-center space-x-2">
                        <img src={bank.imgPath} alt={bank.name} className="w-6 h-6" />
                        <span>{bank.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={() => handleAddMoney(amount, provider)} disabled={isPending}>
          Add Money
        </Button>
      </CardFooter>
    </Card>
  );
};
