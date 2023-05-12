const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { participantService } = require("../services");

const createParticipant = catchAsync(async (req, res) => {
  const participant = await participantService.createParticipant(req.body);
  return res.status(httpStatus.CREATED).jsend.success(participant);
});

const updateParticipant = catchAsync(async (req, res) => {
  if (req.body.email != req.params.email) {
    return res.status(httpStatus.BAD_REQUEST).jsend.error({
      message: "Email in body does not match email in params",
    });
  }
  const participantExists = await participantService.getParticipant(
    req.params.email
  );
  if (!participantExists) {
    return res.status(httpStatus.BAD_REQUEST).jsend.error({
      message: "Participant does not exist",
    });
  }
  const participant = await participantService.updateParticipant(req.body);
  return res.status(httpStatus.OK).send(participant);
});

const deleteParticipant = catchAsync(async (req, res) => {
  const participant = await participantService.deleteParticipant(
    req.params.email
  );
  return res.status(httpStatus.OK).jsend.success(participant);
});

const getParticipants = catchAsync(async (req, res) => {
  const participants = await participantService.getParticipants();
  return res.status(httpStatus.OK).jsend.success(participants);
});

const getParticipantsWithDetails = catchAsync(async (req, res) => {
  const participants = await participantService.getParticipantsWithDetails();
  return res.status(httpStatus.OK).jsend.success(participants);
});

const getDeletedParticipants = catchAsync(async (req, res) => {
  const participants = await participantService.getDeletedParticipants();
  return res.status(httpStatus.OK).jsend.success(participants);
});

const getParticipantDetails = catchAsync(async (req, res) => {
  const participant = await participantService.getParticipantWithDetails(
    req.params.email,
    null
  );
  return res.status(httpStatus.OK).jsend.success(participant);
});

const getParticipantWork = catchAsync(async (req, res) => {
  const participant = await participantService.getParticipantWithDetails(
    req.params.email,
    "work"
  );
  return res.status(httpStatus.OK).jsend.success(participant);
});
const getParticipantHome = catchAsync(async (req, res) => {
  const participant = await participantService.getParticipantWithDetails(
    req.params.email,
    "home"
  );
  return res.status(httpStatus.OK).jsend.success(participant);
});

module.exports = {
  createParticipant,
  updateParticipant,
  deleteParticipant,
  getParticipants,
  getParticipantsWithDetails,
  getDeletedParticipants,
  getParticipantDetails,
  getParticipantWork,
  getParticipantHome,
};
