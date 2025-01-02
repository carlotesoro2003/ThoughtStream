import { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/UserContext";

export default function Header() {
  const navigate = useNavigate();
  const {setUserInfo, userInfo} = useContext(UserContext);

  async function handleLogout(){
    try{
      const response = await fetch('http://localhost:3000/logout', {
        method: "POST",
        credentials: 'include',
      });

      if(response.ok){
        setUserInfo(null);
        navigate('/login');
        alert('Logged out successfully');
      }
      else{
        console.error('Logout Error:', response.statusText);
        alert('Failed to logout. Please try again.');
      }
    }
    catch(error){
      console.error('Fetch Error:', error.message);
      alert('Failed to logout. Please try again.');
    }
  }

  useEffect(() => {
    fetch('http://localhost:3000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      })
    });

  }, []);

  const username = userInfo?.username;
  return (
    <>
      <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
        <a
          href="/"
          className="text-2xl font-bold text-gray-900 dark:text-gray-100"
        >
          ThoughtStream
        </a>
        <nav className="flex gap-4">
          {username && (
            <>
              <Button
                variant="ghost"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                {username}
              </Button>

              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
          {!username && (
            <>
              <Button
                variant="ghost"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Register
              </Button>
            </>
          )}
        </nav>
      </header>
    </>
  );
}
