const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
const SESSION_KEY = "yscmt_portal_supabase_session";

export type PortalIdentity = {
  user_id: string;
  role: "student" | "instructor" | "admin";
  email: string;
  full_name: string;
  phone: string;
};

export type PortalLesson = {
  id: string;
  title: string;
  content: string;
  video_url: string;
  sort_order: number;
  completed_at: string | null;
};

export type PortalCourse = {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  fee_amount: number | null;
  fee_currency: string | null;
  enrollment_status: string | null;
};

type PortalSession = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
};

function ensureConfigured() {
  if (!SUPABASE_URL.startsWith("https://") || !SUPABASE_KEY) {
    throw new Error(
      "Portal setup is incomplete. Configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
    );
  }
}

function saveSession(session: Record<string, unknown>) {
  const accessToken = String(session.access_token || "");
  const refreshToken = String(session.refresh_token || "");
  const expiresIn = Number(session.expires_in || 3600);
  if (!accessToken || !refreshToken) {
    throw new Error("Supabase did not return a valid login session.");
  }
  const normalized: PortalSession = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: Date.now() + expiresIn * 1000,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
  return normalized;
}

function readSession(): PortalSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as PortalSession;
    if (!value.access_token || !value.refresh_token || !value.expires_at) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return value;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

async function authRequest(path: string, body: Record<string, unknown>) {
  ensureConfigured();
  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      typeof data.msg === "string"
        ? data.msg
        : typeof data.message === "string"
          ? data.message
          : "Authentication failed. Check your email and password.",
    );
  }
  return data as Record<string, unknown>;
}

export async function signIn(email: string, password: string) {
  const result = await authRequest("token?grant_type=password", {
    email: email.trim(),
    password,
  });
  saveSession(result);
  return getMyIdentity();
}

export async function getAccessToken(): Promise<string> {
  ensureConfigured();
  const session = readSession();
  if (!session) throw new Error("Please sign in to continue.");
  if (session.expires_at > Date.now() + 60_000) return session.access_token;

  const refreshed = await authRequest("token?grant_type=refresh_token", {
    refresh_token: session.refresh_token,
  });
  return saveSession(refreshed).access_token;
}

async function rpc<T>(name: string, payload: Record<string, unknown> = {}): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  if (response.status === 401) {
    localStorage.removeItem(SESSION_KEY);
    throw new Error("Your session has expired. Please sign in again.");
  }
  if (!response.ok) {
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "The portal could not complete this request.";
    throw new Error(message);
  }
  return data as T;
}

export async function getMyIdentity() {
  const rows = await rpc<PortalIdentity[]>("portal_get_my_identity");
  if (!Array.isArray(rows) || rows.length !== 1 || !rows[0]?.user_id) {
    throw new Error("This account has no YSCMT Portal role assigned.");
  }
  return rows[0];
}

export async function listCourses() {
  const rows = await rpc<PortalCourse[]>("portal_list_courses");
  return Array.isArray(rows) ? rows : [];
}

export async function listCourseLessons(courseId: string) {
  const rows = await rpc<PortalLesson[]>("portal_get_course_lessons", {
    p_course_id: courseId,
  });
  return Array.isArray(rows) ? rows : [];
}

export async function createEnrollment(courseId: string) {
  const rows = await rpc<Array<{
    id: string;
    course_id: string;
    status: string;
    enrolled_at: string;
  }>>("portal_create_enrollment", { p_course_id: courseId });
  if (!Array.isArray(rows) || rows.length !== 1) {
    throw new Error("The course enrolment could not be created.");
  }
  return rows[0];
}

export async function signOut() {
  const session = readSession();
  if (session?.access_token && SUPABASE_URL && SUPABASE_KEY) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${session.access_token}`,
      },
    }).catch(() => undefined);
  }
  localStorage.removeItem(SESSION_KEY);
}

export function hasPortalConfiguration() {
  return SUPABASE_URL.startsWith("https://") && Boolean(SUPABASE_KEY);
}
