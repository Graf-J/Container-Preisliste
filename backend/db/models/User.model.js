const { DataTypes, Model, ValidationError, ValidationErrorItem } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {

    class User extends Model { 
        static async login(name, password) {
            if (!name) {
                throw new Error('Username is required');
            }
            if (!password) {
                throw new Error('Password is required');
            }

            const user = await this.findOne({ where: { name }});

            if (!user) {
                throw new Error('No User found');
            }

            const auth = await bcrypt.compare(password, user.password);
            if (!auth) {
                throw new Error('Invalid Password');
            } else {
                return user;
            }
        }
    }

    User.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            set(value) {
                if (value) {
                    if (value.length < 8) {
                        throw new ValidationError('Password has to be at least 8 Characters long', [new ValidationErrorItem('Password has to be at least 8 Characters long')]);
                    }
                    
                    // Somehow only the following Sync Methods work here
                    const saltRounds = parseInt(process.env.SALT_ROUNDS);
                    const salt = bcrypt.genSaltSync(saltRounds);
                    const hashedPassword = bcrypt.hashSync(value, salt);
                    this.setDataValue('password', hashedPassword);
                } else {
                    this.setDataValue('password', null);
                }
            }
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user'
        },
        money: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        active: {
            type: DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['password']),
            get: function() {
                if (this.get('password')) return true;
                return false;
            }
        }
    }, {
        sequelize,
        modelName: 'user'
    })

    return User;
}