import { defineSchema } from "convex/server";
import { usersTable } from "./schema/users";
import { projectsTable, projectMessagesTable } from "./schema/projects";
import { waitlistTable } from "./schema/waitlist";

export default defineSchema({
  users: usersTable,
  waitlist: waitlistTable,
  projects: projectsTable,
  projectMessages: projectMessagesTable,
});
