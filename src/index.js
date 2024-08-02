import { initMongoConnection } from './db/initMongoConnection.js'
import { setupServer } from './server.js'

initMongoConnection()
  .then(() => setupServer())
  .catch(error => {
    console.error('Failed to initialize MongoDB connection:', error)
  })
