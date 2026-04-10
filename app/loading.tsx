import { Box, Spinner } from "@chakra-ui/react";

const Loading = () => {
    return (
        <Box
            minH="svh"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Spinner size="lg" />
        </Box>
    );
};

export default Loading;
