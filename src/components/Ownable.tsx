import React, {useEffect, useState} from 'react'
import { WebView } from 'react-native-webview'
import {WebViewErrorEvent, WebViewMessageEvent} from "react-native-webview/lib/WebViewTypes"
import {TypedOwnable} from "../interfaces/TypedOwnable"
import OwnableService from "../services/Ownable.service"

export default function Ownable(props: {ownable: TypedOwnable}): JSX.Element {
    const { ownable } = props

    let webView: WebView
    const [js, setJs] = useState<string|undefined>()

    useEffect(() => {
        OwnableService.getHTML(ownable.option.id).then(setJs)
    }, [])

    useEffect(() => {
        if (js) load()
    }, [js])

    const load = async () => {
        const wasm = await OwnableService.getWasm(ownable.option.id)
        // TODO get event chain and generate calls based on events

        // initialization
        // this wasm should be a Response object or a promise that will fulfill with one
        const init = `try { init("${wasm}").then(resp => { window.ReactNativeWebView.postMessage("WASM instantiated successfully") }).catch(e => window.ReactNativeWebView.postMessage(e.toString())) } catch (e) { window.ReactNativeWebView.postMessage(e.toString()) }`

        const msg_info = `{"sender":"3MpuY7PRKN9XNpkHvohhmKAamE43QTqSWTb","funds":[]}`

        // instantiate
        const instantiate = `instantiate_contract({}, ${msg_info})`

        // execution
        const consume_msg = `{"consume":{"amount":12}}`
        const state_dump = `{"state_dump":[[[99,111,110,102,105,103],[123,34,111,119,110,101,114,34,58,34,51,77,112,117,89,55,80,82,75,78,57,88,78,112,107,72,118,111,104,104,109,75,65,97,109,69,52,51,81,84,113,83,87,84,98,34,44,34,105,115,115,117,101,114,34,58,34,51,77,112,117,89,55,80,82,75,78,57,88,78,112,107,72,118,111,104,104,109,75,65,97,109,69,52,51,81,84,113,83,87,84,98,34,44,34,109,97,120,95,99,97,112,97,99,105,116,121,34,58,49,48,48,44,34,99,117,114,114,101,110,116,95,97,109,111,117,110,116,34,58,49,48,48,44,34,99,111,108,111,114,34,58,34,35,49,48,55,52,49,48,34,44,34,105,109,97,103,101,34,58,110,117,108,108,44,34,105,109,97,103,101,95,100,97,116,97,34,58,110,117,108,108,44,34,101,120,116,101,114,110,97,108,95,117,114,108,34,58,110,117,108,108,44,34,100,101,115,99,114,105,112,116,105,111,110,34,58,34,79,119,110,97,98,108,101,32,112,111,116,105,111,110,32,116,104,97,116,32,99,97,110,32,98,101,32,99,111,110,115,117,109,101,100,34,44,34,110,97,109,101,34,58,34,80,111,116,105,111,110,34,44,34,98,97,99,107,103,114,111,117,110,100,95,99,111,108,111,114,34,58,110,117,108,108,44,34,97,110,105,109,97,116,105,111,110,95,117,114,108,34,58,110,117,108,108,44,34,121,111,117,116,117,98,101,95,117,114,108,34,58,110,117,108,108,125]],[[99,111,110,116,114,97,99,116,95,105,110,102,111],[123,34,99,111,110,116,114,97,99,116,34,58,34,99,114,97,116,101,115,46,105,111,58,111,119,110,97,98,108,101,45,100,101,109,111,34,44,34,118,101,114,115,105,111,110,34,58,34,48,46,49,46,48,34,125]]]}`
        // can also log the resp here
        const exec = `execute_contract(${consume_msg},${msg_info},${ownable.id},${state_dump}).then(resp => { window.ReactNativeWebView.postMessage({ success: true, msg: "WASM executed successfully" }) });`

        // deletion happens on js side

        // querying
        const query_msg = `{"get_ownable_config":{},}`
        // response contains json ownable state
        const query = `query_contract_state(${query_msg},${state_dump}).then(resp => { window.ReactNativeWebView.postMessage({ success: true, msg: "WASM queried successfully" }) })`

        const calls = [
            `void(0);`,
            //init,
            //instantiate,
            //exec,
            //query,
        ]

        webView.injectJavaScript(calls.join('\n'))
    }

    const handleMessage = (event: WebViewMessageEvent) => {
        const message = event.nativeEvent.data
        console.log('message from webview:', message)
    }

    const handleError = (event: WebViewErrorEvent) => {
        const message = event.nativeEvent.description
        console.log('error from webview:', message)
    }

    return (
        <WebView
            ref={el => { webView = el as WebView } }
            injectedJavaScriptBeforeContentLoaded={`
                window.onerror = function(message, sourcefile, lineno, colno, error) {
                  alert("Message: " + message + " - Source: " + sourcefile + " Line: " + lineno + ":" + colno);
                  return true;
                };
                true;
            `}
            source={{uri: 'file:///android_asset/ownable/index.html'}}
            onMessage={handleMessage}
            onError={handleError}
        />
    )
}
