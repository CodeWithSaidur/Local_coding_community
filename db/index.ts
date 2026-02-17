import mongoose from 'mongoose'

const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
  throw new Error('DB URI Not Defined in .env')
}

// Connect to MongoDB
mongoose.connect(connectionString).catch(err => {
  console.error('MongoDB connection error:', err)
})

export const db = mongoose.connection
export { mongoose }

