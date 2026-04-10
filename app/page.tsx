import { TaskDialog } from "@/features/task/components/TaskDialog";
import { TaskItem } from "@/features/task/components/TaskItem";
import { findAllTask } from "@/features/task/services";
import { Box, Text } from "@chakra-ui/react";

export const dynamic = "force-dynamic";

const Page = async () => {
    const tasks = await findAllTask();

    return (
        <Box
            as="main"
            maxW="3xl"
            mx="auto"
            p={{ base: 5, md: 8 }}
            spaceY={6}
        >
            <Box
                display="flex"
                justifyContent="end"
            >
                <TaskDialog />
            </Box>

            {/* list task */}
            {tasks.data.length === 0 ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Text>No tasks found</Text>
                </Box>
            ) : (
                tasks.data.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                    />
                ))
            )}
        </Box>
    );
};

export default Page;
