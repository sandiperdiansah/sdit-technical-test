import * as v from "valibot";

export const FindAllSchema = v.object({
    page: v.optional(
        v.pipe(
            v.string(),
            v.transform((value) => Number(value)),
            v.minValue(1),
        ),
    ),
    limit: v.optional(
        v.pipe(
            v.string(),
            v.transform((value) => Number(value)),
            v.minValue(1),
            v.maxValue(100),
        ),
    ),
    search: v.optional(v.string()),
});

export { v };
