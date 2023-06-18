import { PrismaClient } from '@prisma/client'
import { logger } from './logger'

const prisma = new PrismaClient()

const databasePrisma = async (): Promise<void> => {
  try {
    await prisma.$connect()
    logger.info('Connected to the database')
  } catch (error) {
    logger.error('Failed to connect to the database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

export default databasePrisma().catch(console.error)
