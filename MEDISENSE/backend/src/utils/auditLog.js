import SystemLog from '../models/SystemLog.js';

/**
 * Fire-and-forget audit logger for admin actions. Failures here should
 * never block the primary request, so errors are swallowed (and logged
 * to the console) rather than propagated.
 */
export const logAdminAction = async ({ actor, action, targetType, targetId, metadata, ip }) => {
  try {
    await SystemLog.create({ actor, action, targetType, targetId, metadata, ip });
  } catch (err) {
    console.error('[SystemLog] Failed to write audit log:', err.message);
  }
};
