import { Link } from 'react-router-dom';
import ChangePasswordForm from '../components/ChangePasswordForm';
import MobileEdit from '../components/MobileEdit';
import '../../../app/App.css';

export default function SettingsPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 16px' }}>
      <div className="auth-card" style={{ width: '100%', maxWidth: '480px' }}>
        <h2>Settings</h2>
        <Link className="auth-link" to="/intern/dashboard">← Back to Dashboard</Link>

        <h3>Profile</h3>
        <MobileEdit />

        <h3>Change Password</h3>
        <ChangePasswordForm />
      </div>
    </div>
  );
}