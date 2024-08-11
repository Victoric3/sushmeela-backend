const express = require("express")

const { getAccessToRoute } = require("../Middlewares/Authorization/auth");
const {addStory,addImage ,getAllStories,detailStory,likeStory, editStory, deleteStory, editStoryPage } = require("../Controllers/story")
const { checkStoryExist, checkUserAndStoryExist } = require("../Middlewares/database/databaseErrorhandler");
const { handleImageUpload } = require("../Helpers/Libraries/handleUpload");

const router = express.Router();

router.post("/addstory" , [getAccessToRoute, handleImageUpload], addStory)
router.post("/addImage" , [getAccessToRoute, handleImageUpload], addImage)


router.post("/:slug", checkStoryExist, detailStory)

router.post("/:slug/like",[getAccessToRoute,checkStoryExist] ,likeStory)

router.get("/editStory/:slug",[getAccessToRoute,checkStoryExist,checkUserAndStoryExist] , editStoryPage)

router.put("/:slug/edit",[getAccessToRoute,checkStoryExist,checkUserAndStoryExist,handleImageUpload], editStory) //image

router.delete("/:slug/delete",[getAccessToRoute,checkStoryExist,checkUserAndStoryExist] ,deleteStory)

router.get("/getAllStories",getAllStories)


module.exports = router