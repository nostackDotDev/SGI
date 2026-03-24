const prisma = require("../lib/prisma")

async function main() {
    const user = await prisma.user.upsert({
        where: { email: 'admin@sample.com' },
        update: {},
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