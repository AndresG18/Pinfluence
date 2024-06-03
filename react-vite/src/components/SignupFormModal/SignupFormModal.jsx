import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
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
      <h1 className="modal-title">Sign Up</h1>
      {errors.server && <p className="modal-error">{errors.server}</p>}
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
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="modal-input"
          />
        </label>
        {errors.username && <p className="modal-error">{errors.username}</p>}
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
        <label className="modal-label">
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="modal-input"
          />
        </label>
        {errors.confirmPassword && <p className="modal-error">{errors.confirmPassword}</p>}
        <button type="submit" className="modal-button">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
