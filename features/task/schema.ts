import { FindAllSchema, v } from "@/libs/valibot";

export enum ETaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

export const CreateTaskSchema = v.object({
    title: v.pipe(
        v.string(),
        v.nonEmpty("Title is required"),
        v.minLength(3, "Title must be at least 3 characters long"),
    ),
    description: v.optional(
        v.pipe(
            v.string(),
            v.minLength(3, "Description must be at least 3 characters long"),
        ),
    ),
});

export type CreateSchemaType = v.InferOutput<typeof CreateTaskSchema>;

export const UpdateTaskSchema = v.object({
    title: v.optional(
        v.pipe(
            v.string(),
            v.nonEmpty(),
            v.minLength(3, "Title must be at least 3 characters long"),
        ),
    ),
    description: v.optional(
        v.pipe(
            v.string(),
            v.minLength(3, "Description must be at least 3 characters long"),
        ),
    ),
    status: v.optional(v.enum(ETaskStatus)),
});

export type UpdateSchemaType = v.InferOutput<typeof UpdateTaskSchema>;

export const FindAllTaskSchema = v.object({
    ...FindAllSchema.entries,
    filterStatus: v.optional(v.enum(ETaskStatus)),
});

export type FindAllTaskSchemaType = v.InferOutput<typeof FindAllTaskSchema>;
