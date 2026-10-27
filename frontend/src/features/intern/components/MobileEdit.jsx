import { useState } from "react";
import { updateProfile } from '../services/intern.service';
import { useAuth } from "../../auth/hooks/useAuth";

export default function MobileEdit() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(user?.mobileNo || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setError("");
    setSuccess("");
    if (!/^\d{10}$/.test(value))
      return setError("Mobile number must be exactly 10 digits");

    setLoading(true);
    try {
      await updateProfile({ mobileNo: value });
      setUser((prev) => ({ ...prev, mobileNo: value }));
      setEditing(false);
      setSuccess("Mobile number updated");
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

  const cancel = () => {
    setValue(user?.mobileNo || "");
    setError("");
    setEditing(false);
  };

  if (!editing) {
    return (
      <div>
        <p>
          <b>Mobile Number:</b> {user?.mobileNo || "Not added yet"}
        </p>
        {success && (
          <div className="auth-status success" role="status">
            {success}
          </div>
        )}
        <button
          type="button"
          className="primary"
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div>
      <label className="field">
        <b>Mobile Number</b>
        <div className="input-wrap">
          <span className="input-icon">📱</span>
          <input
            value={value}
            maxLength={10}
            inputMode="numeric"
            onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
          />
        </div>
      </label>
      {error && (
        <div className="auth-status error" role="alert">
          {error}
        </div>
      )}
      <button
        type="button"
        className="primary"
        onClick={save}
        disabled={loading}
      >
        {loading ? <span className="spinner"></span> : "Save"}
      </button>
      <button
        type="button"
        className="auth-link"
        onClick={cancel}
        disabled={loading}
      >
        Cancel
      </button>
    </div>
  );
}
