import SignInForm from "@/components/SignInForm/SignInForm";
import css from "./signin.module.css";
import Link from "next/link";

export default function SignIn() {
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
