/**
 * ntfy notification service for Veedibox
 * Service URL: https://ntfy.feendesk.com
 */

const NTFY_BASE_URL = process.env.NEXT_PUBLIC_NTFY_URL || "https://ntfy.feendesk.com";

interface NotificationOptions {
  title?: string;
  priority?: 1 | 2 | 3 | 4 | 5;
  tags?: string[];
  clickUrl?: string;
}

/**
 * Sends a notification to a specific ntfy topic.
 */
export const sendNotification = async (topic: string, message: string, options: NotificationOptions = {}) => {
  const { title, priority = 3, tags = [], clickUrl } = options;

  const username = process.env.NEXT_PUBLIC_NTFY_USERNAME;
  const password = process.env.NEXT_PUBLIC_NTFY_PASSWORD;

  console.log("ntfy Debug - Base URL:", NTFY_BASE_URL);
  console.log("ntfy Debug - Auth check:", { 
    hasUsername: !!username, 
    hasPassword: !!password,
    topic 
  });

  const headers: Record<string, string> = {
    "Priority": priority.toString(),
  };

  if (title) headers["Title"] = title;
  if (tags.length > 0) headers["Tags"] = tags.join(",");
  if (clickUrl) headers["Click"] = clickUrl;
  
  if (username && password) {
    const token = btoa(unescape(encodeURIComponent(`${username}:${password}`)));
    headers["Authorization"] = `Basic ${token}`;
    console.log("ntfy Debug - Sending auth for user:", username);
    console.log("ntfy Debug - Password length:", password.length);
  } else {
    console.warn("ntfy Debug - No credentials found! username:", username, "password:", password);
  }

  try {
    const response = await fetch(`${NTFY_BASE_URL}/${topic}`, {
      method: "POST",
      body: message,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ntfy error [${response.status}]:`, errorText);
      throw new Error(`Failed to send notification: ${response.status} ${response.statusText}`);
    }

    try {
      return await response.json();
    } catch {
      // ntfy often returns plain text on успеха too
      return { success: true };
    }
  } catch (error) {
    console.error("ntfy error:", error);
    return null;
  }
};

/**
 * Returns the public subscription URL for a topic.
 */
export const getSubscriptionUrl = (topic: string) => {
  return `${NTFY_BASE_URL}/${topic}`;
};
