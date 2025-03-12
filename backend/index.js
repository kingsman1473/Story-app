//require("dotenv").env();
require("dotenv").config();

const port = process.env.PORT || 4000;

//const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const upload = require("./multer");
const fs = require("fs");
const path = require("path");

const { authenticateToken } = require("./utilities");

mongoose.connect(process.env.CONNECTION_STRING);

const User = require("./models/user.model");
const Story = require("./models/story.model");
const { constrainedMemory } = require("process");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

//test api
app.post("/create-account", async (req, res) => {
    //    return res.status(200).json({ message: "Hello World" });

    const { fullName, email, password } = req.body;

    if(!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const isUesr = await User.findOne({ email });
    if(isUesr) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        fullName,
        email,
        password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign(
        { userid: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "72h" });

    return res.status(200).json({
        error: false,
        user: { fullName: user.fullName, email: user.email },
        accessToken,
        message: "User created successfully",
    });


});

//login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "user not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "72h" });
    
    return res.json({
      error: false,
      message: "Login successful",
      user: { fullName: user.fullName, email: user.email },
      accessToken,
    });
});

//get user
app.get("/get-user", authenticateToken, async (req, res) => {
  const { userId } = req.user;

  const isUser = await User.findOne({ _id: userId });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: isUser,
    message: "",
  });
});

//Route to handle image upload
app.post("/upload-image", upload.single('image'), (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ error: true, message: "Image is required" });
        }

        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        
        res.status(201).json({ imageUrl });
    }catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
});

//delte an image from upload folder
app.delete("/delete-image", (req, res) => {
    const { imageUrl } = req.query;
    
    if (!imageUrl) {
        return res.status(400).json({ error: true, message: "Image URL is required" });
    }

    try {
        const filename=path.basename(imageUrl);
        const filePath = path.join(__dirname, "uploads", filename);

        if (fs.existsSync(filePath)) {
            
            fs.unlinkSync(filePath);
            res.status(200).json({ message: "Image deleted successfully" });

        } else {
            res.status(200).json({ error: true, message: "Image not found" });
        }

    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
       
    }
});
//server static files
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/assets", express.static(path.join(__dirname, 'uploads')));

//add story
app.post("/add-story", authenticateToken, async (req, res) => {
    const { title, storyn, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user

    if (!title || !storyn || !visitedLocation || !imageUrl || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const story = new Story({
          title,
          storyn,
          visitedLocation,
          userId,
          imageUrl,
          visitedDate: parsedVisitedDate,
        });

        await story.save();

        res.status(201).json({ story: story, message: "Story added successfully" });
        
    } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    

});

//get all stories
app.get("/get-all-stories", authenticateToken, async (req, res) => {
    const { userId } = req.user;

    try {
        const storys = await Story.find({ userId: userId }).sort({ isFavourite: -1, });
        
        res.status(200).json({ stories: storys });
    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
});

//edit story
app.put("/edit-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, storyn, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    if (!title || !storyn || !visitedLocation || !imageUrl || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const story = await Story.findOne({ _id: id, userId: userId });

        if (!story) {
            return res.status(404).json({ error: true, message: "Story not found" });
        }

        const placeholderImgUrl = `http://localhost:8000/assets/placeholder.png`;

        story.title = title;
        story.storyn = storyn;
        story.visitedLocation = visitedLocation;
        story.imageUrl = imageUrl || placeholderImgUrl;
        story.visitedDate = parsedVisitedDate;

        await story.save();
        res.status(200).json({ story: Story, message: 'Story updated successfully' });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }

});

//delete story
app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        const story = await Story.findOne({ _id: id, userId: userId });

        if (!story) {
            return res.status(404).json({ error: true, message: "Story not found" });
        }

        //delete story from db
        await story.deleteOne({ _id: id, userId: userId });

        //extract image url from the imageUrl
        const imageUrl = story.imageUrl;
        const filename = path.basename(imageUrl);

        //define the file path
        const filePath = path.join(__dirname, "uploads", filename);

        //delete the image from the uploads folder
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("failed to delete image file", err);
            }
        });

        res.status(200).json({ message: "Story deleted successfully" });

    }catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

//update story favourite status
app.put("/update-favourite/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { isFavourite } = req.body;
    const { userId } = req.user;

    try {
        const story = await Story.findOne({ _id: id, userId: userId });

        if (!story) {
            return res.status(404).json({ error: true, message: "Story not found" });
        }

        story.isFavourite = isFavourite;

        await story.save();
        res.status(200).json({ story: story, message: "Story updated successfully" });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

//search story
app.get("/search", authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const { query } = req.query;
    
    if (!query) {
        return res.status(400).json({ error: true, message: "Query is required" });
    }

    try {
        const searchResults = await Story.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { storyn: { $regex: query, $options: "i" } },
                { visitedLocation: { $regex: query, $options: "i" } },
            ],
        }).sort({ isFavourite: -1 });
        
        res.status(200).json({ stories: searchResults });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }

});

//filter story by date range
app.get("/story/filter", authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const { startDate, endDate } = req.query;

    try {

        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        const filteredStories = await Story.find({
            userId: userId,
            visitedDate: {
                $gte: start,
                $lte: end,
            },
        }).sort({ isFavourite: -1 });

        res.status(200).json({ stories: filteredStories });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

app.listen(8000);
module.exports=app;


