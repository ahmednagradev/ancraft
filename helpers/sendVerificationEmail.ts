import VerificationEmail from "@/emails/verificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

async function sendVerificationEmail(username: string, email: string, verificationCode: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Ancraft verification code",
            react: VerificationEmail({ username, verificationCode })
        })
        return { success: true, message: "Verification code sent successfully" }
    } catch (error) {
        console.error("Failed to send verification email")
        return { success: false, message: error instanceof Error ? error.message : "Failed to send verification email" }
    }
}

export default sendVerificationEmail;