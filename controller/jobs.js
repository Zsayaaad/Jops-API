const { StatusCodes } = require('http-status-codes');
const {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require('../errors');
const Job = require('../models/Jobs');

const getAllJobs = async (req, res) => {
  // user property here is going to be on every request since in the app.js we placed our authMiddleware in front of all of our jobs routes.
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  // console.log(userId, jobId);

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  // console.log({ ...req.user }); // I have in it: { userId: '', name: '' }
  req.body.createdBy = req.user.userId; // Is used to access the user ID of the currently authenticated user.
  const job = await Job.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;
  // console.log(company, position);
  if (!company || !position) {
    throw new BadRequestError('Company and Position fields cannot be empty');
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createJob: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
