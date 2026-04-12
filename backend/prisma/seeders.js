import prisma from "../src/lib/prisma"

async function main() {
    const user = await prisma.user.upsert({
        create: {
            email: 'admin@sample.com',
            password: 'adminPassword'
        }
    }); console.log({ user })
    
}

main().then(async () => {
    await prisma.$disconnect()
}).catch(async (err) => {
    console.error(err)
    process.exit(1)
})