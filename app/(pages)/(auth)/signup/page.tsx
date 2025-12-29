"use client";

import { useForm } from "react-hook-form";
import { registerUserSchema, RegisterUserInput } from "@/schemas/registerUserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignupForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState } = useForm<RegisterUserInput>({ resolver: zodResolver(registerUserSchema) });
    const { errors } = formState;

    const onSubmit = async (data: RegisterUserInput) => {
        try {
            setIsLoading(true);

            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            
            if (!res.ok) {
                throw new Error(result.message || "Something went wrong");
            }

            if (result.success) {
                router.push(`/verify?email=${encodeURIComponent(data.email)}`)
            }

            toast.success("Account created successfully");

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

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
        >
            <div>
                <input placeholder="Username" type="text" {...register("username")} />
                {errors.username && <p>{errors?.username.message}</p>}
            </div>

            <div>
                <input placeholder="Email" type="email" {...register("email")} />
                {errors.email && <p>{errors.email?.message}</p>}
            </div>

            <div>
                <input placeholder="Password" type="password" {...register("password")} />
                {errors.password && <p>{errors.password.message}</p>}
            </div>

            <div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Signup"}
                </button>
            </div>
        </form>
    );
}

export default SignupForm;