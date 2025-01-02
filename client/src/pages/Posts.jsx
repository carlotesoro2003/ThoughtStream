import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Posts({ post }) {
  const navigate = useNavigate();
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="relative">
        <img
          src={`http://localhost:3000/${post.image}`}
          alt="Blog Post"
          className="w-full h-48 transition-transform duration-300 ease-in-out transform hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h2 className="text-xl font-semibold text-white">{post.title}</h2>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          <strong>
            {post.author.username} - {formattedDate}
          </strong>
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {post.summary}
        </p>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
        <Button
          variant="link"
          className="text-blue-600 hover:text-blue-700"
          onClick={() => navigate(`/post/${post._id}`)}
        >
          Read More
        </Button>
      </div>
    </div>
  );
}
