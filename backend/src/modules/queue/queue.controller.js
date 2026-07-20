import catchAsync from '../../utils/catchAsync.js';
import queueService from './queue.service.js';

export const getQueueStats = catchAsync(async (req, res) => {
  // pg-boss provides getQueueStats or getQueue to fetch statistics
  const stats = await queueService.boss.getQueue('code-review');

  res.status(200).json({
    status: 'success',
    data: {
      queue: 'code-review',
      stats: stats
    }
  });
});
