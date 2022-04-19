const router = require("express").Router();

const {
  createThought,
  getAllThoughts,
  getThoughtById,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaciton,
} = require("../../controllers/thought-controller");

router.route("/").get(getAllThoughts);

router
  .route("/:id")
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

router.route("/:userId").post(createThought);

router.route("/:thoughtId/reactions").post(addReaction);

router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaciton);

module.exports = router;
