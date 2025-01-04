import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FilePenLine } from "lucide-react";
import { Trash2 } from "lucide-react";

export default function UserBlogsPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function deleteBlog(id){
    try{
      const response = await fetch(`http://localhost:3000/delete/${id}`, {
        method: "DELETE",
        credentials: 'include',
      });

      if(response.ok){
        alert('Blog deleted successfully');
        setBlogs(blogs.filter(blog => blog._id !== id));
      }
      else{
        throw new Error('Failed to delete blog');
      }
    }
    catch(error){
      console.error('Delete Error:', error.message);
      alert('Failed to delete blog. Please try again.');
    }
  }

  useEffect(() => {
    async function fetchUserBlogs() {
      try {
        const response = await fetch(
          `http://localhost:3000/users/${userId}/posts`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserBlogs();
  }, [userId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="w-1/2 h-24 rounded-md" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-gray-500">{error}</p>
        <Button
          className="mt-4"
          variant="default"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">My Blogs</h1>
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">This user has no blogs yet.</p>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="flex flex-col md:flex-row items-start gap-4 bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Blog Image */}
              <div className="w-full md:w-1/3 h-48 md:h-64 overflow-hidden">
                <img
                  src={`http://localhost:3000/${blog.image}`}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Blog Details */}
              <div className="flex-1 p-4">
                <h2 className="text-2xl font-bold mb-2 hover:underline cursor-pointer">
                  {blog.title}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  {blog.author?.username || "Unknown"} ·{" "}
                  {new Date(blog.createdAt).toLocaleString()}
                </p>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </p>
                <div className="flex space-x-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/post/${blog._id}`)}
                  >
                    Read More
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-600 text-white hover:bg-green-700 flex items-center"
                    onClick={() => navigate(`/edit/${blog._id}`)}
                  >
                    <FilePenLine className="w-5 h-5 mr-2" />
                    Edit
                  </Button>
                  <Button
                   variant="outline"
                    size="sm"
                    className="bg-red-600 text-white hover:bg-red-700 flex items-center"
                    onClick = {() => deleteBlog(blog._id)}
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
