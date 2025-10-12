const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware.js"); 
const multer = require('multer');

// Multer setup
const upload = multer({ dest: 'uploads/' }); // Single storage setup

const listingController = require("../controller/listing.js");

// New listing form
router.get("/new", isLoggedIn, listingController.RenderNewForm);

// Listing index
router.get("/", listingController.index);

// Show listing
router.get("/:id", listingController.showListing);

// Edit listing form
router.get("/:id/edit", isLoggedIn, listingController.renderEditForm);

// ✅ Create listing
// Accept either file upload ('image') or image URL ('image')
router.post(
  "/", 
  isLoggedIn, 
  upload.single("image"), // Multer handles file
  wrapAsync(listingController.createListing)
);

// ✅ Update listing
// Accept either file upload ('image') or image URL ('image')
router.put(
  "/:id", 
  isLoggedIn, 
  upload.single("image"), // Multer handles file
  wrapAsync(listingController.updateListing)
);

// Delete listing
router.delete("/delete/:id", isLoggedIn, listingController.destroyListing);

module.exports = router;
