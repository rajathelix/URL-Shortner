const { Router } = require('express')
const {
    createCustomShortCode,
    createRandomShortCode,
    findLongUrl
} = require('../services/url-service')
const route = Router()

/**
 * POST /api/links
 * BODY
 *      links: http://xxx.xxxx/xxx/xxx
 *      ---optional:----
 *      code: xxxxx
 */
route.post('/', async (req, res) => {
    const link = req.body.link
    const code = req.body.code
    //TODO: validate link must exist
    if (!code) {
        const url = await createRandomShortCode(link)
        return res.json(url)
    }
    try {
        const url = await createCustomShortCode(code, link)
        return res.json(url)
    }
    catch (e) {
        return res.status(400).json({ error: e.message })
    }
})

/**
 * GET /api/links
 * RESPONSE
 *       link:
 */
route.get('/:code', async (req, res) => {
    const code = req.params.code
    const url = await findLongUrl(code)
    if (url) {
        return res.json(url)
    }
    else {
        return res.status(400).json({ error: 'no such shortcode exists' })
    }
})
module.exports = route