import { Suspense, useEffect, useState } from "react"
import * as cheerio from 'cheerio';
import Script from "next/script";

type Props = {
    videoData: string
}

const KVideo = (props: Props) => {
    const { videoData } = props

    const [playerURL, setPlayerURL] = useState<string>()
    const [UNIQUE_OBJ_ID, setUNIQUE_OBJ_ID] = useState<string>()
    const [playerConfig, setPlayerConfig] = useState<any>()

    useEffect(() => {
        const parsedHTML = cheerio.load(videoData, { xmlMode: false })
        const htmlElement: any = parsedHTML("script")

        if (htmlElement.length === 2) {
            const player = htmlElement[0].attribs.src
            setPlayerURL(player)

            try {
                const playerConfiguration = JSON.parse((htmlElement[1].children[0].data.split("(")[1]).split(")")[0])
                setPlayerConfig(playerConfiguration)
                setUNIQUE_OBJ_ID(playerConfiguration.targetId)
            } catch (error) {
                console.error("can not parse player configuration")
            }
        }

    }, [videoData])

    if (!videoData) return <></>

    return (
        <>
            {UNIQUE_OBJ_ID && playerURL &&
                <Suspense fallback="<p>Loading...</p>">
                    <div id={UNIQUE_OBJ_ID} style={{ width: "100%", height: "20rem" }}></div>
                    <Script
                        id={`${UNIQUE_OBJ_ID}_${Math.floor((Math.random() * 100) + 1)}`}
                        src={playerURL} onLoad={() => {
                            // @ts-ignore
                            mw.setConfig("EmbedPlayer.DisableContextMenu", true)
                            // @ts-ignore
                            kWidget.embed(playerConfig)
                        }}
                        strategy="afterInteractive"
                    />
                </Suspense>
            }
        </>
    )
}

export default KVideo;