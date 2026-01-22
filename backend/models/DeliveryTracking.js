const mongoose = require('mongoose');

const deliveryTrackingSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true
    },
    currentLocation: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      },
      address: String
    },
    destinationLocation: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      },
      address: {
        type: String,
        required: true
      }
    },
    status: {
      type: String,
      enum: ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    distance: Number, // in kilometers
    deliveryPersonName: String,
    deliveryPersonPhone: String,
    vehicleNumber: String,
    trackingHistory: [{
      status: String,
      location: {
        latitude: Number,
        longitude: Number,
        address: String
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeliveryTracking', deliveryTrackingSchema);
