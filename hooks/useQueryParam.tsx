"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

export type UseQueryParamsProps = {
    initialQuery?: {
        name: string;
        value: string | number | boolean;
    }[];
};

export const useQueryParams = ({ initialQuery }: UseQueryParamsProps = {}) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const initialized = useRef(false);

    const update = useCallback(
        (params: URLSearchParams) => {
            const query = params.toString();
            router.replace(query ? `${pathname}?${query}` : pathname);
        },
        [router, pathname],
    );

    const set = useCallback(
        (name: string, value: string | number | boolean): void => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, String(value));
            update(params);
        },
        [searchParams, update],
    );

    const get = useCallback(
        <T = string,>(name: string, callback?: (value: string) => T): T | null => {
            const value = searchParams.get(name);

            if (value === null) return null;
            if (callback) return callback(value);

            return value as T;
        },
        [searchParams],
    );

    const remove = useCallback(
        (name: string): void => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete(name);
            update(params);
        },
        [searchParams, update],
    );

    useEffect(() => {
        if (!initialQuery || initialized.current) return;

        const params = new URLSearchParams(searchParams.toString());
        let changed = false;

        initialQuery.forEach(({ name, value }) => {
            if (!params.has(name)) {
                params.set(name, String(value));
                changed = true;
            }
        });

        if (changed) update(params);

        initialized.current = true;
    }, [initialQuery, searchParams, update]);

    return { set, get, remove };
};
