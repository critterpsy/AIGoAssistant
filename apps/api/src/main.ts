import { buildApp } from "./app"

const app = buildApp()

console.log(`[api] ${app.name} -> ${app.status}`)
