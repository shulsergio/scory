"use client";
import SignInForm from "@/components/SignInForm/SignInForm";
import css from "./signin.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";

export default function SignIn() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/profile");
    }
  }, [status, router]);

  if (status === "loading") return <Loader />;

  if (status === "authenticated") return null;

  return (
    <div className={css.main}>
      <h1 className={css.title}>Welcome back</h1>
      <p className={css.text}>Please enter your details to login</p>
      <SignInForm />
      <p className={css.text}>
        Dont have an account? <Link href="/register">Register now</Link>
      </p>
    </div>
  );
}
