import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkSignup } from "../../redux/session";
import { OpenModalButtonLogin } from '../OpenModalButton/OpenModalButton';
import LoginFormModal from "../LoginFormModal";
import "./SignupForm.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (username.trim().length < 3 || username.trim().length > 20) {
      newErrors.username = "Username must be between 3 and 20 characters";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6 || password.length > 24) {
      newErrors.password = "Password must be between 6-24 characters long";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Confirm Password must match the Password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    }
  };

  return (
    <div className="splashForm">
      <h1 className="modal-title spage">Sign Up</h1>
      {errors.server && <p className="modal-error">{errors.server}</p>}
      <form onSubmit={handleSubmit} className="modal-form">
        <label className="modal-label fname">
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
        <label className="modal-label fname">
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
        <label className="modal-label fname">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="modal-input"
          />
        </label>
        {errors.password && <p className="modal-error fname">{errors.password}</p>}
        <label className="modal-label fname">
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
        <div className="fname">or...</div>
      </form>
        <OpenModalButtonLogin
          buttonText="Log in"
          onItemClick={() => setShowMenu(false)}
          modalComponent={<LoginFormModal />}
        />
    </div>
  );
}

export default SignupFormPage;
