import UserStatus from "@/components/UserStatus/UserStatus";
import css from "./profile.module.css";
import UserLeagues from "@/components/UserLeagues/UserLeagues";

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
      <div className={css.wrapper}>
        <h2 className={css.title}>User profile</h2>
        <UserStatus />
      </div>
      <div className={css.wrapper}>
        <h2 className={css.title}>Prognozes</h2>
        {/* <UserStatus /> - тут будет список ближайших прогнозов */}
      </div>
      <div className={css.wrapper}>
        <h2 className={css.title}>Leagues</h2>
        <UserLeagues /> {/* - тут будут лиги*/}
      </div>
    </main>
  );
}
