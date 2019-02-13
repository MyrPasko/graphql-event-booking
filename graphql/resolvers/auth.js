const bcrypt = require('bcryptjs');
const User = require('../../models/user');


module.exports = {                     // all schemas, matching by names
    /** User resolvers */
    createUser: async (args) => {
        const {email, password} = args.userInput;  // there is nested object of type EventInput with the name "eventInput"

        try {
            const existingUser = await User.findOne({email: email});

            if (existingUser) {
                throw new Error('User exists already.')
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = new User({
                email: email,
                // password: password                     // it is wrong way of storing data, we can't store password as plain text
                password: hashedPassword
            });

            const result = await user.save();                           // new item must be return

            return {
                ...result._doc,
                password: null,
                _id: result._doc._id.toString()
            };
        } catch (error) {
            throw error;
        }
    },
};
