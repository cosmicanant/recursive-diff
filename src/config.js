const types = {
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  STRING: 'STRING',
  NULL: 'NULL',
  UNDEFINED: 'UNDEFINED',
  DATE: 'DATE',
  ARRAY: 'ARRAY',
  MAP: 'MAP',
  SET: 'SET',
  ITERABLE_OBJECT: 'ITERABLE_OBJECT',
  DEFAULT: 'OBJECT',
};

module.exports = {
  types,
  iterableTypes: [types.ITERABLE_OBJECT, types.MAP, types.ARRAY, types.SET],
  errors: {
    EMPTY_DIFF: 'No diff object is provided, Nothing to apply',
    INVALID_DIFF_FORMAT: 'Invalid diff format',
    INVALID_DIFF_OP: 'Unsupported operation provided into diff object',
  },
};
