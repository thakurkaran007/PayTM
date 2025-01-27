"use client";

import { Button } from "@repo/ui/src/components/button";
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/src/components/card";
import { Input } from "@repo/ui/src/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { p2pTransaction } from "@/actions/p2p";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/src/components/form";
import { SendMoneySchema } from "@/schema";
import { FormError, FormSuccess } from "@/components/form/form-condition";

const SendMoney = () => {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    
    const form = useForm<z.infer<typeof SendMoneySchema>>({
            resolver: zodResolver(SendMoneySchema),
            defaultValues: {
                email: "",
                amount: "",
            }
    });

    const handleClick = async(values: z.infer<typeof SendMoneySchema>) => {
        setError("");
        setSuccess("");
        startTransition(async () => {
            if (!values.amount || isNaN(Number(values.amount))) {
                alert("Please enter a valid amount.");
                return;
            }
            p2pTransaction(Number(values.amount), values.email)
                .then((res) => {
                    if (res.success) {
                        setError("");
                        setSuccess(res.success);
                    }
                    if (res.error) {
                        setSuccess("");
                        setError(res.error.toString());
                    }
                    form.reset();
                })
                .catch((e) => {
                    setError(e.message);
                })
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-extrabold text-gray-800">Add Money</CardTitle>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleClick)} className="space-y-6 w-full">
                    <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="john@gmail.com"
                                            type="email"
                                            disabled={isPending}
                                        />    
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="$Enter amount$"
                                            type="number"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                     <div className="flex justify-between">
                        {!error && success && <FormSuccess message={success}/>}
                        {error && !success && <FormError message={error}/>}
                        <Button type="submit">Send Money</Button>
                    </div>
                </form>
            </Form>
            </CardContent>
        </Card>
    )
}
export default SendMoney;