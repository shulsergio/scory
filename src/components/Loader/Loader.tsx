import { ClipLoader } from "react-spinners";
import css from "./Loader.module.css";
export default function Loader() {
  return (
    <div className={css.loader}>
      <ClipLoader color="#003b7e" size={80} />
    </div>
  );
}
