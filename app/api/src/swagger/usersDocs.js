/**
* @swagger
* components:
*  schemas:
*    user:
*      type: object
*      required:
*        - userName
*        - email
*        - password
*      properties:
*        userName:
*          type: string
*          description: The username of the user. Must be between 3 and 16 characters long.
*        email:
*          type: string
*          description: The email address of the user. Must be a valid email.
*        password:
*          type: string
*          description: The password of the user. Must be a strong password.
*        isVerified:
*          type: boolean
*          description: The status of the user.
*        role:
*          type: string
*          description: The role assigned to the user. Must be one of 'USER', 'ADMIN'.
*        tokens:
*          type: array
*          items:
*            type: object
*            properties:
*              token:
*                type: string
*          description: The authentication tokens associated with the user.
*  example:
*    userName: johndoe
*    email: johndoe@example.com
*    password: password
*    isVerified: FALSE
*    role: USER
*    tokens: [{token: 'token'}]
*/


/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user.
 *     tags: [user]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
 *           example:
 *             userName: "Jane Doe"
 *             email: "jane.doe@example.mail"
 *             password: "Password1?"
 *             isVerified: false
 *             role: "USER"
 *             tokens: 
 *               - token: "string"
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Invalid request body.
 *     operationId: create
 *
 *   get:
 *     summary: Get all users.
 *     tags: [user]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users.
 *       401:
 *         description: Unauthorized access.
 *     operationId: getAll
 */

/**
* @swagger
* /user/{id}:
*   patch:
*     summary: Update a user partially.
*     tags: [user]
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: ID of the user to update.
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/user'
*           examples:
*             name change:
*               value:
*                 name: "Jane Doe"
*             update e-mail:
*               value:
*                 email: "janedoe@example.mail"
*     responses:
*       200:
*         description: User updated successfully.
*       401:
*         description: Unauthorized access.
*     operationId: patch
*   put:
*     summary: Update a user completely.
*     tags: [user]
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: ID of the user to update.
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/user'
*     responses:
*       200:
*         description: User updated successfully.
*       401:
*         description: Unauthorized access.
*     operationId: put
*   delete:
*     summary: Delete a user.
*     tags: [user]
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: ID of the user to delete.
*         schema:
*           type: string
*     responses:
*       200:
*         description: User deleted successfully.
*       401:
*         description: Unauthorized access.
*     operationId: delete
*
*   get:
*     summary: Get a user by ID.
*     tags: [user]
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: ID of the user to retrieve.
*         schema:
*           type: string
*     responses:
*       200:
*         description: User found.
*       401:
*         description: Unauthorized access.
*       404:
*         description: User not found.
*     operationId: get
*/

/**
 * @swagger
 * /user/verify:
 *   get:
 *     summary: Verify a user's email address.
 *     tags: [verify user]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Verification token sent to the user's email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User verified successfully.
 *       404:
 *         description: Verification failed. User not found or token is invalid.
 *     operationId: verifyUser
 */