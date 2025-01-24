import { useTranslation } from "react-i18next"
import { useCallback, useMemo } from "react"
import {
    Popover,
    // PopoverArrow,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover"
import { Languages, ChevronDown } from "lucide-react"
import i18next from "i18next"
import { cn } from "@/lib/utils"
import { LANGUAGES } from "@/i18n/config"

const getLocaleDisplayName = (locale: string, displayLocale?: string) => {
    const displayName = new Intl.DisplayNames([displayLocale || locale], {
        type: "language",
    }).of(locale)!
    return displayName.charAt(0).toLocaleUpperCase() + displayName.slice(1)
}

const LanguageSelector = () => {
    const { i18n } = useTranslation()

    const localesAndNames = useMemo(() => {
        return LANGUAGES.map((locale) => ({
            locale,
            name: getLocaleDisplayName(locale),
        }))
    }, [])

    const languageChanged = useCallback(async (locale: any) => {
        i18next.changeLanguage(locale)
    }, [])

    const { resolvedLanguage: currentLanguage } = i18n

    return (
        <div className="flex items-end">
            <Popover>
                <PopoverTrigger>
                    <div className="flex items-center gap-1 text-primary">
                        <Languages size={18} />
                        <span className="text-primary">{currentLanguage && getLocaleDisplayName(currentLanguage)}</span>
                        <ChevronDown size={12} />
                    </div>
                </PopoverTrigger>

                <PopoverContent
                    side="top"
                    sideOffset={90}
                    align="start"
                    className="absolute mt-1 max-h-60 w-auto overflow-auto rounded-md bg-white p-0 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                    {localesAndNames.map(({ locale, name }) => {
                        const isSelected = currentLanguage === locale
                        return (
                            <div
                                key={locale}
                                onClick={() => languageChanged(locale)}
                                className={cn(
                                    `relative w-auto cursor-pointer select-none px-4 py-2 text-black hover:bg-zinc-200`,
                                )}
                            >
                                <span className={cn(`block truncate`, isSelected && "font-bold text-primary")}>
                                    <span className="text-primary">{name}</span>
                                </span>
                            </div>
                        )
                    })}
                    {/* <PopoverArrow /> */}
                </PopoverContent>
            </Popover>
        </div>
    )
}

export { LanguageSelector }
