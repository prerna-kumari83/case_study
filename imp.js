const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
const { faker } = require("@faker-js/faker");
const methodOverride = require("method-override");
const e = require("express");

const app = express();
const port = 8080;

app.use(methodOverride("_method")); // Standard naming for method override
app.use(express.urlencoded({ extended: true })); // Enables parsing of form data

// Function to establish a database connection
async function connectDB() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "tony",
        password: "tonyprerna",
    });
}

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to the Home Page!");
});

// Feedback route
app.get("/feedback", (req, res) => {
    res.send("Feedback Page");
});

// Fetch all users
app.get("/user", async (req, res) => {
    const connection = await connectDB();
    const q = "SELECT * FROM tab";

    try {
        const [users] = await connection.query(q);
        res.render("show.ejs", { users });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.send("Something went wrong with the database.");
    } finally {
        await connection.end();
    }
});

// Fetch a specific user for editing
app.get("/user/:id/edit", async (req, res) => {
    const { id } = req.params;
    const q = "SELECT * FROM tab WHERE id = ?";

    try {
        const connection = await connectDB();
        const [rows] = await connection.query(q, [id]);
        await connection.end();

        if (rows.length === 0) {
            return res.send("User not found.");
        }

        res.render("edit.ejs", { user: rows[0] });
    } catch (err) {
        console.error("Error fetching user for edit:", err);
        res.send("Something went wrong with the database.");
    }
});

// Update user details
app.patch("/user/:id", async (req, res) => {
    const { id } = req.params;
    const { username: newusername, password: formpassword } = req.body;

    const connection = await connectDB();

    try {
        // Fetch existing user password
        const qSelect = "SELECT password FROM tab WHERE id = ?";
        const [rows] = await connection.query(qSelect, [id]);

        if (rows.length === 0) {
            await connection.end();
            return res.send("User not found.");
        }

        const dbPassword = rows[0].password;

        // Compare passwords before updating
        if (formpassword !== dbPassword) {
            await connection.end();
            return res.send("Wrong password.");
        }
        else{
            
        

        // Update user details in DB
        const qUpdate = "UPDATE tab SET username = ?, password = ? WHERE id = ?";
        await connection.query(qUpdate, [newusername, formpassword, id]);
        await connection.end();
        }

        res.redirect("/user")
    } catch (err) {
        console.error("Error updating user:", err);
        res.send("Something went wrong while updating the user.");
    }
});
