import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import ApiUrlContext from '../Api';
import LoadingPage from '../ExtraPageComponents/LoadingPage';

function AfterCheckout() {
    const apiUrl = useContext(ApiUrlContext);
    const [sessionDetails, setSessionDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation(); // Hook to access URL information

    // --- Navigation Handlers ---
    const handleDashNav = () => {
        window.scrollTo(0, 0);
        navigate(`/dashboard`);
    };

    const handleHomeNav = () => {
        window.scrollTo(0, 0);
        navigate(`/`);
    };

    const handleCartNav = () => {
        window.scrollTo(0, 0);
        navigate(`/cart`);
    };

    const handleSupportNav = () => {
        navigate(`/contact/us`);
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        // This effect runs when the component mounts to get the session status from Stripe
        const queryParams = new URLSearchParams(location.search);
        const sessionId = queryParams.get('session_id');

        if (sessionId) {
            const fetchSessionDetails = async () => {
                try {
                    // Fetch details from the new backend endpoint using the session_id
                    const response = await fetch(`${apiUrl}/checkout-session/${sessionId}`);
                    
                    if (!response.ok) {
                        // Handle cases where the session is not found or another error occurs
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    setSessionDetails(data); // Store the session details from Stripe
                } catch (error) {
                    console.error("Fetch error:", error);
                } finally {
                    setIsLoading(false); // Stop loading regardless of outcome
                }
            };
            fetchSessionDetails();
        } else {
            // If no session_id is in the URL, stop loading and show an error
            console.error("No session_id found in URL");
            setIsLoading(false);
        }
    }, [location, apiUrl]); // Dependency array ensures this runs when the URL changes

    // --- Render Logic ---
    if (isLoading) {
        return <LoadingPage loadDetails={"your Order Confirmation"} />;
    }

    // Check if the payment was successful by looking at the session status
    if (sessionDetails && sessionDetails.status === 'complete') {
        return (
            <div className="bg-white min-h-screen flex flex-col items-center pt-5 pb-5">
                <div className="flex flex-col items-center justify-center text-center px-4">
                    <img src="https://i.imgur.com/9L7Tjf9.png" alt="Successful Checkout" className="w-80 mt-20" />

                    <p className="text-green-600 text-2xl mt-4">Payment Successful!</p>
                    <p className="text-gray-700 mt-4">Payment ID: {sessionDetails.payment_intent}</p>
                    <p className="text-gray-700 mt-2">Amount Paid: ${(sessionDetails.amount_total / 100).toFixed(2)} {sessionDetails.currency.toUpperCase()}</p>
                    <p className="font-semibold text-2xl mt-10 text-gray-700">Thank you for your rental!</p>
                    <p className="mt-10 text-gray-600 max-w-lg">Your rental was successful and you will receive a confirmation email soon. Your equipment is now reserved.</p>
                </div>

                <div className='flex flex-wrap justify-center gap-4 mt-10'>
                    <button onClick={handleCartNav} className="mt-10 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors bg-amber-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 border border-transparent">
                        Back to Cart
                    </button>
                    <button onClick={handleHomeNav} className="mt-10 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors bg-amber-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 border border-transparent">
                        Home
                    </button>
                    <button onClick={handleDashNav} className="mt-10 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors bg-amber-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 border border-transparent">
                        My Dashboard
                    </button>
                </div>
            </div>
        );
    } else {
        // This block renders if the session status is not 'complete' or if an error occurred
        return (
            <div className="bg-white min-h-screen flex flex-col items-center justify-center pt-5 pb-5">
                <div className="flex flex-col items-center justify-center text-center px-4">
                    <img src="https://i.imgur.com/ZK0b4sZ.png" alt="Payment Unsuccessful" className="w-80 mt-20" />
                    <p className="text-red-600 text-2xl mt-4">Payment Unsuccessful</p>
                    <p className="font-semibold text-xl mt-10 text-gray-700">We encountered an issue processing your payment.</p>
                    <p className="mt-5 text-gray-600 max-w-lg">Please check your payment details and try again. If you continue to experience issues, contact our support team for assistance.</p>
                </div>
                <div className='flex flex-row gap-4 mt-20'>
                    <button onClick={handleSupportNav} className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 border border-transparent">
                        Contact Support
                    </button>
                </div>
            </div>
        );
    }
}

export default AfterCheckout;
