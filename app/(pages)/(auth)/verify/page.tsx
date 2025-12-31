"use client";

import { VerifyUserInput, verifyUserSchema } from '@/schemas/verifyUserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { useAppContext } from '@/context/AppContext';

const VerificationForm = () => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState } = useForm<VerifyUserInput>({ resolver: zodResolver(verifyUserSchema) });
    const { errors } = formState;
    const onSubmit = async (data: VerifyUserInput) => {
        const { user } = useAppContext();
        const email = user?.email;

        if (!email) {
            toast.error("No email found, please try again");
            return;
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
    )
}

export default VerificationForm