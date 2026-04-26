#!/usr/bin/env node

/**
 * Simple database connection test
 * Used by CI/CD to verify database connectivity
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing database connection...')

    // Simple query to test connection
    const result = await prisma.$queryRaw`SELECT 1 as test`

    console.log('✅ Database connection successful!')
    console.log('Result:', result)

    process.exit(0)
  } catch (error) {
    console.error('❌ Database connection failed!')
    console.error('Error:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()