express = require('express');
const router = express.Router();
const {
    createShortUrl,
    redirectToLongUrl,
    getUrlStats
} = require('../controllers/urlController');
router.post('/shorturls', createShortUrl);
router.get('/shorturls/:shortcode', getUrlStats);
router.get('/:shortcode', redirectToLongUrl);
module.exports = router;
