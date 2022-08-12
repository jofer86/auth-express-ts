import { asyncHandler } from '../../middleware/async.middleware';
import ErrorResponse from '../../utils/ErrorResponse';
import { User } from '../../models/User/User';

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: 'Register' });
});
