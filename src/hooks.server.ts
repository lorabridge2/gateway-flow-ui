import { env } from '$env/dynamic/private';
// import { dev } from '$app/environment';
import { Level } from "level";
export const db = new Level<string, any>(env.DBPath ?? './db', { valueEncoding: 'json' });