"use client";

import { toaster } from "@/components/ui/toaster";
import { axiosInstance } from "@/libs/axios";
import { Task } from "@/prisma/generated/client";
import {
    Badge,
    Box,
    Button,
    CloseButton,
    createListCollection,
    Dialog,
    Field,
    Heading,
    IconButton,
    Input,
    Portal,
    Select,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdOutlineDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { ETaskStatus, UpdateSchemaType, UpdateTaskSchema } from "../schema";

const collections = createListCollection({
    items: Object.values(ETaskStatus).map((status) => ({
        value: status,
        label: status,
    })),
});

export const TaskItem = ({ task }: { task: Task }) => {
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<UpdateSchemaType>({
        resolver: valibotResolver(UpdateTaskSchema),
        defaultValues: {
            title: task.title,
            description: task.description ?? "",
            status: task.status as ETaskStatus,
        },
    });

    const onSubmit: SubmitHandler<UpdateSchemaType> = async (data) => {
        try {
            await axiosInstance.patch(`/api/tasks/${task.id}`, data);
            toaster.info({
                description: "Task updated successfully",
            });
            reset();
            router.refresh();
        } catch {
            toaster.error({
                description: "Failed to update task",
            });
        } finally {
            setOpen(false);
        }
    };

    const onDelete = async () => {
        setIsDeleting(true);
        try {
            await axiosInstance.delete(`/api/tasks/${task.id}`);
            toaster.info({
                description: "Task deleted successfully",
            });
            router.refresh();
        } catch {
            toaster.error({
                description: "Failed to delete task",
            });
        } finally {
            setIsDeleting(false);
            setOpenDelete(false);
        }
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
        >
            <Box spaceY={3}>
                <Box
                    p={1}
                    pb={3}
                    borderBottomWidth={1}
                    borderBottomColor="gray.100"
                    spaceY={3}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                    >
                        <Heading
                            fontWeight="semibold"
                            fontSize="xl"
                        >
                            {task.title}
                        </Heading>
                        <Badge size="xs">{task.status}</Badge>
                    </Box>
                    <Text
                        color="fg.muted"
                        fontSize="sm"
                    >
                        {task.description}
                    </Text>
                </Box>
            </Box>

            <Box
                display="flex"
                alignItems="center"
            >
                {/* update */}
                <Dialog.Root
                    size={{ mdDown: "full", md: "md" }}
                    placement="center"
                    lazyMount
                    open={open}
                    onOpenChange={(e) => setOpen(e.open)}
                >
                    <Dialog.Trigger asChild>
                        <IconButton
                            size="xs"
                            variant="ghost"
                            colorPalette="green"
                        >
                            <MdOutlineEdit />
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

                                            <Select.Root
                                                collection={collections}
                                                width="full"
                                                defaultValue={[task.status]}
                                                {...register("status")}
                                            >
                                                <Select.HiddenSelect />
                                                <Select.Label>Status</Select.Label>
                                                <Select.Control>
                                                    <Select.Trigger>
                                                        <Select.ValueText placeholder="Select status" />
                                                    </Select.Trigger>
                                                    <Select.IndicatorGroup>
                                                        <Select.Indicator />
                                                    </Select.IndicatorGroup>
                                                </Select.Control>
                                                <Portal>
                                                    <Select.Positioner>
                                                        <Select.Content>
                                                            {collections.items.map(
                                                                (satus) => (
                                                                    <Select.Item
                                                                        item={satus}
                                                                        key={satus.value}
                                                                    >
                                                                        {satus.label}
                                                                        <Select.ItemIndicator />
                                                                    </Select.Item>
                                                                ),
                                                            )}
                                                        </Select.Content>
                                                    </Select.Positioner>
                                                </Portal>
                                            </Select.Root>
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

                {/* delete */}
                <Dialog.Root
                    open={openDelete}
                    onOpenChange={(e) => setOpenDelete(e.open)}
                    size={{ mdDown: "full", md: "md" }}
                >
                    <Dialog.Trigger asChild>
                        <IconButton
                            size="xs"
                            variant="ghost"
                            colorPalette="red"
                        >
                            <MdOutlineDeleteOutline />
                        </IconButton>
                    </Dialog.Trigger>
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content>
                                <Dialog.Header>
                                    <Dialog.Title>Delete Task</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                    Are you sure you want to delete this task?
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </Dialog.ActionTrigger>
                                    <Button
                                        colorPalette="red"
                                        onClick={onDelete}
                                        loading={isDeleting}
                                        disabled={isDeleting}
                                    >
                                        Delete
                                    </Button>
                                </Dialog.Footer>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton size="sm" />
                                </Dialog.CloseTrigger>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            </Box>
        </Box>
    );
};
