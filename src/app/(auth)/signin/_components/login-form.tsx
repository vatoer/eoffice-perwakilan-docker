"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import InputForm from "@auth/_components/input-form";
import { UncomplexLoginSchema } from "@auth/_zodschema/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Phone } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type UncomplexLogin = z.infer<typeof UncomplexLoginSchema>;

const LoginForm = () => {
  const callbackUrl =
    useSearchParams().get("callbackUrl") ?? "/mailbox/disposisi";
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<UncomplexLogin>({
    resolver: zodResolver(UncomplexLoginSchema),
  });

  const onSubmit = async (data: UncomplexLogin) => {
    console.log(data);
    try {
      const response = await signIn("credentials", {
        //redirect: false,
        username: data.username,
        password: data.password,
        callbackUrl,
      });

      if (!response?.error) {
        router.push(callbackUrl);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2 mb-4">
        <Image
          src="/logo.png"
          alt="Logo"
          width={72}
          height={72}
          className="mx-auto rounded-full"
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <InputForm
          id="username"
          label="Username"
          type="text"
          register={register}
          error={errors.username}
        />
        <InputForm
          id="password"
          label="password"
          type="password"
          register={register}
          error={errors.password}
        />
        <Button className=" w-full py-6" disabled={isLoading} type="submit">
          Sign in
          {isLoading && (
            <Loader className="ml-2 spin-in" size={24} color="white" />
          )}
        </Button>
        <Link
          href="/#"
          className={buttonVariants({
            variant: "link",
            className: "gap-1.5 w-full text-blue-500",
          })}
        >
          {`Tidak punya akun? hubungi admin`}
          <Phone className="h-4 w-4 ml-1" />
        </Link>
      </form>
    </>
  );
};

export default LoginForm;
