import Fastify, { FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import { genSeededData } from "./generator";

const app = Fastify({ logger: true });

app.register(cors, {
  origin: "*",
});

type QueryPaylod = {
  symbol: string;
  period: "daily" | "hourly";
};

type SearchRequest = FastifyRequest<{
  Querystring: QueryPaylod;
}>;

app.get(
  "/api/search",
  {
    schema: {
      querystring: {
        type: "object",
        required: ["symbol", "period"],
        properties: {
          symbol: { type: "string" },
          period: { type: "string", enum: ["daily", "hourly"] },
        },
      },
    },
  },
  async (request: SearchRequest, reply) => {
    const { symbol, period } = request.query;

    return genSeededData(symbol, period);
  }
);

export default app;
