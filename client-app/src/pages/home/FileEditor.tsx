import { useTranslation } from "react-i18next"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Editor from "@/components/editor"
import { Loader2 } from "lucide-react"

import {
    useCreateFileMutation,
    useDeleteFileMutation,
    useFileQuery,
    useUpdateFileMutation,
} from "@/api/text-documents/queries"
import { debounce } from "@/lib/utils"
import { useNavigate, useParams } from "react-router"

const PARAM_NEW = "new"

const FileEditorController = ({ id }: { id: string }) => {
    const navigate = useNavigate()
    const [content, setContent] = useState("")

    const { data, isFetching } = useFileQuery(id, id !== undefined && id !== PARAM_NEW)

    const handleChange = useCallback(
        debounce((newContent: string) => {
            setContent(newContent)
        }, 300),
        [],
    )

    const createFile = useCreateFileMutation()
    const updateFile = useUpdateFileMutation(id)
    const deleteFile = useDeleteFileMutation(id)

    useEffect(() => {
        if (createFile.isSuccess) {
            navigate(`/:${createFile.data.id}`)
        }
    }, [createFile.isSuccess])

    // useEffect(() => {
    //     if (deleteFile.isSuccess) {
    //         navigate("/:new")
    //     }
    // }, [deleteFile.isSuccess])

    return (
        <>
            <div>{isFetching && <Loader2 className="animate-spin" />}</div>
            <div>{data && `Data from API: ${data?.content}`}</div>
            <div>{`Local state: ${content}`}</div>
            {id === PARAM_NEW && <Editor onChange={handleChange} initialContent={"New file content"} />}
            {data && <Editor onChange={handleChange} initialContent={data.content} />}
            <div className="mt-2 flex flex-row gap-2">
                {id === PARAM_NEW ? (
                    <Button onClick={() => createFile.mutate(content)} disabled={createFile.isPending}>
                        {createFile.isPending ? <Loader2 /> : "Create"}
                    </Button>
                ) : (
                    <>
                        <Button
                            onClick={() => updateFile.mutate({ id: data!.id, content })}
                            disabled={updateFile.isPending || data?.id === undefined}
                        >
                            {updateFile.isPending ? <Loader2 /> : "Update"}
                        </Button>
                        <Button
                            onClick={() =>
                                deleteFile.mutate(undefined, {
                                    onSuccess: () => navigate("/:new"),
                                })
                            }
                            disabled={deleteFile.isPending || data?.id === undefined}
                        >
                            {deleteFile.isPending ? <Loader2 /> : "Delete"}
                        </Button>
                    </>
                )}
            </div>
        </>
    )
}

const FileEditorWrapper = () => {
    const { t } = useTranslation("translation")
    const { fileId } = useParams()

    if (!fileId) {
        throw new Error("fileId is undefined")
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                <section className="w-full py-32 md:py-48 flex flex-col items-center justify-center">
                    <h1>{fileId}</h1>
                    <FileEditorController id={fileId.slice(1)} />
                </section>
            </div>
        </div>
    )
}

export default FileEditorWrapper
