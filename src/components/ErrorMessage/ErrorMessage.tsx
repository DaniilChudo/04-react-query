import css from "./ErrorMessage.module.css";

const ErrorMessage = () => (
  <div className={css.container}>
    <p className={css.text}>There was an error, please try again...</p>
  </div>
);

export default ErrorMessage;
