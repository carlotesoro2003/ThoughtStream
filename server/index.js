require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const cookieParser = require('cookie-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

const app = express();
app.use(cors({credentials: true,origin: 'http://localhost:5173'}));
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cookieParser());


const salt = bcrypt.genSaltSync(10);
const PORT = process.env.PORT || 3000;


// Register Route
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const hashedPassword = bcrypt.hashSync(password, salt);
        const userData = await User.create({ username, email, password: hashedPassword });
        
        console.log('New User Registered:', userData);
        return res.status(201).json({ message: 'User registered successfully', user: userData });
    } catch (error) {
        console.error('Registration Error:', error.message);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


// Login Route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Verify password
        const isPasswordValid = bcrypt.compareSync(password, userData.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: userData._id, email: userData.email, username: userData.username }, 
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.cookie('token', token).json({
            message: 'Login successful',
            token,
            user: {
                id: userData._id,
                username: userData.username,
                email: userData.email
            }
        }); 
    } catch (error) {
        console.error('Login Error:', error.message);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

//Logout route
app.post('/logout', async(req, res) =>{
    res.clearCookie('token').json({message: 'Logged out'});
})


//get profile route
app.get('/profile', async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        res.json(info);
    });
});

//new post route
app.post('/post',upload.single('image') ,async (req, res) => {
    const {originalname, path } = req.file;
    const parts = originalname.split('.');
    const extension = parts[parts.length - 1];
    const newPath = path + "." + extension;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async(err, info) => {
        if(err) throw err;

        const {title, summary, content} = req.body;
        const data = await Post.create({
            title,
            summary,
            content,
            image: newPath,
            author: info.id
        });
             
        res.json(data);
        console.log('New Post Created:', data);

    });
})


//get all posts
app.get('/', async (req, res) => {
    const posts = await Post.find()
    .populate('author', ['username'])
    .sort({createdAt: -1})
    .limit(20)
    
    res.json(posts);
})


// Get Post by ID
app.get('/:id', async (req, res) => {
    const { id } = req.params;

    // Validate the id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ObjectId' });
    }

    try {
        const post = await Post.findById(id).populate('author', ['username']); 
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Posts by User
app.get('/users/:userId/posts', async (req, res) => {
    const { userId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid ObjectId' });
    }
  
    try {
      const posts = await Post.find({ author: userId })
        .populate('author', ['username'])
        .sort({ createdAt: -1 });
  
      if (!posts.length) {
        return res.status(404).json({ error: 'No posts found for this user' });
      }
  
      res.json(posts);
    } catch (err) {
      console.error('Fetch Posts by User Error:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Post
app.put('/edit/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params; // Extract post ID from URL
        const { token } = req.cookies; // Extract token from cookies

        // Verify JWT Token
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
            if (err) {
                console.error("JWT Verification Error:", err.message);
                return res.status(401).json({ error: "Unauthorized" });
            }

            const { title, summary, content } = req.body;
            let imagePath = null;

            // Handle new image upload if provided
            if (req.file) {
                const { originalname, path } = req.file;
                const parts = originalname.split('.');
                const extension = parts[parts.length - 1];
                const newPath = `${path}.${extension}`;

                // Rename file to include the extension
                fs.renameSync(path, newPath);
                imagePath = newPath;
            }

            // Update Post using findByIdAndUpdate
            const updatedPost = await Post.findByIdAndUpdate(
                id,
                {
                    $set: {
                        title: title || undefined,
                        summary: summary || undefined,
                        content: content || undefined,
                        ...(imagePath && { image: imagePath })
                    }
                },
                { new: true, runValidators: true }
            );

            if (!updatedPost) {
                return res.status(404).json({ error: "Post not found" });
            }

            // Ensure the authenticated user is the author of the post
            if (updatedPost.author.toString() !== info.id) {
                return res.status(403).json({ error: "You are not authorized to edit this post." });
            }

            res.status(200).json({
                message: "Post updated successfully",
                post: updatedPost
            });

            console.log('Post Updated:', updatedPost);
        });
    } catch (error) {
        console.error("Update Post Error:", error.message);
        res.status(500).json({ error: "Failed to update post" });
    }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
    });
