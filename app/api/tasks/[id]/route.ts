import { UpdateTaskSchema } from "@/features/task/schema";
import prisma from "@/libs/prisma";
import { v } from "@/libs/valibot";
import { NextRequest, NextResponse } from "next/server";

// update
export const PATCH = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) => {
    try {
        const { id } = await params;

        const task = await prisma.task.findUnique({
            where: {
                id,
            },
        });

        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        const payload = v.safeParse(UpdateTaskSchema, await request.json());

        if (!payload.success) {
            return NextResponse.json(
                {
                    message: "Invalid payload",
                    error: v.flatten<typeof UpdateTaskSchema>(payload.issues).nested,
                },
                { status: 400 },
            );
        }

        const result = await prisma.task.update({
            where: {
                id: task.id,
            },
            data: {
                ...payload.output,
                status: payload.output.status || task.status,
            },
        });

        return NextResponse.json(
            { message: "Task updated", data: result },
            { status: 200 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};

// delete
export const DELETE = async (
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) => {
    try {
        const { id } = await params;

        const task = await prisma.task.findUnique({
            where: {
                id,
            },
        });

        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        const result = await prisma.task.delete({
            where: {
                id: task.id,
            },
        });

        return NextResponse.json(
            { message: "Task deleted", data: result },
            { status: 200 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
