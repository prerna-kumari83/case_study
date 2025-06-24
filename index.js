const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
const methodOverride = require("method-override");

const app = express();
const port = 8080;

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

async function connectDB() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "tony",
        password: "tonyprerna",
    });
}

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to the Home Page!");
});

// Render complaint submission form
app.get("/complain", async (req, res) => {
    res.render("complain.ejs");
});

// Insert a new complaint (Uses POST)
app.post("/submit", async (req, res) => {
    const { username, email, complain, status, rating } = req.body;
    const connection = await connectDB();

    try {
        const qInsert = "INSERT INTO complaints (username, email, complain, status, rating) VALUES (?, ?, ?, ?, ?)";
        await connection.query(qInsert, [username, email, complain, status, rating]);

        await connection.end();
        res.redirect("/user"); // Redirect after successful insertion
    } catch (err) {
        console.error("Error inserting complaint:", err);
        res.send("Something went wrong while inserting data.");
    }
});
//handle feedback
app.get("/feedback", async (req, res) => {
    res.render("feedback.ejs"); // Render the feedback form
    
});
//feedback
app.post("/feedback_taken", async (req, res) => {
    const { username, email } = req.body;
    const connection = await connectDB();

    try {
        
        const qInsert = "INSERT INTO customers (username, email) VALUES (?, ?)";
        await connection.query(qInsert, [username, email]);

        await connection.end();
       res.render("thanku.ejs");
    } catch (err) {
        console.error("Error saving feedback:", err);
        res.send("Something went wrong while storing your feedback.");
    }
});

// Fetch all complaints
app.get("/user", async (req, res) => {
    const connection = await connectDB();
    const qSelect = "SELECT * FROM complaints";

    try {
        const [complaints] = await connection.query(qSelect);
        res.render("show.ejs", { complaints }); // <-- Pass complaints to EJS
    } catch (err) {
        console.error("Error fetching complaints:", err);
        res.send("Something went wrong with the database.");
    } finally {
        await connection.end();
    }
});
// Fetch a specific complaint for editing
app.get("/complaints/:id/edit", async (req, res) => {
    const { id } = req.params;
    const qSelect = "SELECT * FROM complaints WHERE id = ?";

    try {
        const connection = await connectDB();
        const [rows] = await connection.query(qSelect, [id]);
        await connection.end();

        if (rows.length === 0) {
            return res.send("Complaint not found.");
        }

        res.render("editComplaint.ejs", { complaint: rows[0] });
    } catch (err) {
        console.error("Error fetching complaint for edit:", err);
        res.send("Something went wrong with the database.");
    }
});

