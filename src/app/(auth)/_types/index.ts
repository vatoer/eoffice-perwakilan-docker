import { z } from "zod";

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
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

    countOfLowerCase < 1 && (message += "add lowercase, ");
    countOfUpperCase < 1 && (message += "add uppercase, ");
    countOfSpecialChar < 1 && (message += "add special char, ");
    countOfNumbers < 1 && (message += "add number, ");

    if (message.length > 0) {
      console.log("password does not meet complexity requirements");
      checkPassComplexity.addIssue({
        code: "custom",
        path: ["password"],
        message: message.replace(/,\s*$/, ""),
      });
    }
  });

export type FormSchema = z.infer<typeof formSchema>;
