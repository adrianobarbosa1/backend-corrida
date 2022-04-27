import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';
import { eventService } from '../services';

const createEvent = catchAsync(async (req, res) => {
  const event = await eventService.createEvent(req.body);
  res.status(httpStatus.CREATED).send(event);
});

export default {
  createEvent,
};
