const extractDeviceInfo = (req) => ({
  deviceId: req.headers['x-device-id'] || null,
  deviceName: req.headers['x-device-name'] || null,
  deviceType: req.headers['x-device-type'] || null,
  userAgent: req.headers['user-agent'] || null,
  ipAddress: req.ip || null,
});

module.exports = {
  extractDeviceInfo,
};
