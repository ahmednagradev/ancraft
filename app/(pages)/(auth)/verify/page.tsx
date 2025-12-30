"use client";

import { VerifyUserInput, verifyUserSchema } from '@/schemas/verifyUserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner';
import { useRouter } from "next/navigation";

const VerificationForm = () => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();

    const { register, handleSubmit, formState } = useForm<VerifyUserInput>({ resolver: zodResolver(verifyUserSchema) });
    const { errors } = formState;
    const onSubmit = async (data: VerifyUserInput) => {
        const email = searchParams.get("email");

        if (!email) {
            toast.error("No email found, Please try again");
        }

        try {
            setIsLoading(true);

            const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...data,
                    email
                }),

            })
            const result = await res.json();
            
            if (!res.ok) {
                throw new Error(result.message || "Something went wrong");
            }

            router.push("/signin")
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
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <input type="text" placeholder="Verification Code" {...register("verificationCode")} />
                {errors.verificationCode && <p>{errors.verificationCode.message}</p>}
            </div>
            <div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Verifying account..." : "Verify"}
                </button>
            </div>
        </form>
        </Suspense>
    )
}

export default VerificationForm