"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { useState } from "react";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/src/components/label";

const SUPPORTED_BANKS = [
  { name: "HDFC Bank", redirectUrl: "https://netbanking.hdfcbank.com" },
  { name: "Axis Bank", redirectUrl: "https://www.axisbank.com/" },
];

export const AddMoney = () => {
  const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
  const [amount, setAmount] = useState("");

  return (
    <Card title="Add Money">
      <div className="w-full p-4 space-y-4">
        {/* Amount Input */}
        <div>
          <Label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</Label>
          <Input
            id="amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Bank Selection */}
        <div>
          <Select
            onValueChange={(value) => {
              const selectedBank = SUPPORTED_BANKS.find((bank) => bank.name === value);
              setRedirectUrl(selectedBank?.redirectUrl || "");
            }}
          >
            <SelectTrigger id="bank" className="w-full">
              <SelectValue placeholder="Select a Bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SUPPORTED_BANKS.map((bank) => (
                  <SelectItem key={bank.name} value={bank.name}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Add Money Button */}
        <div className="flex justify-center pt-4">
          <Button onClick={() => {}}>Add Money</Button>
        </div>
      </div>
    </Card>
  );
};
