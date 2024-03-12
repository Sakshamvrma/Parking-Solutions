const express = require(`express`);
const parkingController = require(`../controllers/parkingController`);
const authController = require(`../controllers/authController`);
const reviewRouter = require(`./reviewRouter`);

const router = express.Router();

router.use(`/:parkingId/reviews`, reviewRouter);
router
  .route(`/parkings-within/:distance/center/:latlng/unit/:unit`)
  .get(parkingController.getParkingsWithin);
router.route(`/distances/:latlng/unit/:unit`).get(parkingController.getDistances);
router
  .route(`/`)
  .get(parkingController.getAllParkings)
  .post(
    authController.protect,
    authController.restrictTo(`admin`, `owner`),
    parkingController.createParking
  );
router
  .route(`/:id`)
  .get(parkingController.getParking)
  .patch(
    authController.protect,
    authController.restrictTo(`admin`, `owner`),
    parkingController.updateParking
  )
  .delete(
    authController.protect,
    authController.restrictTo(`admin`, `owner`),
    parkingController.deleteParking
  );

module.exports = router;
