import ResetPasswordForm from "@/components/ResetPasswordForm/ResetPasswordForm";
import css from "./resetPassword.module.css";

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className={css.mainContainer}>
        <h1 className={css.title}>Error</h1>
        <p className={css.errorText}>Token is missing or invalid.</p>
      </div>
    );
  }

  return (
    <div className={css.mainContainer}>
      <h1 className={css.title}>Create New Password</h1>
      <p className={css.subtitle}>Please enter your new password below</p>

      <ResetPasswordForm token={token} />
    </div>
  );
}
