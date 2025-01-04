import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";

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

export default function BlogForm() {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [image, setImage] = useState(null);

    // Disable button if any required field is empty
    const disable = !title || !summary || !content || !image;

    async function createNewPost(e) {
        e.preventDefault(); // Prevent default form submission behavior

        const data = new FormData();
        data.append('title', title);
        data.append('summary', summary);
        data.append('content', content);
        data.append('image', image  );

        console.log(image);

        // Example of sending data to the backend
        
        const response = await fetch('http://localhost:3000/post', {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
        if(response.ok){
            alert('Post created successfully');
            const result = await response.json();
            console.log(result);
            setRedirect(true);
        }
    }

    if(redirect){
        return <Navigate to={"/"} />
    }

    return (
        <Card className="max-w-2xl mx-auto mt-10 shadow-lg border border-gray-200">
            <CardHeader>
                <h2 className="text-2xl font-bold text-center">Create a Blog Post</h2>
                <p className="text-gray-500 text-center">Unleash Your Creative Prowess! Create Your Blog Here</p>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={createNewPost}>
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
                        <Input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="mt-1"
                        />
                    </div>
                    <CardFooter  className="flex justify-end space-x-2">
                        <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Publish Post
                        </Button>
                    </CardFooter>
                  
                </form>
            </CardContent>
           
        </Card>
    );
}
