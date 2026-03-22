import Link from "next/link";
import { MoveLeft, Trophy } from "lucide-react";
import ButtonBox from "@/components/ButtonBox/ButtonBox";
import css from "./page.module.css";

export default function NotFound() {
  return (
    <main className={css.container}>
      <div className={css.content}>
        <div className={css.errorCode}>
          <span>4</span>
          <Trophy size={80} className={css.icon} />
          <span>4</span>
        </div>

        <h1 className={css.title}>Oops! Youre Offside.</h1>

        <p className={css.message}>
          The page you are looking for has been moved, deleted, or never
          existed. Even the best strikers sometimes miss the target!
        </p>

        <div className={css.actions}>
          <ButtonBox option="link" href="/" className={css.homeBtn}>
            <MoveLeft size={20} />
            Back to Home
          </ButtonBox>

          <Link href="/matches" className={css.secondaryLink}>
            Check upcoming matches
          </Link>
        </div>
      </div>
    </main>
  );
}
