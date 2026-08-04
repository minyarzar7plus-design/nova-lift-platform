exports.list = (_, res) => res.json([{ id: 'sample-1', name: 'Pulse survey', reward: 4, demo: true }, { id: 'sample-2', name: 'Photo review', reward: 9, demo: true }]);
exports.complete = (_, res) => res.status(403).json({ error: 'Task completion is disabled in demo mode.' });
