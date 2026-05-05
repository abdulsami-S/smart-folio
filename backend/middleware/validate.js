const { body, param, validationResult } = require('express-validator');

// ── Helper: run validation and return 400 if errors ──────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ── Auth ──────────────────────────────────────────────────────
const loginRules = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ max: 50 }).withMessage('Username too long')
    .escape(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters'),
  validate,
];

// ── Projects ─────────────────────────────────────────────────
const createProjectRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title must be under 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description must be under 500 characters'),
  body('techStack')
    .optional()
    .isArray({ max: 20 }).withMessage('techStack must be an array with max 20 items'),
  body('techStack.*')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Each tech must be under 50 characters'),
  body('githubUrl')
    .optional({ values: 'falsy' })
    .trim()
    .isURL().withMessage('githubUrl must be a valid URL')
    .matches(/^https:\/\/github\.com\//).withMessage('githubUrl must start with https://github.com/'),
  body('liveUrl')
    .optional({ values: 'falsy' })
    .trim()
    .isURL().withMessage('liveUrl must be a valid URL'),
  body('imageUrl')
    .optional({ values: 'falsy' })
    .trim()
    .isURL().withMessage('imageUrl must be a valid URL'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Category must be under 100 characters'),
  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  body('visible')
    .optional()
    .isBoolean().withMessage('Visible must be a boolean'),
  validate,
];

const updateProjectRules = [
  param('id').isMongoId().withMessage('Invalid project ID'),
  ...createProjectRules.slice(0, -1), // all field rules without the final validate
  // Make title and description optional for updates
  body('title').optional(),
  body('description').optional(),
  validate,
];

// ── Skills ───────────────────────────────────────────────────
const createSkillRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Skill name is required')
    .isLength({ max: 50 }).withMessage('Name must be under 50 characters'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(['Languages', 'Frontend', 'Backend', 'Data & ML', 'Databases', 'Tools'])
    .withMessage('Invalid category'),
  body('proficiency')
    .notEmpty().withMessage('Proficiency is required')
    .isInt({ min: 1, max: 100 }).withMessage('Proficiency must be 1–100'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Icon must be under 100 characters'),
  body('visible')
    .optional()
    .isBoolean().withMessage('Visible must be a boolean'),
  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  validate,
];

const updateSkillRules = [
  param('id').isMongoId().withMessage('Invalid skill ID'),
  body('name').optional().trim().isLength({ max: 50 }),
  body('category').optional().trim()
    .isIn(['Languages', 'Frontend', 'Backend', 'Data & ML', 'Databases', 'Tools']),
  body('proficiency').optional().isInt({ min: 1, max: 100 }),
  body('icon').optional().trim().isLength({ max: 100 }),
  body('visible').optional().isBoolean(),
  body('order').optional().isInt({ min: 0 }),
  validate,
];

// ── Timeline ─────────────────────────────────────────────────
const createTimelineRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be under 200 characters'),
  body('institution')
    .trim()
    .notEmpty().withMessage('Institution is required')
    .isLength({ max: 200 }).withMessage('Institution must be under 200 characters'),
  body('duration')
    .trim()
    .notEmpty().withMessage('Duration is required')
    .isLength({ max: 100 }).withMessage('Duration must be under 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Description must be under 300 characters'),
  body('type')
    .trim()
    .notEmpty().withMessage('Type is required')
    .isIn(['Education', 'Work', 'Achievement']).withMessage('Type must be Education, Work, or Achievement'),
  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  validate,
];

const updateTimelineRules = [
  param('id').isMongoId().withMessage('Invalid timeline ID'),
  body('title').optional().trim().isLength({ max: 200 }),
  body('institution').optional().trim().isLength({ max: 200 }),
  body('duration').optional().trim().isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 300 }),
  body('type').optional().trim().isIn(['Education', 'Work', 'Achievement']),
  body('order').optional().isInt({ min: 0 }),
  validate,
];

// ── Portfolio ────────────────────────────────────────────────
const updatePortfolioRules = [
  body('name').optional().trim().isLength({ max: 100 }),
  body('tagline').optional().trim().isLength({ max: 300 }),
  body('bio').optional().trim().isLength({ max: 5000 }),
  body('email').optional({ values: 'falsy' }).trim().isEmail().withMessage('Must be a valid email'),
  body('phone').optional().trim().isLength({ max: 20 }),
  body('resumeUrl').optional({ values: 'falsy' }).trim().isURL().withMessage('Must be a valid URL'),
  body('heroTitles').optional().isArray({ max: 10 }),
  body('heroTitles.*').optional().trim().isLength({ max: 200 }),
  body('socials').optional().isObject(),
  body('socials.github').optional({ values: 'falsy' }).trim(),
  body('socials.linkedin').optional({ values: 'falsy' }).trim(),
  body('socials.twitter').optional({ values: 'falsy' }).trim(),
  body('socials.email').optional({ values: 'falsy' }).trim().isEmail(),
  validate,
];

// ── Reorder (shared for projects & timeline) ─────────────────
const reorderRules = [
  body()
    .isArray({ min: 1 }).withMessage('Body must be a non-empty array'),
  body('*.id')
    .notEmpty().withMessage('Each item must have an id')
    .isMongoId().withMessage('Each id must be a valid Mongo ID'),
  body('*.order')
    .notEmpty().withMessage('Each item must have an order')
    .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  validate,
];

// ── Param ID validator (for DELETE, PATCH :id) ───────────────
const idParamRules = [
  param('id').isMongoId().withMessage('Invalid ID'),
  validate,
];

module.exports = {
  loginRules,
  createProjectRules,
  updateProjectRules,
  createSkillRules,
  updateSkillRules,
  createTimelineRules,
  updateTimelineRules,
  updatePortfolioRules,
  reorderRules,
  idParamRules,
};
