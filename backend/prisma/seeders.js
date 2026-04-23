// import prisma from "../src/lib/prisma"

import { PrismaClient } from "@prisma/client"

async function main() {
    const prisma = new PrismaClient()
    // const user = await prisma.user.upsert({
    //     where: { email: 'admin@sample.com' },
    //     update: {},
    //     create: {
    //         email: 'admin@sample.com',
    //         password: 'adminPassword'
    //     }
    // }); console.log({ user })

    // const cargo = await prisma.cargo.upsert({
    //     create: {
    //         nome: "Admin",
    //     }
    // }).finally(()=> console.log("Cargo criado"))
    const cargo = prisma.cargo.create({
        data: {
            nome: "Admin",
            descricao: "Cargo de administrador com acesso total ao sistema",
            permissoes: []

        }
    }); console.log({ cargo })
}

main().catch(async (err) => {
    console.error(err)
    process.exit(1)
})