/* eslint-disable */


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create Users (capture IDs)
  const user1 = await prisma.user.create({
    data: { email: 'user1@example.com', name: 'User 1', password: 'test1234' },
  });
  const user2 = await prisma.user.create({
    data: { email: 'user2@example.com', name: 'User 2', password: 'test1234' },
  });

  // Create Projects
  await prisma.project.createMany({
    data: [
      { name: 'Project 1 of User 1', userId: user1.id },
      { name: 'Project 2 of User 1', userId: user1.id },
      { name: 'Project 1 of User 2', userId: user2.id },
      { name: 'Project 2 of User 2', userId: user2.id },
    ],
  });

  // Create Blog Posts
  await prisma.blogPost.createMany({
    data: [
      { title: 'Blog Post 1 of User 1', content: 'Sample content', userId: user1.id },
      { title: 'Blog Post 2 of User 1', content: 'Sample content', userId: user1.id },
      { title: 'Blog Post 1 of User 2', content: 'Sample content', userId: user2.id },
    ],
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
