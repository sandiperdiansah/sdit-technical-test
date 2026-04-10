import { CreateTaskSchema, ETaskStatus, FindAllTaskSchema } from "@/features/task/schema";
import prisma from "@/libs/prisma";
import { v } from "@/libs/valibot";
import { Prisma } from "@/prisma/generated/client";
import { NextRequest, NextResponse } from "next/server";

// create
export const POST = async (request: NextRequest) => {
    try {
        const payload = v.safeParse(CreateTaskSchema, await request.json());

        if (!payload.success) {
            return NextResponse.json(
                {
                    message: "Invalid payload",
                    error: v.flatten<typeof CreateTaskSchema>(payload.issues).nested,
                },
                { status: 400 },
            );
        }

        const result = await prisma.task.create({
            data: {
                ...payload.output,
                status: ETaskStatus.TODO,
            },
        });

        return NextResponse.json(
            { message: "Task created", data: result },
            { status: 201 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};

// find all
export const GET = async (request: NextRequest) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            filterStatus,
        } = v.parse(FindAllTaskSchema, Object.fromEntries(request.nextUrl.searchParams));

        const where: Prisma.TaskWhereInput = {};

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }

        if (filterStatus) {
            where.status = filterStatus;
        }

        const [data, total] = await Promise.all([
            prisma.task.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.task.count({ where }),
        ]);

        return NextResponse.json(
            {
                message: "Tasks fetched successfully",
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
                data,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
