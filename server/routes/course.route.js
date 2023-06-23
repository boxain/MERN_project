const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("course route running...");
  next();
});

// Create Course
router.post("/", async (req, res) => {
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  if (req.user.isStudent()) {
    return res
      .status(400)
      .send(
        "Only instructor can use this function, If you are instructor, please change account."
      );
  }

  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    let savedCourse = await newCourse.save();
    res.send({
      mesg: "Create course successfully !",
      course: savedCourse,
    });
  } catch (e) {
    res.status(500).send("Create course failed....");
  }
});

// Get All Course
router.get("/", async (req, res) => {
  try {
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// Get Course by instructor id
router.get("/instructor/:_instructor_id", async (req, res) => {
  let _instructor_id = req.params._instructor_id;
  try {
    let courseFound = await Course.find({ instructor: _instructor_id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    console.log(e);
    return res.send(e);
  }
});

// Get Course by student id
router.get("/student/:_student_id", async (req, res) => {
  let _student_id = req.params._student_id;
  try {
    let courseFound = await Course.find({ students: _student_id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

// Get Course by student id
router.get("/instructor2/", async (req, res) => {
  let _instuctor_id = req.params._instuctor_id;
  try {
    let courseFound = await Course.find({ instructor: _instuctor_id })
      .populate("instuctor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

// Get Course by title
router.get("/findByName/:name", async (req, res) => {
  let name = req.params.name;
  try {
    let courseFound = await Course.find({ title: name })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// Enroll Course by student id
router.get("/enroll/:_id", async (req, res) => {
  let _id = req.params._id;
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    courseFound.students.push(req.user._id)
    courseFound.save()
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// Get Course by id
router.get("/:_id", async (req, res) => {
  let _id = req.params._id;
  try {
    let courseFound = await Course.findOne({ _id })
      .populate("instructor", ["username", "email"])
      .exec();
    if (!courseFound)
      return res.status(400).send("This course'id is not exist....");
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// Update Course by id
router.patch("/:_id", async (req, res) => {
  // Only instructor can update.
  let _id = req.params._id;
  let { title, description, price } = req.body;

  try {
    let courseFound = await Course.findOne({ _id });
    if (!courseFound)
      return res.status(400).send("This course'id is not exist....");
    if (courseFound.instructor.equals(req.user._id)) {
      let { err } = courseValidation(req.body);
      if (err) return res.status(400).send(err.details[0].message);

      let updateCourse = await courseFound
        .updateOne(
          { title, description, price, instructor: req.user._id },
          { runValidators: false, new: true }
        )
        .populate("instructor", ["username", "email"])
        .exec();
      return res.send({
        mesg: "Update course successfully !",
        updateCourse,
      });
    }
    return res.status(403).send("Only instructor can updated course");
  } catch (e) {
    return res.status(500).send(e);
  }
});

// Delete Course by id
router.delete("/:_id", async (req, res) => {
  // Only instructor can delete.
  let _id = req.params._id;

  try {
    let courseFound = await Course.findOne({ _id });
    if (!courseFound)
      return res.status(400).send("This course'id is not exist....");
    if (courseFound.instructor.equals(req.user._id)) {
      let deleteCourse = Course.deleteOne({ _id }).exec();
      return res.send("Delete course successfully !");
    }
    return res.status(403).send("Only instructor can delete course");
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
