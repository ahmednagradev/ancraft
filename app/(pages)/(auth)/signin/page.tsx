"use client";

// Redirection logic need some changes...

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserInput, loginUserSchema } from "@/schemas/loginUserSchema";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

const loginForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState } = useForm<LoginUserInput>({ resolver: zodResolver(loginUserSchema) });
    const { errors } = formState;

    const onSubmit = async (data: LoginUserInput) => {
        try {
            setIsLoading(true);

            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (res.status === 403 && result.isVerified === false) {
                router.push(`/verify?email=${encodeURIComponent(data.email)}`)
                toast.info(result.message)
                return;
            }
            if (!res.ok) {
                throw new Error(result.message || "Something went wrong");
            }
            toast.success(result.message || "Logged in successfully");

        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unexpected error occured")

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
        >
            <div>
                <input placeholder="Email" type="email" {...register("email")} />
                {errors.email && <p>{errors.email?.message}</p>}
            </div>

            <div>
                <input placeholder="Password" type="password" {...register("password")} />
                {errors.password && <p>{errors.password?.message}</p>}
            </div>

            <div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </div>
        </form>
    );
}

export default loginForm;