"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsPending(true);
    console.log("Password reset requested for:", data.email);
    // Simulate API call since endpoint is not strictly defined in backend yet
    setTimeout(() => {
      setIsPending(false);
      setIsSuccess(true);
      toast.success("Password reset instructions sent");
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="w-full text-center glass border-white/10 shadow-2xl shadow-primary/10">
              <CardHeader className="pt-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                  className="flex justify-center mb-4"
                >
                  <div className="h-16 w-16 rounded-full bg-chart-3/10 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-chart-3" />
                  </div>
                </motion.div>
                <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                <CardDescription className="text-base mt-2">
                  We have sent password reset instructions to your email address.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center pb-8">
                <Link href="/login" className={buttonVariants({ variant: "outline" })}>
                  Return to login
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="w-full glass border-white/10 shadow-2xl shadow-primary/10">
              <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">
                  Forgot Password
                </CardTitle>
                <CardDescription>
                  Enter your email and we will send you a reset link
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    className="w-full h-11 shadow-lg shadow-primary/20 hover-glow"
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Send Reset Link
                    {!isPending && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                  <div className="text-center text-sm">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-primary hover:underline"
                    >
                      Sign in
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
