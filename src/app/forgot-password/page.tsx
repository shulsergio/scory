import ForgotPasswordForm from "@/components/ForgotPasswordForm/ForgotPasswordForm";
import css from "./forgotPassword.module.css";

export default function ForgotPasswordPage() {
  return (
    <div className={css.mainContainer}>
      <h1 className={css.title}>Восстановление доступа</h1>
      <p className={css.subtitle}>
        Введите ваш email, и мы отправим ссылку для сброса пароля
      </p>

      <ForgotPasswordForm />
    </div>
  );
}
