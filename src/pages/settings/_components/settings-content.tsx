import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { ConvexError } from "convex/values";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { toast } from "sonner";
import { motion } from "motion/react";
import {
  User,
  Shield,
  Trash2,
  Save,
  Mail,
  LogOut,
  Users,
  Send,
  Check,
  X,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { useAuth } from "@/hooks/use-auth.ts";

export default function SettingsContent() {
  const navigate = useNavigate();
  const user = useQuery(api.users.getCurrentUser, {});
  const updateProfile = useMutation(api.users.updateProfile);
  const deleteAccount = useMutation(api.users.deleteAccount);
  const projects = useQuery(api.projects.listByUser, {});
  const myInvites = useQuery(api.teamMembers.listMyInvites, {});
  const inviteByEmail = useMutation(api.teamMembers.inviteByEmail);
  const acceptInvite = useMutation(api.teamMembers.acceptInvite);
  const declineInvite = useMutation(api.teamMembers.declineInvite);
  const { removeUser } = useAuth();

  const [name, setName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Team invite state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("viewer");
  const [inviteProject, setInviteProject] = useState<string>("");
  const [sending, setSending] = useState(false);

  if (user === undefined) {
    return (
      <div className="p-6 lg:p-10 max-w-2xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
      </div>
    );
  }

  const displayName = name ?? user?.name ?? "";

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name: displayName });
      toast.success("Profile updated");
      setName(null);
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      toast.success("Account deleted");
      await removeUser();
      navigate("/");
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to delete account");
      }
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const hasChanges = name !== null && name !== (user?.name ?? "");

  const handleSendInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    if (!inviteProject) {
      toast.error("Please select a project");
      return;
    }
    setSending(true);
    try {
      await inviteByEmail({
        projectId: inviteProject as Id<"projects">,
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      toast.success(`Invite sent to ${inviteEmail.trim()}`);
      setInviteEmail("");
      setInviteRole("viewer");
      setInviteProject("");
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to send invite");
      }
    } finally {
      setSending(false);
    }
  };

  const handleAcceptInvite = async (inviteId: Id<"teamInvites">) => {
    try {
      await acceptInvite({ inviteId });
      toast.success("Invite accepted! You now have access to the project.");
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to accept invite");
      }
    }
  };

  const handleDeclineInvite = async (inviteId: Id<"teamInvites">) => {
    try {
      await declineInvite({ inviteId });
      toast.success("Invite declined");
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to decline invite");
      }
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-10"
      >
        <div>
          <h1 className="text-3xl font-medium tracking-tight">
            {"Settings".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: 0.1 + i * 0.03,
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mt-1"
          >
            Manage your account and preferences
          </motion.p>
        </div>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Content */}
      <div className="space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-card rounded-3xl border border-border p-8 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold">Profile</h2>
          </div>

          <div className="space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-foreground text-background flex items-center justify-center font-bold text-xl">
                {(user?.name ?? "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{user?.name ?? "User"}</p>
                <p className="text-sm text-muted-foreground">
                  {user?.email ?? "No email"}
                </p>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="rounded-xl"
              />
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {user?.email ?? "No email on file"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Email is managed through your login provider
              </p>
            </div>
          </div>
        </motion.div>

        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="bg-card rounded-3xl border border-border p-8 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold">Account</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sign out</p>
                <p className="text-xs text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="rounded-xl"
                onClick={async () => {
                  await removeUser();
                  navigate("/");
                }}
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Sign out
              </Button>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-destructive">
                  Delete account
                </p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="rounded-xl">
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete account?</DialogTitle>
                    <DialogDescription>
                      This will permanently delete your account, all your
                      projects, and data. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="secondary"
                      onClick={() => setDeleteOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete permanently"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>

        {/* Team Invitations Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="bg-card rounded-3xl border border-border p-8 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold">Team Invitations</h2>
          </div>

          {/* Pending invites received */}
          {myInvites && myInvites.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Pending invitations for you</p>
              <div className="space-y-3">
                {myInvites.map((invite) => (
                  <div
                    key={invite._id}
                    className="flex items-center justify-between rounded-xl border border-border p-4 bg-background"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {invite.projectName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Invited by {invite.inviterName} as{" "}
                          <span className="capitalize">{invite.role}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <Button
                        size="sm"
                        className="rounded-xl h-8"
                        onClick={() => handleAcceptInvite(invite._id)}
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Accept
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-xl h-8"
                        onClick={() => handleDeclineInvite(invite._id)}
                      >
                        <X className="w-3.5 h-3.5 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Send invite form */}
          <div>
            <p className="text-sm font-medium mb-3">Invite a team member</p>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Project</Label>
                  <Select value={inviteProject} onValueChange={setInviteProject}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects?.map((project) => (
                        <SelectItem key={project._id} value={project._id}>
                          {project.name}
                        </SelectItem>
                      ))}
                      {(!projects || projects.length === 0) && (
                        <SelectItem value="none" disabled>
                          No projects yet
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as "editor" | "viewer")}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleSendInvite}
                disabled={sending || !inviteEmail.trim() || !inviteProject}
                className="rounded-xl w-full cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {sending ? "Sending..." : "Send Invite"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
