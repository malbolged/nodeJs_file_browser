import config from "./configs";
import { routes } from "./routes";
import { ExpressServerApp } from "./express_server_app";

try {
  const server = ExpressServerApp.fromConfig({
    router: routes,
  });

  try {
    server.start({
      port: config.port,
    });
  } catch (databaseError) {
    console.error("Database Error: ", databaseError);
    throw databaseError;
  }

  process.on("SIGINT", async () => {
    try {
      server.stop();
    } catch {
      process.exit();
    }
  });
} catch (expressServerAppError) {
  console.error("ExpressServerApp Error: ", expressServerAppError);
}
