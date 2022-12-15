import React, {useEffect, useState} from 'react'
import { WebView } from 'react-native-webview'
import { WebViewMessageEvent } from "react-native-webview/lib/WebViewTypes";
import {TypedOwnable} from "../interfaces/TypedOwnable";
import OwnableService from "../services/Ownable.service";

export default function OwnableRunner(props: {ownable: TypedOwnable}): JSX.Element {
    const { ownable } = props

    let webView: WebView
    const [js, setJs] = useState<string|undefined>()

    useEffect(() => {
        OwnableService.getJs(ownable.option.id).then(setJs)
    }, [])

    useEffect(() => {
        if (js) load()
    }, [js])

    const load = async () => {
        const wasm = await OwnableService.getWasm(ownable.option.id)

        // TODO get event chain and generate calls based on events

        const calls = [
            `init("${wasm}").then(resp => { self.postMessage({ success: true, msg: "WASM instantiated successfully" }) });`,
            `execute_contract(e.data.msg, e.data.info, e.data.ownable_id, e.data.idb)`
        ]

        webView.injectJavaScript(calls.join('\n'))
    }

    const handleMessage = (event: WebViewMessageEvent) => {
        const message = event.nativeEvent.data
        console.log('message from webview:', message)
    }

    return (
        <WebView
            ref={el => { webView = el as WebView } }
            source={{html: `<html><body><script type="application/javascript">${js}</script></body></html>`}}
            onMessage={handleMessage}
        />
    )
}
