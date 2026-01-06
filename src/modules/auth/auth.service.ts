import { auth } from "../../lib/auth";

// export const sendOTP = async (email: string) => {
//     return await auth.api.forgetPasswordEmailOTP({
//         body: { email: email.toLowerCase().trim() }
//     });
// };

// export const resetWithOTP = async (data: any) => {
//     return await auth.api.resetPasswordEmailOTP({
//         body: {
//             email: data.email.toLowerCase().trim(),
//             otp: String(data.otp).trim(),
//             password: data.newPassword
//         }
//     });
// };

// export const verifyEmail = async (email: string, otp: string) => {
//     return await auth.api.verifyEmailOTP({
//         body: { email, otp }
//     });
// };