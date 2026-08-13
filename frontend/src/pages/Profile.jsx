import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import SavedAddressBook from "../components/SavedAddressBook";

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await API.get("/auth/profile");
        setProfile(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold text-blue-600">My Profile</h1>
        <p className="mt-2 text-slate-600">Your account details are loaded from the backend.</p>

        {loading && <p className="mt-6">Loading profile...</p>}
        {error && <p className="mt-6 text-red-500">{error}</p>}

        {profile && (
          <div className="mt-8 space-y-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-slate-500">Name</p>
              <p className="text-lg font-semibold">{profile.name}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-lg font-semibold">{profile.email}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-slate-500">Role</p>
              <p className="text-lg font-semibold capitalize">{profile.role}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-slate-500">Account Created</p>
              <p className="text-lg font-semibold">{new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}

        {profile?.role === "buyer" && <div className="mt-8"><SavedAddressBook onSelect={() => {}} /></div>}

        {!loading && !error && !profile && (
          <p className="mt-6 text-slate-500">No profile data available.</p>
        )}

        <div className="mt-8 text-sm text-slate-500">
          Logged in as: <span className="font-semibold">{user?.name || "User"}</span>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Profile;
