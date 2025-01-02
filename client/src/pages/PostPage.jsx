import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PostPage() {
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${id}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch post");
        setPost(data);
      } catch (err) {
        console.error("Fetch Error:", err.message);
        setError(err.message);
      }
    };

    const fetchAllPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/");
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Posts data is not an array");
        }

        // Take only the first 5 posts
        setRecentPosts(data.slice(0, 5));
      } catch (err) {
        console.error("Recent Posts Fetch Error:", err.message);
        setRecentPosts([]);
      }
    };

    fetchPost();
    fetchAllPosts();
  }, [id]);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Blog Post Section */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <p className="text-sm text-gray-500">
              {post.author?.username || "Unknown"} - {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <img
              src={`http://localhost:3000/${post.image}`}
              alt={post.title}
              className="w-full h-96 object-cover rounded-md mb-4"
            />
            <p className="text-lg font-semibold mb-2">{post.summary}</p>
            <div className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: post.content }}>
            </div>
            <Separator className="my-4" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts Sidebar */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Blogs</h2>
        <div className="space-y-4">
          {recentPosts.length > 0 ? (
            recentPosts.map((recentPost) => (
              <Card key={recentPost._id} className="p-4 hover:shadow-md">
                <img
                  src={`http://localhost:3000/${recentPost.image}`}
                  className="w-full h-48  rounded-md mb-4"
                />
                <h3 className="font-semibold">{recentPost.title}</h3>
                <p className="text-sm text-gray-600 truncate">
                  {recentPost.summary}
                </p>
                <a
                  href={`/post/${recentPost._id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Read more
                </a>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">No recent blogs available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
