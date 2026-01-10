import css from "./enter.module.css";

export default function Enter() {
  return (
    <div className={css.page}>
      <main className={css.main}>
        <div className={css.intro}>
          <p className={css.descriptionTop}>Welcome to</p>
          <h1 className={css.title}>SCORY</h1>
          <p className={css.descriptionBottom}>write your story of glory</p>
          <p>PREVIEW</p>
          <p>Branch_3</p>
        </div>
        <div className={css.comingSoon}>coming soon</div>
      </main>
    </div>
  );
}
