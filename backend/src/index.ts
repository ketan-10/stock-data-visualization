import app from "./app";

(async () => {
  try {
    await app.listen({ port: 8080 });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
