import Fastify, { FastifyRequest } from "fastify";
import cors from '@fastify/cors'
import { genSeededData } from "./generator";

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: "*",
});

type QueryPaylod = {
  symbol: string;
  period: "daily" | "hourly";
};

type SearchRequest = FastifyRequest<{
  Querystring: QueryPaylod;
}>;

fastify.get(
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

const start = async () => {
  try {
    await fastify.listen({ port: 8080 });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
