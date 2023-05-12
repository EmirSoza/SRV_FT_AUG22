const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { participantValidation } = require("../validations");
const { participantController } = require("../controllers");

router.get("/", participantController.getParticipants);

router.get("/details", participantController.getParticipantsWithDetails);

router.get("/deleted", participantController.getDeletedParticipants);

router.post(
  "/add",
  validate(participantValidation.createParticipant),
  participantController.createParticipant
);

router.put(
  "/:email",
  validate(participantValidation.createParticipant),
  participantController.updateParticipant
);

router.delete("/:email", participantController.deleteParticipant);

router.get("/details/:email", participantController.getParticipantDetails);

router.get("/work/:email", participantController.getParticipantWork);

router.get("/home/:email", participantController.getParticipantHome);

module.exports = router;
