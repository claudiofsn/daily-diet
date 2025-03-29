import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { knex } from "../../db/knex";
import { mealSchema } from "../schemas/mealSchema";

export default async function mealRoutes(fastify: FastifyInstance) {
    fastify.addHook("onRequest", fastify.authenticate);

    fastify.post("/", async (request, reply) => {
        const parsedBody = mealSchema.safeParse(request.body);
        if (!parsedBody.success) {
            return reply.status(400).send({ error: parsedBody.error.format() });
        }

        const { name, description, datetime, is_on_diet } = parsedBody.data;
        const user_id = request.user.id;

        await knex("meals").insert({ id: randomUUID(), name, description, datetime, is_on_diet, user_id })

        return reply.status(201).send({ message: "Meal created" });
    });

    fastify.get("/", async (request, reply) => {
        const meals = await knex("meals").where({ user_id: request.user.id })
        return reply.send(meals);
    });

    fastify.get("/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const meal = await knex("meals").where({ id, user_id: request.user.id })

        if (!meal) {
            return reply.status(404).send({ error: "Meal not found" });
        }

        return reply.send(meal);
    });

    fastify.put("/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const parsedBody = mealSchema.safeParse(request.body);

        if (!parsedBody.success) {
            return reply.status(400).send({ error: parsedBody.error.format() });
        }

        const meal = await knex("meals").where({ id, user_id: request.user.id })

        if (!meal) {
            return reply.status(404).send({ error: "Meal not found" });
        }

        await knex("meals").where({ id, user_id: request.user.id }).update(parsedBody.data);

        return reply.send({ message: "Meal updated" });
    });

    fastify.delete("/:id", async (request, reply) => {
        const { id } = request.params as { id: string };

        const meal = await knex("meals").where({ id, user_id: request.user.id })

        if (!meal) {
            return reply.status(404).send({ error: "Meal not found" });
        }

        await knex("meals").where({ id, user_id: request.user.id }).delete();

        return reply.send({ message: "Meal deleted" });
    });

    fastify.get("/metrics", async (request, reply) => {
        try {
            const userId = request.user.id;

            const totalMeals = await knex("meals")
                .where({ user_id: userId })
                .count({ count: "*" });

            const totalMealsWithinDiet = await knex("meals")
                .where({ user_id: userId, is_on_diet: true })
                .count({ count: "*" });

            const meals = await knex("meals")
                .where({ user_id: userId })
                .orderBy("datetime", "asc");

            let maxSequence = 0;
            let currentSequence = 0;

            for (const meal of meals) {
                if (meal.is_on_diet) {
                    currentSequence++;
                    maxSequence = Math.max(maxSequence, currentSequence);
                } else {
                    currentSequence = 0;
                }
            }

            return reply.send({
                total_meals: totalMeals[0].count,
                meals_within_diet: totalMealsWithinDiet[0].count,
                meals_outside_diet: (totalMeals[0].count - totalMealsWithinDiet[0].count),
                best_diet_streak: maxSequence
            });
        } catch (error) {
            return reply.status(500).send({ error: "Internal server error" });
        }
    });
}