import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import account from "./images/account.svg";
import edit from "./images/edit.svg";
import sound from "./images/sound.svg";
import save from "./images/save.svg";
import cross from "./images/cross.svg";



const PROFILE_MUTATION = gql`
  mutation Update($input: updateuser!) {
    Update(input: $input) {
      displayname
    }
  }
`;

const GET_PROFILE_INFO = gql`
  query {
    FindUserForProfile {
      displayname
      username
    }
  }
`;

const Profile = () => {
    const navigate = useNavigate();

    // GraphQL hooks
    const { data, loading, error } = useQuery(GET_PROFILE_INFO);
    const [updateProfile] = useMutation(PROFILE_MUTATION);

    const users = data?.FindUserForProfile;

    // Local states
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [tempName, setTempName] = useState('');

    // Update state when query data arrives
    useEffect(() => {
        if (users) {
            setDisplayName(users.displayname || '');
            setTempName(users.displayname || '');
        }
    }, [users]);

    // Handlers
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await updateProfile({
                variables: { input: { newdisplayname: tempName } },
            });
            setDisplayName(tempName.trim() || "Unnamed");
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (err) {
            toast.error("Failed to update profile!");
        }
    };

    const handleCancel = () => {
        setTempName(displayName);
        setIsEditing(false);
    };

    const handleLogout = () => {
        // add your logout logic here (e.g. remove token, redirect, etc.)
        navigate('/');
        toast.info("Logged out successfully!");
    };

    if (loading) return <p className="text-center mt-10 text-2xl text-[#7a4f0a]">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-600">Error loading profile!</p>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-[#8dc9c0] via-[#f7b96a] to-[#f9a62b] text-[#7a4f0a] select-none font-['Fredoka_One']">
            <ToastContainer />
            <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
                <div className="w-[420px] p-6 rounded-3xl bg-[#fce9b8] border-4 border-[#7f4f0a] shadow-[6px_6px_0_0_#7f4f0a]">

                    {/* PROFILE SECTION */}
                    <div className="flex items-center space-x-6 mb-3">
                        <div className="flex-shrink-0 rounded-full border-4 border-[#8a5f1a] p-1">
                            <img
                                alt="User avatar"
                                className="rounded-full"
                                height="96"
                                src={account}
                                width="96"
                            />
                        </div>
                        <div>
                            <p className="text-3xl font-semibold drop-shadow-sm">Username</p>
                            <p className="text-2xl text-[#b36b00]">{users?.username || '...'}</p>
                        </div>
                    </div>

                    {/* ACCOUNT INFO */}
                    <div className="border-t-4 border-[#d6c6a6] pt-6 mt-3 space-y-6">
                        <div className="flex items-start justify-between" id="displayNameSection">
                            <div className="flex flex-col text-2xl w-full">
                                <span className="text-2xl font-medium drop-shadow-sm mb-1">Display Name</span>

                                {/* Text or Input */}
                                {!isEditing ? (
                                    <p className="text-2xl text-[#b36b00]">{displayName || 'Unnamed'}</p>
                                ) : (
                                    <div className="flex items-center space-x-3 w-full h-[2rem]">
                                        <input
                                            type="text"
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            className="border-b-2 border-[#b36b00] bg-transparent text-[#b36b00] text-2xl focus:outline-none w-full"
                                            autoFocus
                                        />
                                        <img
                                            onClick={handleSave}
                                            className="w-7 hover:scale-110 transition"
                                            src={save}
                                        />
                                        <img
                                            onClick={handleCancel}
                                            className="w-7 hover:scale-110 transition"
                                            src={cross}
                                            alt="Cancel"
                                        />

                                    </div>
                                )}
                            </div>

                            {!isEditing && (
                                <img
                                    onClick={handleEditClick}
                                    alt="Edit display name"
                                    src={edit}
                                    className="w-9 h-9 cursor-pointer hover:scale-110 transition ml-4"
                                />
                            )}
                        </div>
                    </div>

                    {/* SOUND / MUSIC TOGGLES */}
                    <ul className="space-y-8 text-[#7a4f0a] font-extrabold text-2xl mt-2 pt-6 select-none">
                        <li className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img
                                    alt="Sound icon"
                                    className="w-9 h-9 drop-shadow-md"
                                    src={sound}
                                    width="36"
                                    height="36"
                                />
                                <span className="drop-shadow-sm">Sound</span>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-16 h-9 bg-[#d6c6a6] rounded-full peer-checked:bg-green-600 relative shadow-inner transition-colors" />
                                <div className="absolute left-1 top-1 w-7 h-7 bg-[#e6e3c3] rounded-full peer-checked:translate-x-7 transition-transform shadow-md" />
                            </label>
                        </li>
                    </ul>

                    {/* LOGOUT BUTTON */}
                    <div className="pt-8 mt-1 text-center">
                        <button
                            onClick={handleLogout}
                            className="text-2xl font-bold text-[#b84b00] hover:scale-110 transition-transform duration-200 cursor-pointer"
                        >
                            Logout 🚪
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
