/**
 * File: src/routes/codingProfile.routes.js
 * Description: Routes for tracking and scraping coding challenge profiles (e.g., LeetCode).
 * Protected endpoints that allow users to add profiles and trigger scrapes.
 */

const router = require('express').Router();
const puppeteer = require('puppeteer');
const auth = require('../middleware/auth');
const CodingProfile = require('../models/CodingProfile.model');

// Protect all routes
router.use(auth);

// POST /api/scraping/profiles - Add a new coding profile to track
router.post('/profiles', async (req, res) => {
    try {
        const { platform, username } = req.body;

        const existingProfile = await CodingProfile.findOne({ user: req.userId, platform, username });
        if (existingProfile) {
            return res.status(400).json({ message: "You are already tracking this profile." });
        }

        const newProfile = await CodingProfile.create({ user: req.userId, platform, username });
        res.status(201).json(newProfile);
    } catch (error) {
        res.status(500).json({ message: "Error adding profile", error });
    }
});

// GET /api/scraping/profiles - Get all tracked profiles for a user
router.get('/profiles', async (req, res) => {
    try {
        const profiles = await CodingProfile.find({ user: req.userId });
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profiles", error });
    }
});


// GET /api/scraping/scrape/:profileId - Trigger a scrape for a specific profile
router.get('/scrape/:profileId', async (req, res) => {
    try {
        const profile = await CodingProfile.findOne({ _id: req.params.profileId, user: req.userId });
        if (!profile) return res.status(404).json({ message: "Profile not found." });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        let scrapedData = {};

        if (profile.platform === 'LeetCode') {
            const url = `https://leetcode.com/${profile.username}/`;
            await page.goto(url, { waitUntil: 'networkidle2' });

            // Selectors for different data points on LeetCode
            const solvedSelector = '.text-label-1.dark\\:text-dark-label-1.flex.items-center.text-2xl';
            const easySelector = '.text-olive.dark\\:text-dark-olive';
            const mediumSelector = '.text-yellow.dark\\:text-dark-yellow';
            const hardSelector = '.text-red.dark\\:text-dark-red';
            const ratingSelector = '.text-label-1.dark\\:text-dark-label-1.mt-1.text-2xl.font-medium';

            await page.waitForSelector(solvedSelector);

            // Use page.$$eval to get multiple elements
            const counts = await page.$$eval('.space-x-4 .font-medium.text-label-2', els => els.map(el => el.textContent));
            const rating = await page.$eval(ratingSelector, el => el.textContent);
            
            scrapedData.problemsSolved = parseInt(counts[0], 10) || 0;
            scrapedData.easySolved = parseInt(counts[1], 10) || 0;
            scrapedData.mediumSolved = parseInt(counts[2], 10) || 0;
            scrapedData.hardSolved = parseInt(counts[3], 10) || 0;
            scrapedData.contestRating = Math.round(parseFloat(rating.replace(/,/g, ''))) || 0;
        }

        await browser.close();

        // Update profile with all new data
        Object.assign(profile, scrapedData, { lastScraped: new Date() });
        await profile.save();

        res.status(200).json(profile);

    } catch (error) {
        console.error("Scraping error:", error);
        res.status(500).json({ message: "Failed to scrape profile. The site's structure may have changed." });
    }
});

module.exports = router;