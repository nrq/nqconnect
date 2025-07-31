
"use client";

import { useState, useMemo } from "react";
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
import { Loader2, MoreVertical, ShieldCheck, UserCircle, Users, BarChart, MessageSquare, Database } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AdminStats({ users }: { users: User[] }) {
    const stats = useMemo(() => {
        const totalUsers = users.length;
        const activeUsers = users.filter(u => u.status === 'active').length;
        const totalStorage = users.reduce((acc, u) => acc + u.storage.total, 0);
        const usedStorage = users.reduce((acc, u) => acc + u.storage.used, 0);
        return { totalUsers, activeUsers, totalStorage, usedStorage };
    }, [users]);

    const statCards = [
        { title: "Total Users", value: stats.totalUsers, description: "All registered users", icon: Users },
        { title: "Active Users", value: stats.activeUsers, description: `${stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}% of users are active`, icon: UserCircle },
        { title: "Storage Usage", value: `${stats.usedStorage} MB`, description: `Of ${stats.totalStorage} MB total`, icon: Database },
        { title: "Reported Chats", value: 0, description: "No pending reports", icon: MessageSquare },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4">
            {statCards.map((card) => (
                 <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-xs text-muted-foreground">{card.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}


export function AdminPanel() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState<string | null>(null);
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
        <p className="text-muted-foreground">User and System Management</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <AdminStats users={users} />
        <div className="p-4">
            <h2 className="text-xl font-bold font-headline mb-2">User Management</h2>
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
                                <span className="sr-only">User Actions for {user.name}</span>
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
