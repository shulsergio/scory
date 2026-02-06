import RegisterForm from "@/components/RegisterForm/RegisterForm";
import css from "./register.module.css";
import Link from "next/link";

export default function Register() {
  return (
    <div className={css.main}>
      <h1 className={css.title}>Create Account</h1>
      <p className={css.text}>Please enter your details to register</p>
      <RegisterForm />
      <p className={css.text}>
        Already have an account? <Link href="/signIn">Login now</Link>
      </p>
    </div>
  );
}
