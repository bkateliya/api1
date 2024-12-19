const express = require("express");
const fs = require("fs");
const objects = require("./mock_data.json"); // Correct path here
const contactus = require("./contact_requests.json"); // For storing contact requests

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json()); // Use express.json() to parse incoming JSON payloads

// Routes
app.get("/objects", (req, res) => {
    const html = `
    <ul>
    ${objects.map((user) => `<li>${user.Name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

app.get("/contactus", (req, res) => {
    const html = `
    <ul>
    ${contactus.map((user) => `<li>${user.Name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

app.get("/api/objects", (req, res) => {
    return res.json(objects);
});
app.get("/api/contactus", (req, res) => {
    return res.json(contactus);
});

// POST route to add a new user
app.post("/api/objects", (req, res) => {
    const body = req.body; // This will now contain the incoming JSON data

    // // Validate required fields
    // if (!body.Name || !body.ContactNumber || !body.Email) {
    //     return res.status(400).json({
    //         status: "error",
    //         message: "Name, ContactNumber, and Email are required fields.",
    //     });
    // }

    // // Check if the email already exists in the objects array
    // const emailExists = objects.some((user) => user.Email === body.Email);
    // if (emailExists) {
    //     return res.status(400).json({
    //         status: "error",
    //         message: "Email already exists. Please use a different email.",
    //     });
    // }

    // Add the new user with a unique id
    const newUser = { ...body, id: objects.length + 1 };
    objects.push(newUser);
    console.log("New user added:", newUser); // Log the full user data to verify

    // Write the updated objects array to the MOCK_DATA.json file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(objects), (err) => {
        if (err) {
            return res
                .status(500)
                .json({ status: "error", message: "Failed to save data" });
        }
        return res.json({ status: "success", id: newUser.id });
    });
});

app.post("/api/contactus", (req, res) => {
    const body = req.body; // This will now contain the incoming JSON data

    // Add the new user with a unique id
    const newUser = { ...body, id: contactus.length + 1 };
    contactus.push(newUser);
    console.log("New user added:", newUser); // Log the full user data to verify

    // Write the updated objects array to the MOCK_DATA.json file
    fs.writeFile("./contact_requests.json", JSON.stringify(objects), (err) => {
        if (err) {
            return res
                .status(500)
                .json({ status: "error", message: "Failed to save data" });
        }
        return res.json({ status: "success", id: newUser.id });
    });
});

app.listen(PORT, () => {
    console.log(`Server started at PORT:${PORT}`);
});
