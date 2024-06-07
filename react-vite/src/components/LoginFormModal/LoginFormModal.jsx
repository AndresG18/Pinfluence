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

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!validateEmail(email)) {
      validationErrors.email = "Please enter a valid email address.";
    }

    if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters long.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
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
        {errors.message && <p className="modal-error">{errors.message}</p>}
        <button type="submit" className="modal-button">Log In</button>
      </form>
    </>
  );
}

export default LoginFormModal;
