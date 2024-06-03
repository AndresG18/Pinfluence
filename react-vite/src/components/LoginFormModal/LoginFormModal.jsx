import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <>
      <h1 className="modal-title">Log In</h1>
      <form onSubmit={handleSubmit} className="modal-form">
        <label className="modal-label">
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="modal-input"
          />
        </label>
        {errors.email && <p className="modal-error">{errors.email}</p>}
        <label className="modal-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="modal-input"
          />
        </label>
        {errors.password && <p className="modal-error">{errors.password}</p>}
        <button type="submit" className="modal-button">Log In</button>
      </form>
    </>
  );
}

export default LoginFormModal;
