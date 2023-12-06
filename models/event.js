import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventDateTime: {
    type: Date,
    required: true,
  },
  
  eventUrl: {
    type: String,
    required: true,
  },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
