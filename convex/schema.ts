import { defineSchema } from "convex/server";
import { usersTable } from "./schema/users";
import { projectsTable, projectMessagesTable } from "./schema/projects";
import { waitlistTable } from "./schema/waitlist";
import { teamMembersTable, teamInvitesTable } from "./schema/teamMembers";

export default defineSchema({
  users: usersTable,
  waitlist: waitlistTable,
  projects: projectsTable,
  projectMessages: projectMessagesTable,
  teamMembers: teamMembersTable,
  teamInvites: teamInvitesTable,
});
