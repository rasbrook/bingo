import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { SupabaseHost } from "../../supabase.js";
import { useAuthStore } from "../store/authstore.js";

const Home = () => {
    const { userId, logout } = useAuthStore();
    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [reloadKey, setReloadKey] = useState(0);
    const navigate = useNavigate();
    const hasUserId = userId !== null && userId !== undefined && String(userId).trim() !== "";

    useEffect(() => {
        if (!hasUserId) {
            logout();
            return;
        }

        let isActive = true;

        const loadProfile = async () => {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const { data, error } = await SupabaseHost
                    .from("User")
                    .select("id, username, balance")
                    .eq("id", userId)
                    .maybeSingle();

                if (error) {
                    throw error;
                }

                if (!data) {
                    logout();
                    navigate("/signin", { replace: true });
                    return;
                }

                if (isActive) {
                    setProfile(data);
                    setUsername(data.username ?? "");
                }
            } catch (error) {
                if (isActive) {
                    setErrorMessage(
                        error instanceof Error ? error.message : "Could not load your profile."
                    );
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            isActive = false;
        };
    }, [hasUserId, logout, navigate, reloadKey, userId]);

    if (!hasUserId) {
        return <Navigate to="/signin" replace />;
    }

    const handleLogout = () => {
        logout();
        navigate("/signin", { replace: true });
    };

    const handleSave = async (event) => {
        event.preventDefault();
        const updatedUsername = username.trim();

        if (updatedUsername.length < 3 || updatedUsername.length > 32) {
            setErrorMessage("Username must be between 3 and 32 characters.");
            return;
        }

        if (newPassword !== "" && newPassword.length < 6) {
            setErrorMessage("A new password must be at least 6 characters.");
            return;
        }

        setIsSaving(true);
        setErrorMessage("");

        try {
            const updates = { username: updatedUsername };
            if (newPassword !== "") {
                updates.password = newPassword;
            }

            const { data, error } = await SupabaseHost
                .from("User")
                .update(updates)
                .eq("id", userId)
                .select("id, username, balance")
                .single();

            if (error) {
                throw error;
            }

            setProfile(data);
            setUsername(data.username ?? "");
            setNewPassword("");
            setIsEditing(false);
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Could not save your profile."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setUsername(profile?.username ?? "");
        setNewPassword("");
        setErrorMessage("");
        setIsEditing(false);
    };

    return (
        <main style={styles.main}>
            <h1>My profile</h1>

            {isLoading ? (
                <p role="status">Loading your profile...</p>
            ) : errorMessage && !profile ? (
                <div>
                    <p role="alert">{errorMessage}</p>
                    <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
                        Try again
                    </button>
                </div>
            ) : profile ? (
                <section style={styles.profile}>
                    {isEditing ? (
                        <form onSubmit={handleSave}>
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                autoComplete="username"
                                minLength={3}
                                maxLength={32}
                                required
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                disabled={isSaving}
                            />
                            <label htmlFor="new-password">New password</label>
                            <input
                                id="new-password"
                                type="password"
                                autoComplete="new-password"
                                minLength={6}
                                placeholder="Leave blank to keep your current password"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                disabled={isSaving}
                            />
                            {errorMessage && <p role="alert">{errorMessage}</p>}
                            <div style={styles.actions}>
                                <button type="submit" disabled={isSaving}>
                                    {isSaving ? "Saving..." : "Save changes"}
                                </button>
                                <button type="button" onClick={handleCancelEdit} disabled={isSaving}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <p><strong>Username:</strong> {profile.username}</p>
                            <p><strong>Balance:</strong> {profile.balance ?? "—"} Ugandan Shillings (UGX)</p>
                            {errorMessage && <p role="alert">{errorMessage}</p>}
                            <button type="button" onClick={() => setIsEditing(true)}>
                                Edit profile
                            </button>
                        </>
                    )}
                </section>
            ) : null}

            <button type="button" onClick={handleLogout}>Log out</button>
        </main>
    );
};

const styles = {
    main: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 24,
        boxSizing: "border-box",
    },
    profile: {
        width: "min(400px, 100%)",
        marginBottom: 16,
    },
    actions: {
        display: "flex",
        gap: 8,
        marginTop: 12,
    },
};

export default Home;
