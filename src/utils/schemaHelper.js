function forCreateOrUpdate(baseSchema, fields, mode) {
  return baseSchema.fork(fields, (s) =>
    mode === 'update' ? s.optional() : s.required()
  );
}

module.exports = { forCreateOrUpdate };
