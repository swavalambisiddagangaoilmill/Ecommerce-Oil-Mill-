// Blocks requests that match active visitor restrictions.
import { asyncHandler } from "../utils/asyncHandler.js";
import { enforceRestriction } from "../services/restrictionService.js";

export const restrictionGuard = asyncHandler(async (req, _res, next) => {
  await enforceRestriction(req);
  next();
});
