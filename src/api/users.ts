// src/api/users.ts
export interface User {
  id: string; // Це буде MockAPI ID (не Clerk ID!)
  clerkId: string; // Додаємо окреме поле для Clerk ID
  email: string;
  firstName: string;
  username: string;
  address: string;
  phone: string;
  points: number;
  createdAt: string;
}

export interface CreateUserData {
  clerkId: string; // Змінюємо id на clerkId
  email: string;
  firstName: string;
  username: string;
  address?: string;
  phone?: string;
  points?: number;
}

const API_URL = process.env.REACT_APP_SERVER_URL;

// Кеш для уникнення повторних запитів
const userCache = new Map<string, User>();
const pendingRequests = new Map<string, Promise<User>>();

export const usersApi = {
  async createUser(userData: CreateUserData): Promise<User> {
    // Перевіряємо кеш
    if (userCache.has(userData.clerkId)) {
      console.log("User found in cache:", userCache.get(userData.clerkId));
      return userCache.get(userData.clerkId)!;
    }

    // Перевіряємо, чи вже є запит в процесі
    if (pendingRequests.has(userData.clerkId)) {
      console.log("Request already pending for user:", userData.clerkId);
      return pendingRequests.get(userData.clerkId)!;
    }

    // Спочатку перевіряємо, чи користувач вже існує
    console.log("Checking if user exists:", userData.clerkId);
    const existingUser = await this.getUserByClerkId(userData.clerkId);
    if (existingUser) {
      console.log("User already exists in database:", existingUser);
      userCache.set(userData.clerkId, existingUser);
      return existingUser;
    }

    // Створюємо запит на створення користувача
    const createRequest = fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerkId: userData.clerkId,
        email: userData.email,
        firstName: userData.firstName,
        username: userData.username,
        address: userData.address || "",
        phone: userData.phone || "",
        points: userData.points || 0,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to create user");
        }
        const newUser = await response.json();
        console.log("User created successfully:", newUser);

        // Додаємо в кеш
        userCache.set(userData.clerkId, newUser);

        return newUser;
      })
      .finally(() => {
        // Видаляємо з pending requests
        pendingRequests.delete(userData.clerkId);
      });

    // Зберігаємо pending request
    pendingRequests.set(userData.clerkId, createRequest);

    return createRequest;
  },

  // Оптимізований метод для пошуку користувача за Clerk ID
  async getUserByClerkId(clerkId: string): Promise<User | null> {
    try {
      // Перевіряємо кеш
      if (userCache.has(clerkId)) {
        return userCache.get(clerkId)!;
      }

      console.log("Fetching user from API:", clerkId);

      // MockAPI підтримує фільтрацію через query параметри
      const response = await fetch(`${API_URL}/users?clerkId=${clerkId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const users = await response.json();
      const user = users.length > 0 ? users[0] : null;

      // Зберігаємо в кеші
      if (user) {
        userCache.set(clerkId, user);
      }

      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },

  // Залишаємо старий метод для зворотної сумісності
  async getUserById(clerkId: string): Promise<User | null> {
    return this.getUserByClerkId(clerkId);
  },

  // Оновити користувача
  async updateUser(clerkId: string, updates: Partial<User>): Promise<User> {
    const existingUser = await this.getUserByClerkId(clerkId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    const response = await fetch(`${API_URL}/users/${existingUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...existingUser,
        ...updates,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    const updatedUser = await response.json();

    // Оновлюємо кеш
    userCache.set(clerkId, updatedUser);

    return updatedUser;
  },

  // Додати бали користувачу
  async addPoints(clerkId: string, pointsToAdd: number): Promise<User> {
    const user = await this.getUserByClerkId(clerkId);
    if (!user) {
      throw new Error("User not found");
    }

    return this.updateUser(clerkId, {
      points: user.points + pointsToAdd,
    });
  },

  // Метод для очищення кешу (корисно для розробки)
  clearCache() {
    userCache.clear();
    console.log("User cache cleared");
  },
};
