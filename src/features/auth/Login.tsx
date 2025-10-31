"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/core/providers/SupabaseProvider";
import { Button, Input, Card, CardHeader, CardBody, CardFooter, Link } from "@heroui/react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
    const { signIn, signUp } = useSupabase();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await signIn(email, password);
            toast.success("Welcome back!");
            navigate("/");
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async () => {
        setIsLoading(true);
        try {
            console.log("Signup payload:", { email, password });
            await signUp(email, password);
            toast.info("Check your email to confirm your account.");
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your email address first.");
            return;
        }
        setIsResetting(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
            toast.success("Password reset email sent!");
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setIsResetting(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0118] via-[#120326] to-[#090014] text-white relative overflow-hidden">
            {/* glowing purple accent */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)]" />

            <Card className="w-[90%] sm:w-[420px] backdrop-blur-xl bg-black/40 border border-purple-500/30 shadow-lg shadow-purple-700/10 rounded-2xl relative z-10">
                <CardHeader className="flex flex-col items-center text-center pb-0">
                    <h1 className="text-3xl font-bold text-purple-400 tracking-tight">FoamBoss</h1>
                    <p className="text-neutral-400 text-sm mt-1">Sign in to continue</p>
                </CardHeader>

                <CardBody className="flex flex-col gap-4 mt-4">
                    <Input
                        type="email"
                        label="Email"
                        placeholder="you@company.com"
                        variant="bordered"
                        color="secondary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        classNames={{
                            label: "text-zinc-300",
                            inputWrapper:
                                "bg-zinc-900/50 border-zinc-700 focus:border-purple-500 transition-colors",
                        }}
                    />
                    <Input
                        type="password"
                        label="Password"
                        placeholder="••••••••"
                        variant="bordered"
                        color="secondary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        classNames={{
                            label: "text-zinc-300",
                            inputWrapper:
                                "bg-zinc-900/50 border-zinc-700 focus:border-purple-500 transition-colors",
                        }}
                    />

                    <div className="flex justify-end">
                        <Link
                            onPress={handleForgotPassword}
                            className="text-sm text-purple-300 hover:text-purple-200 cursor-pointer"
                        >
                            {isResetting ? "Sending..." : "Forgot password?"}
                        </Link>
                    </div>
                </CardBody>

                <CardFooter className="flex flex-col gap-3 mt-2">
                    <Button
                        color="secondary"
                        className="w-full font-semibold tracking-wide bg-purple-600 hover:bg-purple-700 text-white"
                        isLoading={isLoading}
                        onClick={handleLogin}
                    >
                        Sign In
                    </Button>
                    <Button
                        variant="flat"
                        className="w-full text-purple-300 hover:text-purple-200"
                        onClick={handleSignup}
                    >
                        Create Account
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
