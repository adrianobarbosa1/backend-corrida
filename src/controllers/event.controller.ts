import httpStatus from 'http-status';
import { Request, Response } from 'express';

import { catchAsync } from '../utils/catchAsync';
import { eventService } from '../services';
import pick from '../utils/pick';

const createEvent = catchAsync(async (req, res) => {
  const event = await eventService.createEvent(req.body);
  res.status(httpStatus.CREATED).send(event);
});

const showEvents = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await eventService.queryEvents(filter, options);
  res.json({
    events: result.results
  });
});

const showEvent = catchAsync(async (req, res) => {
  const event = await eventService.getEventById(req.params.eventId);
  res.status(httpStatus.CREATED).send(event);
});

const uploadFoto = catchAsync(async (req: Request, res: Response) => {
  const { foto } = await eventService.updateEventFoto(req.params.eventId, req.file);
  res.status(httpStatus.CREATED).send(foto);
});

export default {
  createEvent,
  showEvents,
  showEvent,
  uploadFoto,
};
