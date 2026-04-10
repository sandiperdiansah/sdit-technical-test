"use client";

import { toaster } from "@/components/ui/toaster";
import { axiosInstance } from "@/libs/axios";
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    Field,
    IconButton,
    Input,
    Portal,
    Textarea,
} from "@chakra-ui/react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { CreateSchemaType, CreateTaskSchema } from "../schema";

export const TaskDialog = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateSchemaType>({
        resolver: valibotResolver(CreateTaskSchema),
    });

    const onSubmit: SubmitHandler<CreateSchemaType> = async (data) => {
        try {
            await axiosInstance.post("/api/tasks", data);
            toaster.info({
                description: "Task created successfully",
            });
            router.refresh();
        } catch {
            toaster.error({
                description: "Failed to create task",
            });
        } finally {
            setOpen(false);
        }
    };

    return (
        <Dialog.Root
            size={{ mdDown: "full", md: "md" }}
            placement="center"
            lazyMount
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
        >
            <Dialog.Trigger asChild>
                <IconButton>
                    <LuPlus />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Add Task</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Box
                                asChild
                                spaceY={2}
                            >
                                <form
                                    id="task-form"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <Field.Root invalid={!!errors.title}>
                                        <Field.Label>Title</Field.Label>
                                        <Input
                                            placeholder="Title"
                                            {...register("title")}
                                        />
                                        <Field.ErrorText>
                                            {errors.title?.message}
                                        </Field.ErrorText>
                                    </Field.Root>
                                    <Field.Root invalid={!!errors.description}>
                                        <Field.Label>Description</Field.Label>
                                        <Textarea
                                            size="xl"
                                            placeholder="Description"
                                            {...register("description")}
                                        />
                                        <Field.ErrorText>
                                            {errors.description?.message}
                                        </Field.ErrorText>
                                    </Field.Root>
                                </form>
                            </Box>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button
                                type="submit"
                                form="task-form"
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                Save
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
