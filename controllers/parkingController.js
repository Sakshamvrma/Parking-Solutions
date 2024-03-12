const AppError = require('../utils/appError');
const Parking = require(`./../models/parkingModel`);
const catchAsync = require(`../utils/catchAsync`);
const factory = require(`./factoryHandler`);

exports.createParking = factory.createOne(Parking);
exports.updateParking = factory.updateOne(Parking);
exports.getAllParkings = factory.getAll(Parking);
exports.getParking = factory.getOne(Parking, { path: `reviews` });
exports.deleteParking = factory.deleteOne(Parking);

exports.getParkingsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(`,`);
  const radius = unit === `mi` ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(
      new AppError(
        `Please provide latitude and longitude in the format lat,lng`,
        400
      )
    );
  }
  const parkings = await Parking.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: `success`,
    results: parkings.length,
    data: {
      data: parkings,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(`,`);
  const multiplier = unit === `mi` ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    next(
      new AppError(
        `Please provide latitude and longitude in the format lat,lng`,
        400
      )
    );
  }
  const distances = await Parking.aggregate([
    {
      $geoNear: {
        near: {
          type: `Point`,
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: `distance`,
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: `success`,
    data: {
      data: distances,
    },
  });
});
