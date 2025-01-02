import { useEffect, useState } from "react";
import Posts from "./Posts";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function IndexPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    fetch('http://localhost:3000/').then(response => {
      response.json().then(posts => {
        setPosts(posts);
      })
    })
  })

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
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16 text-center">
        {username  && (
        <h1 className="text-4xl font-extrabold mb-4">
           Welcome to ThoughtStream, {username}
         </h1>
        )}
        {!username && (
            <h1 className="text-4xl font-extrabold mb-4">
              Welcome to ThoughtStream
            </h1>
        )}  
        <p className="text-lg max-w-2xl mx-auto">
          Your space for inspiration, creativity, and insightful discussions.
          Explore our featured blogs and start your journey.
        </p>
        <Button
          variant="default"
          className="mt-6 bg-white text-blue-600 hover:bg-gray-100"
          onClick={() => navigate("/create")}
        >
          Create your Blog Now
        </Button>
      </section>

      <section className="py-12 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 && posts.map((post) => (
          <Posts key={post._id} post={post} />
        ))}
      </section>
    </>
  );
}
