"use client";

import React, { useState } from "react";
import Cookie from "js-cookie";
import { LoadingSpinner } from "@/components/ui/spinner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState("");

  const { toast } = useToast();

  return (
    <div className="flex items-center justify-center min-h-screen flex-col">
      {loading ? (
        <span className="text-slate-300 flex">
          Please wait... <LoadingSpinner className="ml-2 mb-2" />
        </span>
      ) : (
        <span className="mb-2">Input your PIN</span>
      )}
      <InputOTP
        maxLength={6}
        value={pin}
        disabled={loading}
        onChange={(e) => {
          setPin(e);

          if (e.length >= 6) {
            setLoading(true);

            // mock
            setTimeout(() => {
              setLoading(false);
              setPin("");
              toast({
                title: "Success",
                description: "Redirecting to Home Page",
                action: <ToastAction altText="a">OKAY</ToastAction>,
              });
              Cookie.set("isLoggedIn", "true");
              Cookie.set("lastPin", pin);

              setTimeout(() => window.location.reload(), 2000);
            }, 3500);
          }
        }}
        autoFocus
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
