const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    if (users.length > 0) {
        const firstUser = users[0];
        console.log(`Promoting ${firstUser.email} to ADMIN...`);
        await prisma.user.update({
            where: { id: firstUser.id },
            data: { role: 'ADMIN' }
        });
        console.log('Success! Please log out and log back in.');
    } else {
        console.log('No users found.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
