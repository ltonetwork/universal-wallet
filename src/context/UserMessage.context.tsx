import React from "react"

const MessageContext = React.createContext({} as any)

function MessageProviderWrapper(props: any) {

    const [showMessage, setShowMessage] = React.useState(false)
    const [messageInfo, setMessageInfo] = React.useState("")

    return (
        <MessageContext.Provider value={{ showMessage, setShowMessage, messageInfo, setMessageInfo }}>
            {props.children}
        </MessageContext.Provider>
    )
}

export { MessageContext, MessageProviderWrapper }