import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom"; // Ensure Link is imported
import { UserSessionContext } from './SessionContext';
import { CartAvailProviderContext } from '../CheckoutComponents/AvailToCheckoutContext';
import ApiUrlContext from '../Api';

function UserLogin(){
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const apiUrl = useContext(ApiUrlContext);
    const { setCurrentUser, setRole } = UserSessionContext();
    const { calculateReadyToCheckout } = CartAvailProviderContext();

    function handleLogin(e) {
      e.preventDefault();
  
      let email = e.target.email.value;
      let password = e.target.password.value;
  
      fetch(`${apiUrl}login`, {
          method: "POST",
          credentials: 'include',
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
      }).then((resp) => {
          if (resp.ok) {
              resp.json().then((data) => {
                  if (data.role === 'user') {
                      setCurrentUser(data.user);
                      setRole(data.role);
                      calculateReadyToCheckout(data.user.cart);
                      navigate(`/dashboard`);
                  } else if (data.role === 'owner') {
                      setCurrentUser(data.owner);
                      setRole(data.role);
                      navigate(`/dashboard`);
                  }
              });
          } else {
              setError('Login failed. Incorrect email or password.');
          } 
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError('An error occurred. Please try again.');
      });
    }

    return(
      <section>
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
          <div className="justify-center mx-auto text-left align-bottom transition-all transform bg-white rounded-lg sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="grid flex-wrap items-center justify-center grid-cols-1 mx-auto shadow-xl lg:grid-cols-2 rounded-xl">
              <div className="w-full px-6 py-3">
                <div>
                  <div className="mt-3 text-left sm:mt-5">
                    <div className="inline-flex items-center w-full">
                      <h3 className="text-lg font-bold text-neutral-600 l eading-6 lg:text-5xl">Sign in</h3>
                    </div>
                    <div className="mt-4 text-base text-gray-500">
                      <p>Welcome Back!</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                    <form onSubmit={handleLogin}>
                      <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input type="text" name="email" id="email" className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" placeholder="Enter your email"/>
                      </div>
                      <br></br>
                      <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input type="password" name="password" id="password" className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" placeholder="Enter your password"/>
                      </div>
                      <div className="flex flex-col mt-4 lg:space-y-2">
                        {error && (
                          <p className="text-red-500 text-sm mb-2">{error}</p>
                        )}
                        <button type="submit" className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-amber-500 rounded-xl hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Sign in</button>
                        
                        {/* --- ADDED THIS SECTION --- */}
                        <div className="text-center mt-4">
                          <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            Forgot Password?
                          </Link>
                        </div>
                        {/* ------------------------- */}
                      </div>
                    </form>
                </div>
              </div>
              <div className="order-first hidden w-full lg:block">
                <img className="object-cover h-full bg-cover rounded-l-lg" src="https://ali-practice-aws-bucket.s3.amazonaws.com/equipme.png" alt=""/>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}

export default UserLogin;
