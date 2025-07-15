import { sql, count, ilike } from "drizzle-orm";
import db from "@/db";
import { users } from "@/db/schema";

export async function getUsers({
  q,
  limit = 20,
  page = 1,
}: {
  q?: string;
  limit?: number;
  page?: number;
}): Promise<{
  result: (typeof users.$inferSelect)[];
  total: number;
}> {
  const offset = (page - 1) * limit;

  const where = q
    ? sql`WHERE email ILIKE ${"%" + q + "%"}`
    : sql``;

  const total = await db
    .select({
      count: count(),
    })
    .from(users)
    .where(q ? ilike(users.email, `%${q}%`) : undefined)
    .then((res) => res[0].count);

  const result = (await db.execute(
    sql`
      SELECT *
      FROM ${users}
      ${where}
      ORDER BY 
        CASE
          WHEN role = 'superadmin' THEN 1
          WHEN role = 'admin' THEN 2
          WHEN role = 'superuser' THEN 3
          WHEN role = 'user' THEN 4
          ELSE 5
        END,
        email ASC
      LIMIT ${limit}
      OFFSET ${offset}
    `
  )) as (typeof users.$inferSelect)[];

  return { result, total };
}
