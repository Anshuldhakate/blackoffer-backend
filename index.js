const express= require("express")
const connection= require("./data")
const fs = require("fs");
const mongoose = require("mongoose");
const cors = require("cors");

const app= express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res)=>{
    res.send("Welcome")
})

app.get("/api/data", async (req, res) => {
    try {
        const db = mongoose.connection;
        const collection = db.collection("blackcoffer");
        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.get("/api/data/filter", async (req, res) => {
    try {
        const db = mongoose.connection;
        const collection = db.collection("blackcoffer");

        // Extract query parameters from the request
        const { endYear, topic, sector, region, pestle, source, swot, country, city } = req.query;

        // Construct the filter object based on the provided query parameters
        const filter = {};

        if (endYear) filter.end_year = endYear;
        if (topic) filter.topic = topic;
        if (sector) filter.sector = sector;
        if (region) filter.region = region;
        if (pestle) filter.pestle = pestle;
        if (source) filter.source = source;
        if (swot) filter.swot = swot;
        if (country) filter.country = country;
        if (city) filter.city = city;

        // Fetch filtered data from MongoDB collection
        const filteredData = await collection.find(filter).toArray();
        res.json(filteredData);
    } catch (error) {
        console.error("Error fetching filtered data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



const jsonData = JSON.parse(fs.readFileSync("db.json", "utf8"));

(async () => {
    try {
        await connection;
        const db = mongoose.connection;
        const collection = db.collection("blackcoffer");
        const result = await collection.insertMany(jsonData);
        console.log(`${result.insertedCount} documents inserted`);
    } catch (error) {
        console.error("Error inserting documents:", error);
    }

    app.listen(3000, () => {
        console.log("connected to DB");
        console.log("server is running on port 3000");
    });
})();