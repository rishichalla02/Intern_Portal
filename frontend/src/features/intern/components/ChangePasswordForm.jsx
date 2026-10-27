import { useState } from "react";
import { setPassword } from '../services/intern.service';
import { useAuth } from "../../auth/hooks/useAuth";

const initial = { currentSecret: "", newPassword: "", confirm: "" };

export default function ChangePasswordForm() {
  const { user, setUser } = useAuth();
  const hasPassword = !!user?.hasPassword;

  const [values, setValues] = useState(initial);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!values.currentSecret)
      return hasPassword
        ? "Enter your current password"
        : "Enter your intern code or current password";
    if (values.newPassword.length < 8)
      return "Password must be at least 8 characters";
    if (!/[A-Za-z]/.test(values.newPassword))
      return "Password must contain at least one letter";
    if (!/\d/.test(values.newPassword))
      return "Password must contain at least one number";
    if (values.newPassword !== values.confirm) return "Passwords do not match";
    return "";
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const problem = validate();
    if (problem) return setError(problem);

    setLoading(true);
    try {
      const data = await setPassword({
        currentSecret: values.currentSecret,
        newPassword: values.newPassword,
      });
      setSuccess(data.message || "Password updated successfully");
      setValues(initial);
      setUser((prev) => ({ ...prev, hasPassword: true }));
    } catch (err) {
      setError(
        err.errors?.[0]?.message ||
          err.message ||
          "Something went wrong, please try again",
      );
    } finally {
      setLoading(false);
    }
  };

  const type = show ? "text" : "password";

  const field = (name, label, placeholder) => (
    <label className="field">
      <b>{label}</b>
      <div className="input-wrap">
        <span className="input-icon">🔒</span>
        <input
          type={type}
          name={name}
          value={values[name]}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </label>
  );

  return (
    <form onSubmit={submit} noValidate>
      {field(
        "currentSecret",
        hasPassword ? "Current Password" : "Intern Code or Current Password",
        "••••••••",
      )}
      {field(
        "newPassword",
        "New Password",
        "At least 8 characters, letters and numbers",
      )}
      {field(
        "confirm",
        "Confirm New Password",
        "Enter your new password again",
      )}

      <label className="field">
        <span>
          <input
            type="checkbox"
            checked={show}
            onChange={() => setShow(!show)}
          />{" "}
          Show passwords
        </span>
      </label>

      {error && (
        <div className="auth-status error" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="auth-status success" role="status">
          {success}
        </div>
      )}

      <button type="submit" className="primary" disabled={loading}>
        {loading ? <span className="spinner"></span> : "Update Password"}
      </button>
    </form>
  );
}
