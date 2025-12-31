"use client";

import { VerifyUserInput, verifyUserSchema } from '@/schemas/verifyUserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner';
import { useRouter } from "next/navigation";

export const VerificationForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    // In real implementation, use useSearchParams()
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const { register, handleSubmit, formState } = useForm<VerifyUserInput>({
        resolver: zodResolver(verifyUserSchema),
    });
    const { errors } = formState;

    const onSubmit = async (data: VerifyUserInput) => {
        try {
            setIsLoading(true);

            const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    email,
                }),
            });
            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Something went wrong");
            }

            router.push("/signin");
            toast.success("Account verified successfully");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Unexpected error occured");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // const handleResendCode = async () => {
    //     toast.success("Verification code resent to your email");
    // };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
            {/* Ambient background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
                        Verify Your Email
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base mb-2">
                        We've sent a 6-digit verification code to
                    </p>
                    <p className="text-white font-medium">{email}</p>
                </div>

                {/* Form Card */}
                <div className="bg-linear-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-800/50 shadow-2xl p-6 sm:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Verification Code Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                placeholder="000000"
                                maxLength={6}
                                {...register("verificationCode")}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white text-center text-2xl tracking-widest placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                            />
                            {errors.verificationCode && (
                                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {errors.verificationCode.message}
                                </p>
                            )}
                        </div>

                        {/* Info Box */}
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                            <p className="text-sm text-purple-300 flex items-start gap-2">
                                <svg
                                    className="w-5 h-5 shrink-0 mt-0.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>
                                    Please check your email inbox and spam folder for the verification code.
                                </span>
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full group relative px-6 py-3 bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24"
                                            stroke="currentColor"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            ></path>
                                        </svg>
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify Account
                                        <svg
                                            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>

                        {/* Resend Code */}
                        {/* <div className="text-center pt-2">
                            <p className="text-sm text-gray-400">
                                Didn’t receive the code?{" "}
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                                >
                                    Resend
                                </button>
                            </p>
                        </div> */}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerificationForm;