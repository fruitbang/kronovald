import { useTranslation } from "react-i18next"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import Editor from "@/components/editor"
import { Editor as TipTapEditor } from "reactjs-tiptap-editor"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { defaultQueryFn } from "@/api"
import { Loader2 } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

function debounce(func: any, wait: number) {
    let timeout: number
    return function (...args: any[]) {
        clearTimeout(timeout)
        // @ts-expect-error
        timeout = setTimeout(() => func.apply(this, args), wait)
    }
}

const patchFile = (content: string) =>
    fetch("/api/text-documents", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ blob: content }),
    })

export default function Home() {
    const queryClient = useQueryClient()
    const { t } = useTranslation("translation")

    const [content, setContent] = useState("")

    const { data, isSuccess } = useQuery({
        queryFn: () => defaultQueryFn({ queryKey: ["text-documents"] }),
        queryKey: ["file"],
    })

    const {
        mutate: mutateFile,
        isPending,
        isSuccess: isSuccessSave,
    } = useMutation({
        mutationFn: () => patchFile(content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["file"] })
        },
        onError: () => {
            throw new Error("Error saving file")
        },
    })

    const editorRef = useRef<{ editor: TipTapEditor } | null>(null)

    const handleChange = useCallback(
        debounce(() => {
            if (editorRef.current?.editor) {
                setContent(editorRef.current.editor.getText())
            }
        }, 300),
        [],
    )

    useEffect(() => console.log(content), [content])

    const handleSave = async () => mutateFile()

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">Files</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>fileId</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                        <section className="w-full py-32 md:py-48 flex flex-col items-center justify-center">
                            <h1 className="text-black">{t("title")}</h1>
                            {isSuccess && (
                                <Editor
                                    onChange={handleChange}
                                    content={content ? content : data?.blob}
                                    ref={editorRef}
                                />
                            )}
                            <Button onClick={handleSave} disabled={isPending}>
                                {isPending ? <Loader2 /> : "Save"}
                            </Button>
                            {isSuccess && !isSuccessSave && (
                                <div>Initial data from backend: {JSON.stringify(data.blob)}</div>
                            )}
                            {isSuccessSave && isSuccess && (
                                <div>Successfully saved to backed data: {JSON.stringify(data.blob)}</div>
                            )}
                        </section>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