// Update complaint status (Uses PATCH)
app.patch("/complaints/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;  // Updating status only

    const connection = await connectDB();

    try {
        const qUpdate = "UPDATE complaints SET status = ? WHERE id = ?";
        await connection.query(qUpdate, [status, id]);
        await connection.end();

        res.redirect("/complaints");
    } catch (err) {
        console.error("Error updating complaint:", err);
        res.send("Something went wrong while updating the complaint.");
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
















// const express = require("express");
// const path = require("path");
// const mysql = require("mysql2/promise");
// const methodOverride = require("method-override");

// const app = express();
// const port = 8080;

// app.use(methodOverride("_method")); 
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/views"));

// async function connectDB() {
//     return mysql.createConnection({
//         host: "localhost",
//         user: "root",
//         database: "tony",
//         password: "tonyprerna",
//     });
// }

// // Home route
// app.get("/", (req, res) => {
//     res.send("Welcome to the Home Page!");
// });

// // Insert new user (Uses POST)
// app.post("/complain", async (req, res) => {
//     const { username, email, password } = req.body;
//     const connection = await connectDB();

//     try {
//         const q = "INSERT INTO complaints (username, email, password) VALUES (?, ?, ?)";
//         await connection.query(q, [username, email, password]);
        
//         res.redirect("/user"); 
//     } catch (err) {
//         console.error("Error inserting user:", err);
//         res.send("Something went wrong while inserting data.");
//     } finally {
//         await connection.end();
//     }
// });

// // Fetch all users
// app.get("/user", async (req, res) => {
//     const connection = await connectDB();
//     const q = "SELECT * FROM tab";

//     try {
//         const [users] = await connection.query(q);
//         res.render("show.ejs", { users });
//     } catch (err) {
//         console.error("Error fetching users:", err);
//         res.send("Something went wrong with the database.");
//     } finally {
//         await connection.end();
//     }
// });
// app.get("/complain",async(req,res)=>{
//     res.render("complain.ejs");
// })

// // Fetch a specific user for editing
// app.get("/user/:id/edit", async (req, res) => {
//     const { id } = req.params;
//     const q = "SELECT * FROM complaints WHERE id = ?";

//     try {
//         const connection = await connectDB();
//         const [rows] = await connection.query(q, [id]);
//         await connection.end();

//         if (rows.length === 0) {
//             return res.send("User not found.");
//         }

//         res.render("edit.ejs", { user: rows[0] });
//     } catch (err) {
//         console.error("Error fetching user for edit:", err);
//         res.send("Something went wrong with the database.");
//     }
// });
// app.post("/user", async (req, res) => {
//     const { id, username, email, password } = req.body;
//     const connection = await connectDB();

//     try {
//         // Directly insert data without password verification
//         const qInsert = "INSERT INTO tab (id, username, email, password) VALUES (?, ?, ?, ?)";
//         await connection.query(qInsert, [id, username, email, password]);

//         await connection.end();
//         res.redirect("/user"); // Redirect after successful insertion
//     } catch (err) {
//         console.error("Error inserting user:", err);
//         res.send("Something went wrong while inserting data.");
//     }
// });
// // Update user details (Uses PATCH)
// app.patch("/user/:id", async (req, res) => {
//     const { id } = req.params;
//     const { username: newUsername, password: formPassword } = req.body;

//     const connection = await connectDB();

//     try {
//         // Fetch existing user password
//         const qSelect = "SELECT password FROM tab WHERE id = ?";
//         const [rows] = await connection.query(qSelect, [id]);

//         if (rows.length === 0) {
//             await connection.end();
//             return res.send("User not found.");
//         }

//         const dbPassword = rows[0].password;

//         // Compare passwords directly (not secure)
//         if (formPassword !== dbPassword) {
//             await connection.end();
//             return res.send("Wrong password.");
//         }

//         // Update user details in DB
//         const qUpdate = "UPDATE tab SET username = ? WHERE id = ?";
//         await connection.query(qUpdate, [newUsername, id]);
//         await connection.end();

//         res.redirect("/user");
//     } catch (err) {
//         console.error("Error updating user:", err);
//         res.send("Something went wrong while updating the user.");
//     }
// });

// // Start server
// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });








// const express = require("express");
// const path = require("path");
// const mysql = require("mysql2/promise");
// const { faker } = require("@faker-js/faker");
// const methodOverride = require("method-override");
// const e = require("express");

// const app = express();
// const port = 8080;

// app.use(methodOverride("_method")); // Standard naming for method override
// app.use(express.urlencoded({ extended: true })); // Enables parsing of form data

// // Function to establish a database connection
// async function connectDB() {
//     return mysql.createConnection({
//         host: "localhost",
//         user: "root",
//         database: "tony",
//         password: "tonyprerna",
//     });
// }

// // Serve static files
// app.use(express.static(path.join(__dirname, "public")));

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/views"));

// // Home route
// app.get("/", (req, res) => {
//     res.send("Welcome to the Home Page!");
// });

// // // Feedback route
// // app.get("/feedback", (req, res) => {
// //     res.send("Feedback Page");
// // });

// //complain
// app.get("/complain",async (req,res)=>{
//     const connection = await connectDB();
//     const q="insert into tab(id,username,email,password)values ?";

//     try {
//         const [users] = await connection.query(q);
//         res.render("show.ejs", { users });
//     } catch (err) {
//         console.error("Error fetching users:", err);
//         res.send("Something went wrong with the database.");
//     } finally {
//         await connection.end();
//     }


//     res.render("complain.ejs");
    
// })

 
// // Fetch all users
// app.get("/user", async (req, res) => {
//     const connection = await connectDB();
//     const q = "SELECT * FROM tab";

//     try {
//         const [users] = await connection.query(q);
//         res.render("show.ejs", { users });
//     } catch (err) {
//         console.error("Error fetching users:", err);
//         res.send("Something went wrong with the database.");
//     } finally {
//         await connection.end();
//     }
// });

// // Fetch a specific user for editing
// app.get("/user/:id/edit", async (req, res) => {
//     const { id } = req.params;
//     const q = "SELECT * FROM tab WHERE id = ?";

//     try {
//         const connection = await connectDB();
//         const [rows] = await connection.query(q, [id]);
//         await connection.end();

//         if (rows.length === 0) {
//             return res.send("User not found.");
//         }

//         res.render("edit.ejs", { user: rows[0] });
//     } catch (err) {
//         console.error("Error fetching user for edit:", err);
//         res.send("Something went wrong with the database.");
//     }
// });

// // Update user details
// app.patch("/user/:id", async (req, res) => {
//     const { id } = req.params;
//     const { username: newusername, password: formpassword } = req.body;

//     const connection = await connectDB();

//     try {
//         // Fetch existing user password
//         const qSelect = "SELECT password FROM tab WHERE id = ?";
//         const [rows] = await connection.query(qSelect, [id]);

//         if (rows.length === 0) {
//             await connection.end();
//             return res.send("User not found.");
//         }

//         const dbPassword = rows[0].password;

//         // Compare passwords before updating
//         if (formpassword !== dbPassword) {
//             await connection.end();
//             return res.send("Wrong password.");
//         }
//         else{
            
        

//         // Update user details in DB
//         const qUpdate = "UPDATE tab SET username = ?, password = ? WHERE id = ?";
//         await connection.query(qUpdate, [newusername, formpassword, id]);
//         await connection.end();
//         }

//         res.redirect("/user")
//     } catch (err) {
//         console.error("Error updating user:", err);
//         res.send("Something went wrong while updating the user.");
//     }
// });

// app.patch("/user/:id", async (req, res) => {
//     const { id } = req.params;
//     const { username:newusername, password:formpassword } = req.body;
//     const q = "UPDATE tab SET username = ?, password = ? WHERE id = ?";

//     try {
//         const connection = await connectDB();
//         await connection.query(q, [username, password, id]);
        
//         await connection.end();

//         if(formpassword!=user.password){
//             res.send("wrong password");
//         }else{
//             res.send("good")
//         }

//         res.send("<h1>User updated successfully!</h1>");
//     } catch (err) {
//         console.error("Error updating user:", err);
//         res.send("Something went wrong while updating the user.");
//     }
// });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});




// const express = require("express");
// const path = require("path");
// const mysql = require("mysql2/promise");
// const { faker } = require("@faker-js/faker");
// const methodOverride=require("method-override");


// const app = express();
// const port = 8080;

// app.use(methodOverride("_method"));

// app.use(express.urlencoded({extended:true}))

// // Function to establish a database connection
// async function connectDB() {
//     return await mysql.createConnection({
//         host: "localhost",
//         user: "root",
//         database: "tony",
//         password: "tonyprerna",
//     });



// }

// app.get("/feedback",(req,res)=>{
//     res.send("feedback")
// })

// // Faker Data Generation
// let create = () => {
//     return [
//         faker.string.uuid(),
//         faker.internet.username(),
//         faker.internet.email(),
//         faker.internet.password(),
//     ];
// };

// // Serve static files
// app.use(express.static(path.join(__dirname, "public")));

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/views"));

// // Home route
// app.get("/", (req, res) => {
//     res.send("home");
// });



// // Fetch all users
// app.get("/user", async (req, res) => {
//     const connection = await connectDB();
//     const q = "SELECT * FROM tab";

//     try {
//         const [users] = await connection.query(q);
//         res.render("show.ejs", { users });
//     } catch (err) {
//         console.error(err);
//         res.send("Something went wrong with the database.");
//     } finally {
//         connection.end(); // Close the connection
//     }
// });

// // Fetch a specific user for editing
// app.get("/user/:id/edit", async (req, res) => {
//     const { id } = req.params;
//     const q = "SELECT * FROM tab WHERE id = ?";

//     try {
//         const connection = await connectDB(); // Establish a new connection
//         const [rows] = await connection.query(q, [id]); // Query using parameterized values
//         connection.end(); // Close the connection

//         if (rows.length === 0) {
//             return res.send("User not found.");
//         }

//         res.render("edit.ejs", { user: rows[0] });
//         console.log(rows[0]) // Pass the user data to the view
//     } catch (err) {
//         console.error(err);
//         res.send("Something went wrong with the database.");
//     }
// });



// //update 
// app.patch("/user/:id",(req,res)=>{
//     let q="<h1>hello</h1>"
//     res.send(q);

// })

// app.listen(port, () => {
//     console.log(`Listening on port ${port}`);
// });




// const express = require("express");
// const path = require("path");
// const mysql = require("mysql2/promise");
// const { faker } = require("@faker-js/faker");

// const app = express();
// const port = 8080;

// async function connectDB() {
//     return await mysql.createConnection({
//         host: "localhost",
//         user: "root",
//         database: "tony",
//         password: "tonyprerna",
//     });
// }

// let create = () => {
//     return [
//         faker.string.uuid(),
//         faker.internet.username(), // before version 9.1.0, use userName()
//         faker.internet.email(),
//         faker.internet.password(),
//     ];
// };

// app.use(express.static(path.join(__dirname, "public")));

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/views"));

// app.get("/", (req, res) => {
//     res.send("home");
// });

// app.get("/user", async (req, res) => {
//     const connection = await connectDB();
//     const q = "SELECT * FROM tab";

//     try {
//         const [users] = await connection.query(q); // Use 'connection', not 'Connection'
//         res.render("show.ejs", { users });
//     } catch (err) {
//         console.error(err);
//         res.send("Something went wrong with the database.");
//     }
// });

// app.get("/user/:id/edit", async (req, res) => {
//     let { id } = req.params;
//     let q = "SELECT * FROM tab WHERE id = ?";  // Use parameterized query to prevent SQL injection

//     try {
//         const connection = await connectDB(); // Establish a new connection
//         const [rows] = await connection.query(q, [id]); // Use 'connection.query' with parameters
//        let user=rows;
       
//         if (err) throw err;
//             res.render("edit.ejs", { user}); // Pass the user data to the view
        
           
        
//     } catch (err) {
//         console.error(err);
//         res.send("Something went wrong with the database.");
//     }
// });

// app.listen(port, () => {
//     console.log(`Listening on port ${port}`);
// });





// const express = require("express");
// const path = require("path");
// const mysql = require("mysql2/promise");
// const { faker } = require("@faker-js/faker");

// const app = express();
// const port = 8080;

// async function connectDB() {
//     return await mysql.createConnection({
//         host: "localhost",
//         user: "root",
//         database: "tony",
//         password: "tonyprerna",
//     });
// }


// let create=()=> {
//     return [
//      faker.string.uuid(),
//       faker.internet.username(), // before version 9.1.0, use userName()
//    faker.internet.email(),
     
//       faker.internet.password(),
//     ];
      
//   }
// app.use(express.static(path.join(__dirname, "public")));

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/views"));



// app.get("/",(req,res)=>{
//     res.send("home")
// })

// app.get("/user", async (req, res) => {
//     const connection = await connectDB(); // Ensure the connection is established
//     const q = "SELECT * FROM tab";

//     try {
//         const [users] = await connection.query(q); // Use 'connection', not 'Connection'
//         res.render("show.ejs", { users });
//     } catch (err) {
//         console.error(err);
//         res.send("Something went wrong with the database.");
//     }
// });




// app.get("/user/:id/edit",(req,res)=>{
//     let {id}=req.params;
//     let q=`select * from tab where id='${id}'`;

//     try {
//         const {k} = connection.query(q); // Use 'connection', not 'Connection'
//        res.send(k[0]);
//     } catch (err) {
//         console.error(err);
//         res.send("Something went wrong with the database.");
//     }
//     console.log(id);
//     res.render("edit.ejs");

// })

// app.listen(port, () => {
//     console.log(`Listening on port ${port}`);
// });










// const express = require("express");
// const path = require("path");
// const mysql = require("mysql2/promise");
// const { faker } = require("@faker-js/faker");



// const app = express();
// const port = 8080;

// const connection =  mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     database: 'tony',
//     password:'tonyprerna'
//   });


// app.use(express.static(path.join(__dirname, "public")));

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/views"));

// app.get("/user", (req, res) => {
//        let q = "SELECT * FROM tab";

//     try {
//         Connection.query(q,(err,user)=>{
//             if(err) throw err;
//             // res.render("show.ejs")
//             res.send("done");
//         })
        
//     } catch (err) {
//         console.error(err);
//         res.send("Something went wrong with the database.");
//     }
// });

// app.listen(port, () => {
//     console.log(`Listening on port ${port}`);
// });



















// const { faker } = require('@faker-js/faker');


// const express=require("express");
// const app=express();
// const path= require("path");

// import mysql from 'mysql2/promise';

// // Create the connection to database
// const connection = await mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   database: 'tony',
//   password:"tonyprerna"
// });

// const port=8080;

// let create=()=> {
//     return [
//        faker.string.uuid(),
//      faker.internet.username(), // before version 9.1.0, use userName()
//     faker.internet.email(),
       
//        faker.internet.password(),
      
//     ];
//   }

// // app.use(express.static("public"));  //serve all the file
// app.use(express.static(path.join(__dirname,"public")));  

// app.set("view engine","ejs");
// app.set("views", path.join(__dirname,"/views"));  //can be run outside the dir

// app.get("./user",(req,res)=>{
//     let q=`select * from tab`;
//     try{
//         connection.query(q,(err,user)=>{
//             if(err) throw err;
//             res.render("showusers");
//         });
//     }

//     catch(err){
//         console.log(err);
//         res.send("some wrong in DB ");
//     }
// })

// app.listen("8080",()=>{
//     console.log("listening on port 8080}");
// }) 

