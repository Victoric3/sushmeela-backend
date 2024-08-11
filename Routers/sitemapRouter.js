const express = require("express");
const sitemap = require("sitemap");
const { db } = require("../Models/user");
const Story = require("../Models/story");

const router = express.Router();

// Static pages
const staticPages = [
  "/",
  "/resetpassword",
  "/forgotpassword",
  "/register",
  "/login",
  "/readList",
  "/change_Password",
  "/edit_profile",
  "/profile",
  "/addstory",
  "/resultTemp",
  "/terms-of-service",
  "/privacy-policy",
];

// Dynamic pages (replace with your dynamic page fetching logic)

router.get("/sitemap.xml", async (req, res) => {
  const smStream = new sitemap.SitemapStream({
    hostname: "https://kingsheart.com.ng",
  });

  const slugs = await Story.find({}, "slug");
  const slugList = slugs.map((story) => story.slug);

  // Add dynamic pages to the sitemap
  slugList.forEach((page) => {
    smStream.write({
      url: `/story/${page}`,
      changefreq: "daily",
      priority: 1.0,
    });
  });

  // Add static pages to the sitemap
  staticPages.forEach((page) => {
    smStream.write({ url: page, changefreq: "monthly", priority: 1.0 });
  });

  smStream.end();
  res.header("Content-Type", "application/xml");
  smStream.pipe(res);
});

module.exports = router;
