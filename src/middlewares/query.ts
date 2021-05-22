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
