// npm install hls.js
import { useCallback, useEffect, useRef, useState } from "react"
import Hls from "hls.js";

export const HLSCameraStream = ({
    width = "320",
    height = "320",
    url = ""
}) => {
    // const canvasRef = useRef(null);
    const hlsRef = useRef(null);
    // const [status, setStatus] = useState("initializing")
    // const [isConnected, setIsConnected] = useState(false)
    const videoElemRef = useRef(null)

    const init = useCallback(() => {
        // if(webSocketRef.current) {
        //     webSocketRef.current.close();
        //     webSocketRef.current = null;
        // }
        // webSocketRef.current = new WebSocket(url);
        // webSocketRef.current.binaryType = "arraybuffer";

        // if(canvasRef.current) {
        //     const ctx = canvasRef.current.getContext("2d");

        //     const img = new Image();
    
        //     img.onload = () => ctx.drawImage(img, 0, 0, width, height)

        //     webSocketRef.current.onmessage = e => {
        //         setIsConnected(true)
        //         const blob = new Blob([e.data], { type: "image/png"});
        //         img.src = URL.createObjectURL(blob)
        //     };
        //     webSocketRef.current.onerror = e => {
        //         setIsConnected(false)
        //     }

        // }
        if(videoElemRef.current) {
            const video = videoElemRef.current;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                // Safari supports HLS natively
                video.src = url;
            } else if (Hls.isSupported()) {
                hlsRef.current = new Hls();
                const hls = hlsRef.current;
                try {
                    hls.loadSource(url);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.ERROR, () => {
                        setTimeout(() => {
                            if(hlsRef.current) {
                                console.log('destroying camera stream')
                                hlsRef.current.destroy();
                            }
                            init();
                        }, 5000)
                    })
                    hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());

                }catch {
                    console.log(11)
                }
            } else {
                alert("HLS not supported in this browser");
            }
        }
    }, [url]) 

    useEffect(() => {
        init()

        return () => {
            if(hlsRef.current) {
                console.log('destroying camera stream')
                hlsRef.current.destroy();
            }
        }
    },[init])
    
    // const toggleStream = () => {
    //     if(videoElemRef.current) {
    //         videoElemRef.current.close();
    //         videoElemRef.current = null;
    //         setIsConnected(false)
    //     } else {
    //         init();
    //     }
    // }
    return (
        <>
            {/* <button onClick={toggleStream}>{isConnected ? "Close" : "Open"}</button> */}
            <video ref={videoElemRef} style={{ height, width}} onError={() => console.log(11)}></video>
        </>
    )
}