import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Simplified Toolbar Options
const toolbarOptions = [
    [{ 'header': [1, 2, 3, false] }], // Header levels
    ['bold', 'italic', 'underline'], // Basic formatting
    [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
    [{ 'align': [] }], // Alignment
    ['link', 'image'], // Media
    ['clean'] // Clear formatting
];

// Quill Modules Configuration
const modules = {
    toolbar: toolbarOptions,
};

export default function EditBlogForm() {
    const { id } = useParams(); // Get the blog ID from the URL
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState(null); // Store current image URL
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        // Fetch existing blog details
        async function fetchBlogDetails() {
            try {
                const response = await fetch(`http://localhost:3000/${id}`);
                if (!response.ok) throw new Error("Failed to fetch blog details");

                const data = await response.json();
                setTitle(data.title);
                setSummary(data.summary);
                setContent(data.content);
                setExistingImage(data.image); // Store the current image URL
            } catch (error) {
                console.error("Fetch Error:", error.message);
            }
        }

        fetchBlogDetails();
    }, [id]);

    async function updatePost(e) {
        e.preventDefault(); // Prevent default form submission behavior

        const data = new FormData();
        data.append("title", title);
        data.append("summary", summary);
        data.append("content", content);
        if (image) {
            data.append("image", image); // Only add new image if uploaded
        }

        try {
            const response = await fetch(`http://localhost:3000/edit/${id}`, {
                method: "PUT",
                body: data,
                credentials: "include",
            });

            if (response.ok) {
                alert("Post updated successfully");
                setRedirect(true);
            } else {
                throw new Error("Failed to update the post");
            }
        } catch (error) {
            console.error("Update Error:", error.message);
            alert("Failed to update the post. Please try again.");
        }
    }

    if (redirect) {
        return <Navigate to={`/post/${id}`} />;
    }

    return (
        <Card className="max-w-2xl mx-auto mt-10 shadow-lg border border-gray-200">
            <CardHeader>
                <h2 className="text-2xl font-bold text-center">Edit Your Blog</h2>
                <p className="text-center">Update your blog details below.</p>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={updatePost}>
                    {/* Title Field */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <Input
                            type="text"
                            id="title"
                            placeholder="Enter blog title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    {/* Summary Field */}
                    <div>
                        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                            Summary
                        </label>
                        <Input
                            id="summary"
                            placeholder="Enter blog summary"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    {/* Content Field */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content
                        </label>
                        <ReactQuill
                            modules={modules}
                            value={content}
                            onChange={(newValue) => setContent(newValue)}
                            placeholder="Write your blog content here..."
                            className="mt-1"
                        />
                    </div>

                    {/* Image Upload Field */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                            Image
                        </label>
                        {existingImage && (
                            <img
                                src={`http://localhost:3000/${existingImage}`}
                                alt="Current Blog Image"
                                className="w-full h-40 object-cover rounded-md mb-2"
                            />
                        )}
                        <Input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="mt-1"
                        />
                    </div>

                    {/* Form Actions */}
                    <CardFooter className="flex justify-end space-x-2">
                        <Button
                            type="submit"
                            disabled={!title || !summary || !content}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Update Post
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}
