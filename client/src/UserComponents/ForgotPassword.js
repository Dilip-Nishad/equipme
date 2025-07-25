import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import ApiUrlContext from '../Api';

function ForgotPassword() {
    const apiUrl = useContext(ApiUrlContext);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const response = await fetch(`${apiUrl}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const result = await response.json();
            
            // Always show the same success message for security
            toast.info(result.message, { autoClose: 5000 });
            setEmail(''); // Clear the input field

        } catch (error) {
            console.error("Forgot Password Error:", error);
            toast.error("An error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Forgot Your Password?</h2>
                <p className="text-center text-gray-600 mb-6">
                    No problem! Enter your email address below and we'll send you a link to reset it.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-amber-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
