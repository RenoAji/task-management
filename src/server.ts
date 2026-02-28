import { app } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";
import { initEmailCronJobs } from "./cron/sendEmailJob";

const start = async (): Promise<void> => {
  try {
    await connectDatabase();
    initEmailCronJobs();
    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

void start();
