import { z } from "zod";

export const UncomplexLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type UncomplexLogin = z.infer<typeof UncomplexLoginSchema>;

export const LoginSchema = z
  .object({
    email: z.string().email({ message: "email tidak valid" }),
    password: z.string().min(8, {
      message: "minimal 8 karakter",
    }),
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;

    let message = "";

    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }

    countOfLowerCase < 1 && (message += " huruf kecil, ");
    countOfUpperCase < 1 && (message += " huruf besar, ");
    countOfSpecialChar < 1 && (message += "karakter special, ");
    countOfNumbers < 1 && (message += "angka, ");

    if (message.length > 0) {
      console.log("password does not meet complexity requirements");
      checkPassComplexity.addIssue({
        code: "custom",
        path: ["password"],
        message: "tambahkan " + message.replace(/,\s*$/, ""),
      });
    }
  });

export type TLogin = z.infer<typeof LoginSchema>;
