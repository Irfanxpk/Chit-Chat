const genarateMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

const genarateLocationMessage = (url) => {
    return {
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    genarateMessage,
    genarateLocationMessage,
}