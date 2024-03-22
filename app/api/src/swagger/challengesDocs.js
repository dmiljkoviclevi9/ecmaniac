/**
 * @swagger
 * tags:
 *   name: Challenges
 *   description: Challenge management
 * 
 * /challenge:
 *   post:
 *     summary: Create a new challenge.
 *     tags: [Challenges]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Challenge'
 *     responses:
 *       201:
 *         description: Challenge created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challenge'
 *   get:
 *     summary: Get all challenges with optional pagination and filtering.
 *     tags: [Challenges]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *         - in: query
 *           name: pageNum
 *           schema:
 *             type: integer
 *           description: Page number
 *         - in: query
 *           name: perPage
 *           schema:
 *             type: integer
 *           description: Number of challenges per page
 *         - in: query
 *           name: difficulty
 *           schema:
 *             type: string
 *           description: Filter challenges by difficulty
 *     responses:
 *       200:
 *         description: List of challenges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Challenge'
 * 
 * /challenge/{id}:
 *   patch:
 *     summary: Update a challenge partially.
 *     tags: [Challenges]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The challenge ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChallengeUpdate'
 *     responses:
 *       200:
 *         description: Challenge updated successfully
 *   put:
 *     summary: Update a challenge completely.
 *     tags: [Challenges]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The challenge ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChallengeUpdate'
 *     responses:
 *       200:
 *         description: Challenge updated successfully
 *   delete:
 *     summary: Delete a challenge.
 *     tags: [Challenges]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The challenge ID
 *     responses:
 *       200:
 *         description: Challenge deleted successfully
 *   get:
 *     summary: Get a specific challenge.
 *     tags: [Challenges]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The challenge ID
 *     responses:
 *       200:
 *         description: Specific challenge details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challenge'
 * 
 * components:
 *   schemas:
 *     TestCase:
 *       type: object
 *       required:
 *         - input
 *         - expectedOutput
 *       properties:
 *         input:
 *           type: array
 *           items:
 *             oneOf:                 # Indicates that items can be of any one of these types
 *               - type: string
 *               - type: number
 *               - type: boolean
 *               - type: object      # Assumes objects are allowed; adjust as needed
 *               - type: array
 *                 items:
 *                  oneOf:
 *                    - type: string
 *                    - type: number
 *                    - type: boolean
 *                    - type: object
 *           description: Input can be of multiple types including string, number, boolean, object, and array.
 *         expectedOutput:
 *           oneOf:                   # Indicates that expectedOutput can be of any one of these types
 *             - type: string
 *             - type: number
 *             - type: boolean
 *             - type: object        # Assumes objects are allowed; adjust as needed
 *             - type: array
 *               items:
 *                oneOf:
 *                  - type: string
 *                  - type: number
 *                  - type: boolean
 *                  - type: object
 *           description: Expected output can be of multiple types including string, number, boolean, object, and array.
 *     Challenge:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - difficulty
 *         - category
 *         - tests
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         difficulty:
 *           type: string
 *           enum: ['EASY', 'MEDIUM', 'HARD']
 *         category:
 *           type: string
 *           enum: ['FUNDAMENTALS', 'ARRAYS', 'OBJECTS', 'DATES', 'SETS', 'MAPS', 'REGEX', 'RECURSION', 'CLASSES', 'ERRORS']
 *         tests:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TestCase'
 *     ChallengeUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         difficulty:
 *           type: string
 *           enum: ['EASY', 'MEDIUM', 'HARD']
 *         category:
 *           type: string
 *           enum: ['FUNDAMENTALS', 'ARRAYS', 'OBJECTS', 'DATES', 'SETS', 'MAPS', 'REGEX', 'RECURSION', 'CLASSES', 'ERRORS']
 *         tests:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TestCase'
 */