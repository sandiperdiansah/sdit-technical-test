import { Task } from "@/prisma/generated/client";

export const findAllTask = async (): Promise<{
    message: string;
    meta: { page: number; limit: number; total: number; totalPages: number };
    data: Task[];
}> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`);
        return response.json();
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch tasks");
    }
};
