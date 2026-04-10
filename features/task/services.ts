import { axiosInstance } from "@/libs/axios";
import { Task } from "@/prisma/generated/client";

export const findAllTask = async (): Promise<{
    message: string;
    meta: { page: number; limit: number; total: number; totalPages: number };
    data: Task[];
}> => {
    try {
        const response = await axiosInstance.get("/api/tasks");
        return response.data;
    } catch (error) {
        console.error("error : ", error);
        throw new Error("Failed to fetch tasks");
    }
};
