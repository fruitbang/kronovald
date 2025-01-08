import React from "react"
import { createHashRouter, RouteObject } from "react-router-dom"
import ErrorPage from "./components/error-page"
import { getDefaultLayout } from "./components/layout"
import HomePage from "./pages/home"
import About from "./pages/about"

export const routerObjects: RouteObject[] = [
    {
        path: "/",
        Component: HomePage,
    },
    {
        path: "/about",
        Component: About,
    },
]

// TODO: поменять хэш роутер на браузер роутер
export function createRouter(): ReturnType<typeof createHashRouter> {
    const routeWrappers = routerObjects.map((router) => {
        // @ts-ignore TODO: better type support
        const getLayout = router.Component?.getLayout || getDefaultLayout
        const Component = router.Component!
        const page = getLayout(<Component />)
        return {
            ...router,
            element: page,
            Component: null,
            ErrorBoundary: ErrorPage,
        }
    })
    return createHashRouter(routeWrappers)
}
