import mongoose from "mongoose";
import dotenv from "dotenv";
import { Task } from "../models/Task"; // Import your model
import { User } from "../models/User"; // Import User model
import { registerUser } from "../services/authService"; // Import auth service

dotenv.config();

const TEST_USER = {
  email: "seeduser@example.com",
  password: "SeedPassword123!",
  fullName: "Seed Test User",
};

const dummyTasks = [
  {
    title: "Complete project documentation",
    description: "Write comprehensive API documentation for all endpoints",
    status: "in-progress" as const,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  },
  {
    title: "Fix login bug",
    description: "JWT token not refreshing properly",
    status: "todo" as const,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
  },
  {
    title: "Setup database backups",
    description: "Configure automated daily backups for MongoDB",
    status: "todo" as const,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
  },
  {
    title: "Review pull requests",
    description: "Review and merge pending PRs from team members",
    status: "in-progress" as const,
    dueDate: new Date(Date.now() + 0.5 * 24 * 60 * 60 * 1000), // 12 hours from now
  },
  {
    title: "Implement email notifications",
    description: "Add email notifications for task deadlines using Resend",
    status: "todo" as const,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
  },
  {
    title: "Create WebSocket event handlers",
    description: "Implement real-time task updates via Socket.io",
    status: "in-progress" as const,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
  {
    title: "Write unit tests for auth",
    description: "Add test coverage for authentication services",
    status: "todo" as const,
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
  },
  {
    title: "Deploy to production",
    description: "Deploy Phase 1 to AWS EC2",
    status: "todo" as const,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
  },
  {
    title: "Update dependencies",
    description: "Update npm packages to latest versions",
    status: "completed" as const,
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    closedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // closed 4 days ago
  },
  {
    title: "Fix TypeScript errors",
    description: "Resolve all strict mode TypeScript compilation errors",
    status: "completed" as const,
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    closedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // closed 1 day ago
  },
  {
    title: "Setup Docker container",
    description: "Create Dockerfile and docker-compose for the application",
    status: "in-progress" as const,
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
  },
  {
    title: "Add API rate limiting",
    description: "Implement rate limiting middleware for security",
    status: "todo" as const,
    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
  },
  {
    title: "Create Swagger documentation",
    description: "Generate OpenAPI/Swagger docs for all endpoints",
    status: "in-progress" as const,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
  {
    title: "Setup CI/CD pipeline",
    description:
      "Configure GitHub Actions for automated testing and deployment",
    status: "todo" as const,
    dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
  },
  {
    title: "Optimize database queries",
    description:
      "Add indexes and optimize MongoDB queries for better performance",
    status: "todo" as const,
    dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
  },
  {
    title: "Client testing and feedback",
    description: "Gather feedback from early beta testers",
    status: "in-progress" as const,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    // Check if user already exists
    let user = await User.findOne({ email: TEST_USER.email });
    
    if (!user) {
      console.log("⚠️ Test user not found. Creating...");
      try {
        await registerUser({
          email: TEST_USER.email,
          password: TEST_USER.password,
          fullName: TEST_USER.fullName,
        });
        user = await User.findOne({ email: TEST_USER.email });
      } catch (err) {
        console.error("❌ Failed to create user:", err);
        process.exit(1);
      }
    }

    // Add userId to all dummy tasks
    const tasksWithUserId = dummyTasks.map((task) => ({
      ...task,
      userId: user!._id,
    }));

    await Task.deleteMany({});
    await Task.insertMany(tasksWithUserId);

    console.log("✅ Database Seeded Successfully with 15 tasks");
    console.log(`📧 Test user email: ${TEST_USER.email}`);
    console.log(`🔑 Test user password: ${TEST_USER.password}`);
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedDB();
