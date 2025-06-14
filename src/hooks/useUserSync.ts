// src/hooks/useUserSync.ts
import { useEffect, useState, useRef, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { usersApi, User } from "../api/users";

// Глобальний стан для всіх екземплярів хука
const globalState = {
  processedUsers: new Set<string>(),
  activeRequests: new Map<string, Promise<User>>(),
};

export const useUserSync = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref для відстеження поточного користувача
  const currentUserIdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);

  // Функція для синхронізації користувача
  const syncUser = useCallback(
    async (clerkUserId: string, clerkUserData: any) => {
      // Перевіряємо, чи вже обробляємо цього користувача глобально
      if (globalState.processedUsers.has(clerkUserId)) {
        console.log("User already processed globally:", clerkUserId);
        const existingUser = await usersApi.getUserByClerkId(clerkUserId);
        if (existingUser && mountedRef.current) {
          setDbUser(existingUser);
        }
        return;
      }

      // Перевіряємо активні запити
      if (globalState.activeRequests.has(clerkUserId)) {
        console.log("Request already active for user:", clerkUserId);
        try {
          const user = await globalState.activeRequests.get(clerkUserId)!;
          if (mountedRef.current) {
            setDbUser(user);
          }
        } catch (err) {
          console.error("Error waiting for active request:", err);
        }
        return;
      }

      if (!mountedRef.current) return;

      setLoading(true);
      setError(null);

      // Створюємо запит на синхронізацію
      const syncRequest = (async () => {
        try {
          console.log("Starting user sync for:", clerkUserId);

          // Спочатку перевіряємо, чи існує користувач
          let existingUser = await usersApi.getUserByClerkId(clerkUserId);

          if (!existingUser) {
            // Створюємо користувача
            console.log("Creating new user:", clerkUserId);
            existingUser = await usersApi.createUser({
              clerkId: clerkUserId,
              email: clerkUserData.primaryEmailAddress?.emailAddress || "",
              firstName: clerkUserData.firstName || "",
              username: clerkUserData.username || "",
              address: "",
              phone: "",
              points: 0,
            });
          }

          // Позначаємо користувача як оброблено
          globalState.processedUsers.add(clerkUserId);

          console.log("User sync completed:", existingUser);
          return existingUser;
        } catch (err) {
          console.error("Error in user sync:", err);
          throw err;
        }
      })();

      // Зберігаємо активний запит
      globalState.activeRequests.set(clerkUserId, syncRequest);

      try {
        const user = await syncRequest;
        if (mountedRef.current) {
          setDbUser(user);
        }
      } catch (err) {
        console.error("Error syncing user:", err);
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        // Очищаємо активний запит
        globalState.activeRequests.delete(clerkUserId);
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    []
  );

  // Основний effect для синхронізації
  useEffect(() => {
    if (!isLoaded || !clerkUser) {
      if (currentUserIdRef.current !== null) {
        // Користувач вийшов з акаунту
        setDbUser(null);
        setError(null);
        currentUserIdRef.current = null;
      }
      return;
    }

    // Перевіряємо, чи змінився користувач
    if (currentUserIdRef.current === clerkUser.id) {
      return; // Той же користувач, нічого не робимо
    }

    console.log("User changed, syncing:", clerkUser.id);
    currentUserIdRef.current = clerkUser.id;
    syncUser(clerkUser.id, clerkUser);
  }, [clerkUser?.id, isLoaded, syncUser]);

  // Cleanup при unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Функція для оновлення профілю
  const updateUserProfile = async (updates: {
    address?: string;
    phone?: string;
  }) => {
    if (!clerkUser || !dbUser) return null;

    setLoading(true);
    try {
      const updatedUser = await usersApi.updateUser(clerkUser.id, updates);
      setDbUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error("Error updating user profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    clerkUser,
    dbUser,
    loading,
    error,
    updateUserProfile,
    isAuthenticated: !!clerkUser && !!dbUser,
  };
};
