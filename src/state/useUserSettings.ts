import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";

interface UserState {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  removeUser: (id: string) => void;
  setUsers: (users: User[]) => void;
  resetUsers: () => void;
}

const DEFAULT_USERS: User[] = [];

export const useUserSettings = create<UserState>()(
  persist(
    (set) => ({
      users: DEFAULT_USERS,
      addUser: (user) =>
        set((state) => ({
          users: [...state.users, user],
        })),
      updateUser: (id, data) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...data } : user
          ),
        })),
      removeUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),
      setUsers: (users) => set({ users }),
      resetUsers: () => set({ users: DEFAULT_USERS }),
    }),
    {
      name: "foamboss-user-settings",
    }
  )
);


