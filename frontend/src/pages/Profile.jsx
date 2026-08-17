import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import SavedAddressBook from "../components/SavedAddressBook";
import { useToast } from "../context/ToastContext";

function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await API.get("/auth/profile");

        const profileData = response.data.data;

        setProfile(profileData);
        setName(profileData.name || "");
      } catch (err) {
        toast.error(err.response?.data?.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [toast]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const response = await API.put("/auth/profile", {
        name,
      });

      const updatedProfile = response.data.data;

      setProfile(updatedProfile);
      setName(updatedProfile.name);

      updateUser({ ...user, name: updatedProfile.name });
      toast.success(response.data.message || "Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">

          {/* Heading */}
          <h1 className="text-3xl font-bold text-blue-600">
            My Profile
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your account details.
          </p>

          {/* Loading */}
          {loading && (
            <p className="mt-6 text-slate-600">
              Loading profile...
            </p>
          )}

          {profile && (
            <form
              onSubmit={handleUpdateProfile}
              className="mt-8 space-y-5"
            >

              {/* Name - EDITABLE */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email - NOT EDITABLE */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={profile.email || ""}
                  disabled
                  className="w-full border border-slate-300 bg-slate-100 text-slate-500 rounded-lg px-4 py-3 cursor-not-allowed"
                />

                <p className="text-xs text-slate-500 mt-1">
                  Email address cannot be changed.
                </p>
              </div>

              {/* Role - NOT EDITABLE */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Role
                </label>

                <input
                  type="text"
                  value={profile.role || ""}
                  disabled
                  className="w-full border border-slate-300 bg-slate-100 text-slate-500 rounded-lg px-4 py-3 cursor-not-allowed capitalize"
                />
              </div>

             
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Account Created
                </label>

                <input
                  type="text"
                  value={
                    profile.createdAt
                      ? new Date(
                          profile.createdAt
                        ).toLocaleDateString()
                      : ""
                  }
                  disabled
                  className="w-full border border-slate-300 bg-slate-100 text-slate-500 rounded-lg px-4 py-3 cursor-not-allowed"
                />
              </div>

              {/* Update Button */}
              <button
                type="submit"
                disabled={saving}
                className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {saving ? "Updating..." : "Update Profile"}
              </button>
            </form>
          )}

          {/* Saved Addresses */}
          {profile?.role === "buyer" && (
            <div className="mt-8">
              <SavedAddressBook onSelect={() => {}} />
            </div>
          )}

          {/* Logged in user */}
          <div className="mt-8 text-sm text-slate-500">
            Logged in as:{" "}
            <span className="font-semibold">
              {profile?.name || user?.name || "User"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
