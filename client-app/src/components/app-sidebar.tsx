import { Github, SquareTerminal } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { Separator } from "@radix-ui/react-separator"
import { ModeToggle } from "./mode-toggle"
import { useFilesListQuery } from "@/api/text-documents/queries"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuSkeleton,
    SidebarRail,
    useSidebar,
} from "@/ui-kit/sidebar.component"
import { Button } from "@/ui-kit/button.component"
import { ComponentProps } from "react"

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
    const { t } = useTranslation()
    const { open } = useSidebar()

    const { data: files, isLoading } = useFilesListQuery()

    const navFilesItems = files
        ? [
              ...files.map((file) => ({
                  title: String(file.id),
                  url: `/:${file.id}`,
              })),
              { title: "New", url: ":new" },
          ]
        : [{ title: "New", url: ":new" }]

    const navFilesData = [{ title: "Files", url: "#", icon: SquareTerminal, isActive: true, items: navFilesItems }]

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <h1 className="font-bold center text-center">
                    <Link to="/about" className="hover:text-blue-500 transition-colors duration-300">
                        {open ? t("slogan") : null}{" "}
                    </Link>
                </h1>
            </SidebarHeader>
            <Separator orientation="horizontal" className="my-1" />
            <SidebarContent>{isLoading ? <SidebarMenuSkeleton /> : <NavMain items={navFilesData} />}</SidebarContent>
            <SidebarFooter>
                <div className="flex justify-between gap-4">
                    <Button size={"icon"} className="rounded-full">
                        <a href="https://github.com/kronavald/kronovald" target="_blank" rel="noreferrer">
                            <Github />
                        </a>
                    </Button>
                    <ModeToggle />
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
