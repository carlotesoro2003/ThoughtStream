import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false); 

  async function handleLogin(e){
    e.preventDefault();
    try{
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const result = await response.json();

      if(!response.ok){
        console.error('Error:', result.message);
        alert(`Login failed: ${result.message}`);
        return;
      }
      else{
        alert("Login successful");
        setRedirect(true);  
      }     
    }
    catch(error){
      console.error('Fetch Error:', error.message);
      alert('Failed to login. Please try again.');
    }
  }

  if(redirect){
    return <Navigate to={"/"} />
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 space-y-6">
        {/* Title Section */}
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Welcome Back 👋
        </h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Please log in to continue
        </p>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Submit Button */}
          <Button
            variant="default"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md"
          >
            Log In
          </Button>
        </form>

        {/* Footer Section */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
