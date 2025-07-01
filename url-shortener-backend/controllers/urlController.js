const Url = require('../models/Url');
const generateShortcode = require('../utils/generateShortcode');
const geoip = require('geoip-lite');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

const createShortUrl = async (req, res) => {
    try {
        console.log("📥 Incoming POST /shorturls request:");
        console.log("Request body:", req.body);

        const { url, validity, shortcode } = req.body;

        if (!url) {
            console.warn("❌ Missing original URL");
            return res.status(400).json({ error: 'Original URL is required.' });
        }

        let code = shortcode || generateShortcode();

        const exists = await Url.findOne({ shortCode: code });
        if (exists) {
            console.warn(`❌ Shortcode "${code}" already exists`);
            return res.status(400).json({ error: 'Shortcode already exists.' });
        }

        const minutes = validity || 30;
        const expiry = new Date(Date.now() + minutes * 60000);
        console.log(`🔗 Generated shortcode: ${code}`);
        console.log(`🕒 Expiry time set to: ${expiry.toISOString()}`);

        const newUrl = await Url.create({
            originalUrl: url,
            shortCode: code,
            expiresAt: expiry,
        });

        console.log("✅ Short URL created successfully");

        return res.status(201).json({
            shortUrl: `${BASE_URL}/${code}`,
            expiresAt: expiry.toISOString(),
        });
    } catch (err) {
        console.error("🔥 Error in createShortUrl:", err.message);
        return res.status(500).json({ error: 'Server error' });
    }
};

const redirectToLongUrl = async (req, res) => {
    try {
        const { shortcode } = req.params;
        console.log(`📥 Incoming GET /${shortcode}`);

        const urlData = await Url.findOne({ shortCode: shortcode });
        if (!urlData) {
            console.warn("❌ Shortcode not found");
            return res.status(404).json({ error: 'Shortcode not found' });
        }

        if (new Date() > urlData.expiresAt) {
            console.warn("❌ URL expired");
            return res.status(410).json({ error: 'Short URL has expired' });
        }

        const geo = geoip.lookup(req.ip);
        const location = geo ? `${geo.city}, ${geo.country}` : 'Unknown';

        urlData.clickCount += 1;
        urlData.clicks.push({
            timestamp: new Date(),
            referrer: req.get('Referrer') || 'Direct',
            location: location
        });

        await urlData.save();

        console.log("➡️ Redirecting to:", urlData.originalUrl);

        return res.redirect(urlData.originalUrl);
    } catch (err) {
        console.error("🔥 Error in redirectToLongUrl:", err.message);
        return res.status(500).json({ error: 'Server error' });
    }
};

const getUrlStats = async (req, res) => {
    try {
        const { shortcode } = req.params;
        console.log(`📥 Incoming GET /stats/${shortcode}`);

        const urlData = await Url.findOne({ shortCode: shortcode });
        if (!urlData) {
            console.warn("❌ Shortcode not found in stats");
            return res.status(404).json({ error: 'Shortcode not found' });
        }

        console.log("📊 Returning stats for shortcode:", shortcode);

        return res.status(200).json({
            originalUrl: urlData.originalUrl,
            shortCode: urlData.shortCode,
            createdAt: urlData.createdAt.toISOString(),
            expiresAt: urlData.expiresAt.toISOString(),
            clickCount: urlData.clickCount,
            clicks: urlData.clicks,
        });
    } catch (err) {
        console.error("🔥 Error in getUrlStats:", err.message);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createShortUrl,
    redirectToLongUrl,
    getUrlStats
};
