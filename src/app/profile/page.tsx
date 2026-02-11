import UserStatus from "@/components/UserStatus/UserStatus";
import css from "./profile.module.css";

/**
 * Страница Профиля юзера после входа
 * Должно быть 3 блока - статус юзера, матчи, лиги
 *
 * @export
 * @return {* }
 *
 */
export default function Profile() {
  return (
    <main className={css.mainContainer}>
      <h2 className={css.title}>Профиль</h2>
      <UserStatus />
      {/* <h2 className={css.title}>Matches</h2>
      <UserStatus />
      <h2 className={css.title}>Leagues</h2>
      <UserStatus /> */}
    </main>
  );
}
