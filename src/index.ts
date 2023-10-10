import app from "./app";
import { PORT } from "./configs";
import { connectDatabase } from "./utils";

app.listen(PORT, async () => {
  console.log(`  Server is listening on http://localhost:${PORT}`);
  await connectDatabase();
});
