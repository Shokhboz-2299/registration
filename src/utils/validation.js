function isValidDate(dateString = '') {
    const regEx = /^\d{4}-\d{2}-\d{2}$/

    if(!dateString.match(regEx)) return false

    const date = new Date(dateString)

    const dateNumber = date.getTime()
    if(!dateNumber && dateNumber !== 0) return false

    return date.toISOString().slice(0, 10) === dateString
}


module.exports = {
    isValidDate
}