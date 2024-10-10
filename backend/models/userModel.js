const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter a valid email'],
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minLength: [6, 'Password must be up to 6 characters'],
      // maxLength: [11, 'Password must not be more than 11 characters']
    },
    photo: {
      type: String,
      // required:[true, 'Please add a password'],
      default: '',
    },
    phone: {
      type: String,
      default: '+1 1234',
    },
    bio: {
      type: String,
      maxLength: [250, 'Bio must not be more than 250'],
      default: 'bio',
    },
  },
  {
    timestamps: true,
  },
)

//   Encrypt password before saving to DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(this.password, salt)
  this.password = hashedPassword
  next()
})

const User = mongoose.model('User', userSchema)
module.exports = User
