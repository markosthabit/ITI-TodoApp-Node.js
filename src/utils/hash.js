const { createHash } = require('node:crypto')

function hash(input) {
    return createHash('sha256').update(input).digest('hex')

}