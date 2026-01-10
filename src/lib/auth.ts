import { betterAuth, string } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma as prismaClient } from "./prisma";
import { sendMail } from "../utils/mailServices";
// If your Prisma file is located elsewhere, you can change the path
import { bearer, emailOTP } from "better-auth/plugins";
import { getVerificationTemplate } from "../templates/mail-templates";
import { resetPassword } from "better-auth/api";

const prisma = prismaClient;
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins:[
        "http://localhost:3000",
        "https://postella-beta.vercel.app",
        "https://nuance-daily.vercel.app",
        "https://neonotesbackend-production.up.railway.app"
    ],
    plugins: [bearer(),
    // emailOTP({
    //     expiresIn: 600,
    //     async sendVerificationOTP({ email, otp, type }) {
    //         if (type === "forget-password") {
    //             await sendMail({
    //                 email: email,
    //                 name: "User",
    //                 subject: "Reset Your Password",
    //                 body: `<p>Your password reset code is: <b>${otp}</b></p>`,
    //             });
    //         }
    //         //    await sendMail({
    //         //         email: email,
    //         //         name: "User",
    //         //         subject: `Your Verification Code: ${otp}`,
    //         //         body: `<p> type = ${type} Your code is <b>${otp}</b>. It will expire soon.</p>`,
    //         //     });
    //     },

    //     sendVerificationOnSignUp: true
    // })
    ],

    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
       
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: true
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            },
            phone: {
                type: "string",

                required: false
            }
        }
    },
        emailVerification:{
    sendOnSignUp: true,
            autoSignInAfterVerification: false,
            sendVerificationEmail: async ( { user, url, token }, request) => {

    // 1. Create your desired destination
            const myCustomLandingPage = "http://localhost:3000/success-verification";

            // 2. Build the final link
            // We use encodeURIComponent to ensure the URL doesn't break
            const finalLink = `http://localhost:5000/api/auth/verify-email?token=${token}&callbackURL=${myCustomLandingPage}`;

               const result = await sendMail({
                    email:user.email,
                    name:user.name,
                    subject: "verify email",
                    body:getVerificationTemplate(user.name,finalLink)
                })

                console.log(result.messageId,"sended");

        },

        },

    socialProviders: {
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        accessType: "offline", 
        prompt: "select_account consent", 
        
    },
    }
});
