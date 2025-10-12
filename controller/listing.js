const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// 🟢 Show all listings
module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index", { alllistings });
};

// 🟢 Render new listing form
module.exports.RenderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// 🟢 Show a single listing
module.exports.showListing = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// 🟢 Create a new listing
module.exports.createListing = async (req, res) => {
  try {
    const { title, description, price, location, country } = req.body;

    // 1️⃣ Geocode location
    const geoData = await geocodingClient.forwardGeocode({
      query: location,
      limit: 1
    }).send();

    // 2️⃣ Image handling
    let imageData = {};
    if (req.file) {
      imageData = {
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`
      };
    } else if (req.body.image) {
      imageData = {
        filename: "url-image",
        url: req.body.image
      };
    } else {
      imageData = {
        filename: "placeholder",
        url: "/images/placeholder.jpg"
      };
    }

    // 3️⃣ Create listing
    const newListing = new Listing({
      title,
      description,
      image: imageData,
      price,
      location,
      country,
      owner: req.user._id,
      geometry: geoData.body.features[0].geometry
    });

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect(`/listings/${newListing._id}`);

  } catch (err) {
    console.error("Error while creating listing:", err);
    req.flash("error", "Something went wrong. Try again.");
    res.redirect("/listings");
  }
};

// 🟢 Render edit form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", {
    listing,
    mapToken: process.env.MAPBOX_TOKEN
  });
};
module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, location, country, imageUrl } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    const oldLocation = listing.location;
    const locationChanged = location && location.trim() !== "" && location !== oldLocation;

    // Update basic fields
    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.country = country;

    // Update image
    if (req.file) {
      listing.image = { filename: req.file.filename, url: `/uploads/${req.file.filename}` };
    } else if (imageUrl && imageUrl.trim() !== "") {
      listing.image = { filename: "url-image", url: imageUrl };
    }

    // ✅ Update location and geometry only if location changed
    if (locationChanged) {
      listing.location = location; // update location **after detecting change**
      const geoData = await geocodingClient.forwardGeocode({ query: location, limit: 1 }).send();
      if (geoData.body.features.length > 0) {
        listing.geometry = geoData.body.features[0].geometry;
      }
    }

    await listing.save();
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error updating listing:", err);
    req.flash("error", "Failed to update listing. Please try again.");
    res.redirect(`/listings/${id}/edit`);
  }
};



// 🟢 Delete listing
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
