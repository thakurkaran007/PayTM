"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/src/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@repo/ui/src/components/input";
import { useState, useTransition } from "react";
import signup from "@/actions/signup";
import { SignUpSchema } from "@/schema";
import { Button } from "@repo/ui/src/components/button";
import { CardWrapper } from "./CardWrapper";
import { FormError, FormSuccess } from "./form-condition";
import { send } from "@/actions/otpUp";
import { verifyOtp } from "@/actions/otp-verify";
import { useRouter } from "next/navigation";


export const SignupForm = () => {
  const router = useRouter();
  const [otp] = useState<string>("");
  const [came, setCame] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      otp: "",
      name: "",
      email: "",
      password1: "",
      password2: "",
    },
  });

  const handleOtp = () => {
    send(form.getValues("email"))
      .then((res) => {
        if (res.success) {
          setSuccess(res.success);
          setCame(true);
        }
      })
      .catch((e) => {
        setError(e.message);
      })
  };

  const verify = () => {
    const email = form.getValues("email"); 
    const otpValue = form.getValues("otp"); 
  
    verifyOtp(otpValue, email)
      .then((res) => {
        if (res.success) {
          setVerified(true);
          setSuccess("");
          setError("");
        } else {
          setError(res.error || "OTP verification failed");
        }
      })
      .catch((e) => {
        setError(e.message);
      });
  };
  

  const submit = (values: z.infer<typeof SignUpSchema>) => {
    startTransition(() => {
      signup(values)
        .then((response) => {
          if (response.error) {
            setError(response.error);
          }
          if (response.success) {
            setSuccess(response.success);
            router.push("/auth/login");
          }
        })
        .catch(() => {
          setError("An error occurred");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Back to login?"
      backButtonhref="/auth/login"
      showSocial={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="abc@gmail.com" disabled={came || verified} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* OTP Field */}
            {came && !verified && (
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter OTP</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="******" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Name and Password Fields */}
            {verified && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Name" type="text" disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="********" type="password" disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="********" type="password" disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          {/* Action Button */}
          <div>
            {!came && !verified && (
              <Button type="button" onClick={handleOtp} disabled={isPending}>
                Send OTP
              </Button>
            )}
            {came && !verified && (
              <Button type="button" onClick={verify} disabled={isPending}>
                Verify OTP
              </Button>
            )}
            {verified && (
              <Button type="submit" disabled={isPending}>
                Submit
              </Button>
            )}
          </div>

          {/* Error/Success Messages */}
          {error && !success && <FormError message={error}/>}
          {success && !error && <FormSuccess message={success}/>}
        </form>
      </Form>
    </CardWrapper>
  );
};
