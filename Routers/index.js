const express = require("express")

const router = express.Router()

const authRoute = require("./auth")
const storyRoute = require("./story")
const userRoute = require("./user")
const scheduleCallRoute = require("./scheduleCall")
const commentRoute = require("./comment")
const sitemapRoute = require('./sitemapRouter')

router.use("/auth",authRoute)
router.use("/story",storyRoute)
router.use("/user",userRoute)
router.use("/call",scheduleCallRoute)
router.use("/comment",commentRoute)
router.use("/", sitemapRoute)


module.exports = router