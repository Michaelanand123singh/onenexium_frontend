import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Check, X, ArrowRight } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { useNavigate } from "react-router-dom";

export default function InviteNotifications() {
  const invites = useQuery(api.teamMembers.listMyInvites, {});
  const acceptInvite = useMutation(api.teamMembers.acceptInvite);
  const declineInvite = useMutation(api.teamMembers.declineInvite);
  const navigate = useNavigate();

  if (!invites || invites.length === 0) return null;

  const handleAccept = async (inviteId: Id<"teamInvites">, projectId: Id<"projects">) => {
    try {
      await acceptInvite({ inviteId });
      toast.success("Invite accepted! You now have access to this project.");
      navigate(`/project/${projectId}`);
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to accept invite");
      }
    }
  };

  const handleDecline = async (inviteId: Id<"teamInvites">) => {
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
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Mail className="w-4 h-4 text-primary" />
        Team Invites
        <span className="ml-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
          {invites.length}
        </span>
      </h3>
      <div className="space-y-2">
        <AnimatePresence>
          {invites.map((invite, i) => (
            <motion.div
              key={invite._id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12, height: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-border p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {invite.inviterName} invited you to{" "}
                    <span className="font-semibold">
                      {invite.projectName}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Role: <span className="capitalize font-medium">{invite.role}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 ml-[52px]">
                <button
                  onClick={() => handleAccept(invite._id, invite.projectId)}
                  className="h-8 px-3.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Accept
                </button>
                <button
                  onClick={() => handleDecline(invite._id)}
                  className="h-8 px-3.5 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Decline
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
