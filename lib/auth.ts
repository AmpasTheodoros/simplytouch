import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export type AuthUser = {
  id: string;
  clerkId: string;
  email: string;
};

/**
 * Get the current authenticated user from the database
 * Creates user record if it doesn't exist (first login)
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return null;
  }

  // Try to find existing user
  let user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true, clerkId: true, email: true },
  });

  if (!user) {
    // User doesn't exist in DB, create them
    const clerkUser = await currentUser();
    if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
      return null;
    }

    user = await db.user.create({
      data: {
        clerkId,
        email: clerkUser.emailAddresses[0].emailAddress,
      },
      select: { id: true, clerkId: true, email: true },
    });
  }

  return user;
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Check if user owns a property
 */
export async function verifyPropertyOwnership(
  userId: string,
  propertyId: string
): Promise<boolean> {
  const property = await db.property.findFirst({
    where: {
      id: propertyId,
      userId,
    },
  });
  return !!property;
}

/**
 * Require property ownership - throws if not owner
 */
export async function requirePropertyOwnership(
  userId: string,
  propertyId: string
): Promise<void> {
  const isOwner = await verifyPropertyOwnership(userId, propertyId);
  if (!isOwner) {
    throw new Error("Forbidden: You don't own this property");
  }
}
