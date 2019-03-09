const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');


module.exports = {
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
                // _id: result._doc._id.toString()
                _id: result.id
            };
        } catch (error) {
            throw error;
        }
    },

    login: async ({email, password}) => {
        const user = await User.findOne({email: email});
        if (!user) {
            throw new Error('User does not exist!')
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect.')
        }
        const token = jwt.sign({   // we can use token to store some data
                userId: user.id,
                email: user.email
            }, 'stringforchecking', {expiresIn: '1h'});    // second argument is required (for access and validation)
        return {userId: user.id, token: token, tokenExpiration: 1}
    }
};
