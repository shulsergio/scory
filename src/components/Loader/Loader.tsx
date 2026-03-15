import { ClipLoader } from "react-spinners";
import css from "./Loader.module.css";
export default function Loader() {
  return (
    <div className={css.loader}>
      <ClipLoader color="#0075fc" size={100} />
    </div>
  );
}
