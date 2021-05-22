/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TMiddleware } from "monk"
import log from "@/logger"

export const logger: TMiddleware = context => next => (args, method) => {
    return next(args, method).then((res) => {
        if (method === "find") {
            log.info(`Found ${res.length} elements`)
        } else {
            log.info(method + ' result', res)
        }
        
        return res
    })
}

export const crashReporter: TMiddleware = context => next => (args, method) => {
    return next(args, method).catch((err) => {
        log.error('Caught an exception!', err)
        throw err
    })
}

export const wrapNonDollarUpdateMiddleware: TMiddleware = context => next => (args: any, method) => {
    const wrap = (args.options || {}).wrapNon$UpdateField
    if (typeof wrap !== 'undefined') {
        delete args.options.wrapNon$UpdateField
    }
    if (wrap !== true || !args.update) {
        return next(args, method)
    }

    if (Object.keys(args.update).some(function (k) {
        return k.indexOf('$') !== 0
    })) {
        args.update = { $set: args.update }
    }

    return next(args, method)
}

