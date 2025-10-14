import prisma from './config/db.js';

async function main() {
  const agent = await prisma.agent.create({
    data: {
      fullName: "Selam Fikru",
      email: "agent@example.com",
      password: "123456", 
    },
  });
  console.log('Agent created:', agent);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
