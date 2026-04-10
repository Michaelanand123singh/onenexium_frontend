import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  UserPlus,
  Crown,
  Pencil,
  Eye,
  MoreHorizontal,
  Trash2,
  ChevronDown,
  Mail,
  Users,
  Copy,
  Check,
} from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";

type TeamRole = "owner" | "editor" | "viewer";

const ROLE_CONFIG: Record<TeamRole, { label: string; icon: typeof Crown; color: string; bgColor: string; borderColor: string }> = {
  owner: {
    label: "Owner",
    icon: Crown,
    color: "text-foreground",
    bgColor: "bg-foreground/10",
    borderColor: "border-foreground/15",
  },
  editor: {
    label: "Editor",
    icon: Pencil,
    color: "text-foreground/70",
    bgColor: "bg-foreground/5",
    borderColor: "border-foreground/10",
  },
  viewer: {
    label: "Viewer",
    icon: Eye,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    borderColor: "border-border",
  },
};

function RoleBadge({ role }: { role: TeamRole }) {
  const config = ROLE_CONFIG[role];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${config.bgColor} ${config.color} ${config.borderColor}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function AvatarCircle({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeClass = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";

  return (
    <div
      className={`${sizeClass} rounded-full bg-foreground text-background flex items-center justify-center font-bold shrink-0`}
    >
      {initials || "U"}
    </div>
  );
}

function MemberRow({
  name,
  email,
  role,
  isOwner,
  canManage,
  onChangeRole,
  onRemove,
}: {
  name: string;
  email: string;
  role: TeamRole;
  isOwner: boolean;
  canManage: boolean;
  onChangeRole?: (role: "editor" | "viewer") => void;
  onRemove?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-accent/30 transition-colors group">
      <AvatarCircle name={name} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{name}</p>
        <p className="text-xs text-muted-foreground truncate">{email}</p>
      </div>
      <RoleBadge role={role} />

      {canManage && !isOwner && (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 z-50 w-44 bg-popover rounded-xl border border-border shadow-lg py-1">
                {role !== "editor" && onChangeRole && (
                  <button
                    onClick={() => {
                      onChangeRole("editor");
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/70 hover:bg-accent transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Make Editor
                  </button>
                )}
                {role !== "viewer" && onChangeRole && (
                  <button
                    onClick={() => {
                      onChangeRole("viewer");
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/70 hover:bg-accent transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Make Viewer
                  </button>
                )}
                {onRemove && (
                  <button
                    onClick={() => {
                      onRemove();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function InviteRow({
  email,
  role,
  canCancel,
  onCancel,
}: {
  email: string;
  role: "editor" | "viewer";
  canCancel: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-accent/30 transition-colors group">
      <div className="w-9 h-9 rounded-full bg-foreground/10 border border-dashed border-foreground/20 flex items-center justify-center shrink-0">
        <Mail className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{email}</p>
        <p className="text-xs text-muted-foreground">Pending invite</p>
      </div>
      <RoleBadge role={role} />
      {canCancel && (
        <button
          onClick={onCancel}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          title="Cancel invite"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default function TeamDialog({
  projectId,
  projectName,
  onClose,
}: {
  projectId: Id<"projects">;
  projectName: string;
  onClose: () => void;
}) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("editor");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const teamData = useQuery(api.teamMembers.listMembers, { projectId });
  const pendingInvites = useQuery(api.teamMembers.listPendingInvites, {
    projectId,
  });

  const inviteByEmail = useMutation(api.teamMembers.inviteByEmail);
  const removeMember = useMutation(api.teamMembers.removeMember);
  const updateRole = useMutation(api.teamMembers.updateMemberRole);
  const cancelInvite = useMutation(api.teamMembers.cancelInvite);

  const canManage =
    teamData?.isOwner ||
    teamData?.currentUserRole === "owner" ||
    teamData?.currentUserRole === "editor";

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSending(true);
    try {
      await inviteByEmail({
        projectId,
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      toast.success(`Invite sent to ${inviteEmail.trim()}`);
      setInviteEmail("");
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to send invite");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleRemove = async (memberId: Id<"teamMembers">) => {
    try {
      await removeMember({ projectId, memberId });
      toast.success("Member removed");
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to remove member");
      }
    }
  };

  const handleRoleChange = async (
    memberId: Id<"teamMembers">,
    role: "editor" | "viewer"
  ) => {
    try {
      await updateRole({ memberId, role });
      toast.success("Role updated");
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to update role");
      }
    }
  };

  const handleCancelInvite = async (inviteId: Id<"teamInvites">) => {
    try {
      await cancelInvite({ inviteId });
      toast.success("Invite cancelled");
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to cancel invite");
      }
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/project/${projectId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const totalMembers =
    1 + (teamData?.members.length ?? 0); // +1 for owner

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative bg-background rounded-3xl border border-border shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Share {"'"}{projectName}{"'"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {totalMembers} member{totalMembers !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invite section */}
        {canManage && (
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleInvite();
                  }}
                  placeholder="Invite by email..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-foreground/30 transition-colors"
                />
              </div>

              {/* Role dropdown */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="h-10 px-3 rounded-xl border border-border bg-card text-sm font-medium text-foreground flex items-center gap-1.5 hover:bg-accent transition-colors cursor-pointer"
                >
                  {inviteRole === "editor" ? "Editor" : "Viewer"}
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                {roleDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setRoleDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-11 z-50 w-36 bg-popover rounded-xl border border-border shadow-lg py-1">
                      <button
                        onClick={() => {
                          setInviteRole("editor");
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer ${inviteRole === "editor" ? "bg-accent text-foreground" : "text-foreground/70 hover:bg-accent"}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editor
                      </button>
                      <button
                        onClick={() => {
                          setInviteRole("viewer");
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer ${inviteRole === "viewer" ? "bg-accent text-foreground" : "text-foreground/70 hover:bg-accent"}`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Viewer
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handleInvite}
                disabled={isSending || !inviteEmail.trim()}
                className="h-10 px-4 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                Invite
              </button>
            </div>
          </div>
        )}

        {/* Members list */}
        <div className="border-t border-border max-h-72 overflow-y-auto">
          {teamData === undefined ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Owner */}
              {teamData.owner && (
                <MemberRow
                  name={teamData.owner.name}
                  email={teamData.owner.email}
                  role="owner"
                  isOwner={true}
                  canManage={false}
                />
              )}

              {/* Team members */}
              {teamData.members.map((member) => (
                <MemberRow
                  key={member._id}
                  name={member.name}
                  email={member.email}
                  role={member.role as TeamRole}
                  isOwner={false}
                  canManage={!!canManage}
                  onChangeRole={(role) => handleRoleChange(member._id, role)}
                  onRemove={() => handleRemove(member._id)}
                />
              ))}

              {/* Pending invites */}
              {pendingInvites && pendingInvites.length > 0 && (
                <>
                  <div className="px-4 pt-3 pb-1">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Pending Invites
                    </p>
                  </div>
                  {pendingInvites.map((invite) => (
                    <InviteRow
                      key={invite._id}
                      email={invite.email}
                      role={invite.role}
                      canCancel={!!canManage}
                      onCancel={() => handleCancelInvite(invite._id)}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleCopyLink}
            className="h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-foreground" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied!" : "Copy link"}
          </button>
          <button
            onClick={onClose}
            className="h-8 px-4 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}
