/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as projectMessages from "../projectMessages.js";
import type * as projects from "../projects.js";
import type * as schema_projects from "../schema/projects.js";
import type * as schema_teamMembers from "../schema/teamMembers.js";
import type * as schema_users from "../schema/users.js";
import type * as schema_waitlist from "../schema/waitlist.js";
import type * as teamMembers from "../teamMembers.js";
import type * as users from "../users.js";
import type * as waitlist from "../waitlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  projectMessages: typeof projectMessages;
  projects: typeof projects;
  "schema/projects": typeof schema_projects;
  "schema/teamMembers": typeof schema_teamMembers;
  "schema/users": typeof schema_users;
  "schema/waitlist": typeof schema_waitlist;
  teamMembers: typeof teamMembers;
  users: typeof users;
  waitlist: typeof waitlist;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
