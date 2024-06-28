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
  // console.log(errors,'<<========')
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
    setErrors({})
    if (!validateForm()) return;

    const response = await dispatch(
      thunkSignup({
        email,
        username,
        password,
      })
    );

    if(response.errors){
      setErrors(response.errors)
    }else{
      closeModal()
    }
  };

  return (
    <>
      <h1 className="modal-title">Sign Up</h1>
      {/* {errors.server && <p className="modal-error">{errors.server}</p>} */}
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
        {errors.confirmPassword && <p className="modal-error">{errors.confirmPassword}</p>}
        </label>
        <button type="submit" className="modal-button">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
