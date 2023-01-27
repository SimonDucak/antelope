import { useAuth } from '@/composable/use_auth';
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export const userRequiredMiddleware = (
    _to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
): void => {
    const { currentUser } = useAuth();
    if (!!currentUser) next();
    else next({ query: from.query, params: from.params, path: '/login' })
};

export const guestRequiredMiddleware = (
    _to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
): void => {
    const { currentUser } = useAuth();
    if (!currentUser) next();
    else next({ query: from.query, params: from.params, path: '/dashboard' })
};