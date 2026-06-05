import ForgotPasswordForm from "@/components/ForgotPasswordForm/ForgotPasswordForm";
import css from "./forgotPassword.module.css";

export default function ForgotPasswordPage() {
  return (
    <div className={css.mainContainer}>
      <h1 className={css.title}>Forgot Password</h1>
      <p className={css.subtitle}>
        Enter your email, and we will send a link to reset your password
      </p>

      <ForgotPasswordForm />
    </div>
  );
}
