import css from "./teams.module.css";
/**
 *
 *
 * @export
 * @param {{ params: { id: string } }} { params }
 * @return {*}
 */
export default async function TeamPage({ params }: { params: { id: string } }) {
  //const { id } = params.id;

  const { id } = await params;

  return (
    <div>
      <h1>Team Page</h1>
      <p className={css.p}>Team ID: {id}</p>
    </div>
  );
}
