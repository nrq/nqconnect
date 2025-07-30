
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { allUsers as initialUsers } from "@/lib/data";
import { User } from "@/lib/types";
import { Loader2, MoreVertical, ShieldCheck, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";
import { suspendUser, deleteUserById } from "@/app/actions";


export function AdminPanel() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState<string | null>(null); // To track loading state by user ID
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleSuspend = async (user: User) => {
    setIsLoading(user.id);
    const result = await suspendUser(user.id, user.status);
    if (result.success) {
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === user.id ? { ...u, status: result.newStatus as 'active' | 'suspended' } : u
        )
      );
      toast({
        title: "User Updated",
        description: `User ${user.name} has been ${result.newStatus}.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user status.",
      });
    }
    setIsLoading(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setIsLoading(selectedUser.id);
    const result = await deleteUserById(selectedUser.id);

    if (result.success) {
      setUsers(prevUsers => prevUsers.filter(u => u.id !== selectedUser.id));
      toast({
        title: "User Deleted",
        description: `User ${selectedUser.name} has been deleted.`,
      });
    } else {
        toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user.",
      });
    }
    setIsLoading(null);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };


  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-headline font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">User Management</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Storage</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                        {user.role === 'admin' ? <ShieldCheck className="mr-1 h-3 w-3"/> : <UserCircle className="mr-1 h-3 w-3" />}
                        {user.role}
                    </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'secondary' : 'destructive'} className="capitalize">
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.storage.used}MB / {user.storage.total}MB
                </TableCell>
                <TableCell className="text-right">
                  {isLoading === user.id ? (
                    <Loader2 className="h-5 w-5 animate-spin ml-auto" />
                  ) : user.role !== 'admin' ? (
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSuspend(user)}>
                          {user.status === 'active' ? 'Suspend' : 'Un-suspend'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(user)}
                          className="text-destructive focus:text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedUser?.name}'s account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes, delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
