import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiUrlContext from '../Api';

function ResetPassword() {
    const { token } = useParams(); // Get token from URL
    const navigate = useNavigate();
    const apiUrl = useContext(ApiUrlContext);
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const response = await fetch(`${apiUrl}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token, new_password: password }),
            });
            const result = await response.json();

            if (response.ok) {
                toast.success(result.message);
                navigate('/login'); // Redirect to login page on success
            } else {
                toast.error(result.error || "An unknown error occurred.");
            }
        } catch (error) {
            console.error("Reset Password Error:", error);
            toast.error("A server error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Set a New Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-amber-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
