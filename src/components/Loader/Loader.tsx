import css from "./Loader.module.css";

const Loader = () => (
  <div className={css.container}>
    <p className={css.text}>Loading movies, please wait...</p>
  </div>
);

export default Loader;
