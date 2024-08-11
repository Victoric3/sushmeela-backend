const asyncErrorWrapper = require("express-async-handler");
const Story = require("../Models/story");
const deleteImageFile = require("../Helpers/Libraries/deleteImageFile");
const {
  searchHelper,
  paginateHelper,
} = require("../Helpers/query/queryHelpers");
const Comment = require("../Models/comment");

const addStory = async (req, res, next) => {
  const { title, content } = req.body;
  // Calculate readtime based on word count
  var wordCount = content?.trim().split(/\s+/).length;
  let readtime = Math.floor(wordCount / 200);
  if (req.user.role !== "admin") {
    return res.status(401).json({
      status: "unAuthorized",
      errorMessage: "you need to have admin access to do this",
    });
  }
  try {
    // Access req.fileLink, which was attached by the middleware
    const newStory = await Story.create({
      title,
      content,
      author: req.user._id,
      image: req.fileLink || "https://i.ibb.co/Jx8zhtr/story.jpg",
      readtime    
    });

    // Send a success response with the newStory data
    return res.status(200).json({
      success: true,
      message: "Add story successfully",
      data: newStory,
    });
  } catch (error) {
    console.log(error)
    // Handle errors
    next(error);
  }
};

const addImage = asyncErrorWrapper(async (req, res, next) => {
  try {
    if (!req.fileLink) {
      return res.status(400).json({
        success: false,
        errorMessage: "file could not be processed",
      });
    }
    res.status(200).json({
      success: true,
      message: "file uploaded successfully",
      url: req.fileLink,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errorMessage: error || "internal server error",
    });
  }
});

const getAllStories = asyncErrorWrapper(async (req, res, next) => {
  let query = Story.find();

  query = searchHelper("title", query, req);

  const paginationResult = await paginateHelper(Story, query, req);

  query = paginationResult.query;

  query = query.sort("-likeCount -commentCount -createdAt");

  const stories = await query;

  return res.status(200).json({
    success: true,
    count: stories.length,
    data: stories,
    page: paginationResult.page,
    pages: paginationResult.pages,
  });
});

const detailStory = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;
  const { activeUser } = req.body;

  const story = await Story.findOne({
    slug: slug,
  }).populate("author likes");

  const storyLikeUserIds = story.likes.map((json) => json.id);
  const likeStatus = storyLikeUserIds.includes(activeUser?._id);
  const totalComments = await Comment.countDocuments({
    story: story._id,
  });
  story.commentCount = totalComments;
  story.save();
  return res.status(200).json({
    success: true,
    data: story,
    likeStatus: likeStatus,
  });
});

const likeStory = asyncErrorWrapper(async (req, res, next) => {
  const { activeUser } = req.body;
  const { slug } = req.params;

  const story = await Story.findOne({
    slug: slug,
  }).populate("author likes");

  const storyLikeUserIds = story.likes.map((json) => json._id.toString());

  if (!storyLikeUserIds.includes(activeUser._id)) {
    story.likes.push(activeUser);
    story.likeCount = story.likes.length;
    await story.save();
  } else {
    const index = storyLikeUserIds.indexOf(activeUser._id);
    story.likes.splice(index, 1);
    story.likeCount = story.likes.length;

    await story.save();
  }

  return res.status(200).json({
    success: true,
    data: story,
  });
});

const editStoryPage = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;

  const story = await Story.findOne({
    slug: slug,
  }).populate("author likes");

  return res.status(200).json({
    success: true,
    data: story,
  });
});

const editStory = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;
  const { title, content, image, previousImage } = req.body;

  const story = await Story.findOne({ slug: slug });

  story.title = title;
  story.content = content;
  story.image = req.fileLink;

  if (!req.fileLink) {
    // if the image is not sent
    story.image = image;
  } else {
    // if the image sent
    // old image locatıon delete
    deleteImageFile(req, previousImage);
  }

  await story.save();

  return res.status(200).json({
    success: true,
    data: story,
  });
});

const deleteStory = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;

  const story = await Story.findOne({ slug: slug });

  deleteImageFile(req, story.image);

  await story.remove();

  return res.status(200).json({
    success: true,
    message: "Story delete succesfully ",
  });
});

module.exports = {
  addStory,
  addImage,
  getAllStories,
  detailStory,
  likeStory,
  editStoryPage,
  editStory,
  deleteStory,
};
