const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const CyclicDB = require("@cyclic.sh/dynamodb");
let Particiapant = CyclicDB.collection("participants");
const moment = require("moment");

/**
 * Get participants
 * @returns {Promise<Particiapant>}
 */
const getParticipants = async () => {
  return await Particiapant.list();
};

/**
 * Get participant
 * @param {String} email
 * @returns {Promise<Particiapant>}
 */
const getParticipant = async (email) => {
  return await Particiapant.item(email).get();
};

/**
 * Get participants with details
 * @returns {Promise<Particiapant>}
 */
const getParticipantsWithDetails = async () => {
  const all = await Particiapant.list();
  let results = [];
  await Promise.all(
    all.results.map(async (participant) => {
      const user = await Particiapant.item(participant.key).get();
      if (user.props.active === false) return false;
      const workData = await Particiapant.item(participant.key)
        .fragment("work")
        .get();

      const homeData = await Particiapant.item(participant.key)
        .fragment("home")
        .get();
      const work = workData[0].props;
      const home = homeData[0].props;
      results.push({ user: user.props, work, home });
      return true;
    })
  );
  return results;
};

/**
 * Get deleted participants
 * @returns {Promise<Particiapant>}
 */
const getDeletedParticipants = async () => {
  let all = await Particiapant.list();
  let results = [];
  await Promise.all(
    all.results.map(async (participant) => {
      const user = await Particiapant.item(participant.key).get();
      if (user.props.active === true) return false;
      const workData = await Particiapant.item(participant.key)
        .fragment("work")
        .get();

      const homeData = await Particiapant.item(participant.key)
        .fragment("home")
        .get();

      const work = workData[0].props;
      const home = homeData[0].props;
      results.push({ user: user.props, work, home });
      return true;
    })
  );
  return results;
};

/**
 * Update participant
 * @param {Object} body
 * @returns {Promise<Particiapant>}
 */
const updateParticipant = async (body) => {
  const {
    email,
    firstName,
    lastName,
    active,
    dob,
    companyName,
    salary,
    currency,
    country,
    city,
  } = body;
  const formattedDOB = moment(dob).format("YYYY/MM/DD");
  // Update participant
  const participant = await Particiapant.item(email).set({
    firstName,
    lastName,
    active,
    dob: formattedDOB,
  });
  const work = await Particiapant.item(email).fragment("work").set({
    companyName,
    salary,
    currency,
  });
  const home = await Particiapant.item(email).fragment("home").set({
    country,
    city,
  });
  return {
    key: participant.key,
    participant: participant.props,
    work: work.props,
    home: home.props,
  };

};

/**
 * Create participant
 * @param {Object} body
 * @returns {Promise<Particiapant>}
 */
const createParticipant = async (body) => {
  const {
    email,
    firstName,
    lastName,
    active,
    dob,
    companyName,
    salary,
    currency,
    country,
    city,
  } = body;
  const formattedDOB = moment(dob).format("YYYY/MM/DD");
  const isEmailTaken = await Particiapant.item(email).get();
  if (isEmailTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const participant = await Particiapant.set(email, {
    firstName,
    lastName,
    active,
    dob: formattedDOB,
  });
  const work = await Particiapant.item(email).fragment("work").set({
    companyName,
    salary,
    currency,
  });
  const home = await Particiapant.item(email).fragment("home").set({
    country,
    city,
  });
  return { participant, work, home };
};

/**
 * Delete participant
 * @param {String} email
 * @returns {Promise<Boolean>}
 */
const deleteParticipant = async (email) => {
  const participant = await Particiapant.item(email).get();
  if (!participant) {
    throw new ApiError(httpStatus.NOT_FOUND, "Participant not found");
  }
  if (participant.props.active === false) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Participant already deleted");
  }
  await Particiapant.item(email).set({ active: false });
  return true;
};

/**
 * Get participant with details
 * @param {String} email
 * @param {String} fragment
 * @returns {Promise<Particiapant>}
 */

const getParticipantWithDetails = async (email, fragment) => {
  const participant = await Particiapant.item(email).get();
  if (!participant || (participant && participant.props.active === false)) {
    throw new ApiError(httpStatus.NOT_FOUND, "Participant not found");
  }
  if (!fragment) return { participant: participant.props };
  const details = await Particiapant.item(email).fragment(fragment).get();
  return { participant: participant.props, details: details[0].props };
};

module.exports = {
  getParticipants,
  getParticipantsWithDetails,
  getDeletedParticipants,
  createParticipant,
  updateParticipant,
  deleteParticipant,
  getParticipantWithDetails,
  getParticipant,
};
