import { useState, useEffect } from "react";
import { addUsersToRoom, updateRoom, deleteRoom, getRoom } from "../../api/chat";
import { searchUsers } from "../../api/auth";

type RoomActionsNavProps = {
  roomId: number;
  onRoomUpdated?: () => void;
  onRoomDeleted?: () => void;
};

const RoomActionsNav = ({ roomId, onRoomUpdated, onRoomDeleted }: RoomActionsNavProps) => {
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showUpdateRoom, setShowUpdateRoom] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [roomName, setRoomName] = useState("");
  const [currentRoomName, setCurrentRoomName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomMembers, setRoomMembers] = useState<any[]>([]);
  const [roomDetails, setRoomDetails] = useState<any>(null);

  // Fetch room details and members
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const room = await getRoom(roomId);
        setCurrentRoomName(room.name);
        setRoomMembers(room.room_members || []);
        setRoomDetails(room);
      } catch (error) {
        console.error("Failed to fetch room details", error);
      }
    };
    
    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  // Debounced user search
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        const res = await searchUsers(query);
        // Filter out users who are already in the room
        const availableUsers = (res.results || res).filter(
          (user: any) => !roomMembers.some(member => member.id === user.id)
        );
        setResults(availableUsers);
        setShowDropdown(true);
      } catch {
        console.error("User search failed");
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query, roomMembers]);

  // Toggle user selection
  const toggleUser = (user: any) => {
    const exists = selectedUsers.find((u) => u.id === user.id);
    if (exists) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Handle add members
  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return;

    try {
      setLoading(true);
      await addUsersToRoom(
        roomId,
        selectedUsers.map((u) => u.id)
      );
      setSelectedUsers([]);
      setQuery("");
      setShowAddMembers(false);
      
      // Refresh room members list
      const updatedRoom = await getRoom(roomId);
      setRoomMembers(updatedRoom.room_members || []);
      setRoomDetails(updatedRoom);
      
      alert("Members added successfully");
      onRoomUpdated?.();
    } catch {
      console.error("Failed to add members");
      alert("Failed to add members");
    } finally {
      setLoading(false);
    }
  };

  // Handle update room
  const handleUpdateRoom = async () => {
    if (!roomName.trim()) return;

    try {
      setLoading(true);
      await updateRoom(roomId, {
        name: roomName,
        is_group: true,
      });
      setCurrentRoomName(roomName);
      setRoomName("");
      setShowUpdateRoom(false);
      
      // Refresh room details
      const updatedRoom = await getRoom(roomId);
      setRoomDetails(updatedRoom);
      
      alert("Room updated successfully");
      onRoomUpdated?.();
    } catch {
      console.error("Update failed");
      alert("Failed to update room");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete room confirmation
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteRoom(roomId);
      setShowDeleteConfirm(false);
      alert("Room deleted successfully");
      onRoomDeleted?.();
    } catch {
      console.error("Delete failed");
      alert("Failed to delete room");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-600 text-white';
      case 'member':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="bg-gray-800 text-white p-3 flex items-center justify-between border-b border-gray-700">
        <button
          onClick={() => setShowRoomInfo(true)}
          className="text-lg font-semibold truncate flex-1 text-left hover:text-blue-400 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {currentRoomName || "Loading..."}
        </button>
        
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setShowAddMembers(true)}
            className="hover:bg-green-700 p-2 rounded transition-colors"
            title="Add Members"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </button>
          
          <button
            onClick={() => setShowUpdateRoom(true)}
            className="hover:bg-yellow-600 p-2 rounded transition-colors"
            title="Update Room"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={handleDeleteClick}
            className="hover:bg-red-700 p-2 rounded transition-colors"
            title="Delete Room"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Room Info Modal */}
      {showRoomInfo && roomDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-[500px] max-w-md relative">
            {/* Close button */}
            <button
              onClick={() => setShowRoomInfo(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-3 rounded-full">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{roomDetails.name}</h3>
                  <p className="text-gray-400 text-sm">
                    Created {formatDate(roomDetails.created_at)}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Members ({roomMembers.length})
                  </h4>
                  <span className="text-xs text-gray-400">
                    {roomDetails.is_group ? 'Group Chat' : 'Direct Message'}
                  </span>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {roomMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                          {member.username?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {member.username || member.email?.split('@')[0]}
                          </div>
                          <div className="text-xs text-gray-400">{member.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(member.role)}`}>
                          {member.role}
                        </span>
                        <div className="text-xs text-gray-500">
                          Joined {new Date(member.joined_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Members Modal */}
      {showAddMembers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-96 max-w-md relative">
            {/* Close button */}
            <button
              onClick={() => {
                setShowAddMembers(false);
                setSelectedUsers([]);
                setQuery("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
            
            <h3 className="text-lg font-semibold mb-4 text-white pr-6">Add Members to {currentRoomName}</h3>
            
            <div className="relative mb-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users by username..."
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              />
              
              {showDropdown && (
                <div className="absolute w-full bg-gray-800 border border-gray-700 mt-1 max-h-60 overflow-y-auto rounded z-10">
                  {results.length === 0 ? (
                    <div className="p-2 text-gray-400">
                      {query.trim() ? "No users found" : "Type to search users"}
                    </div>
                  ) : (
                    results.map((user) => {
                      const isChecked = selectedUsers.some((u) => u.id === user.id);
                      const isAlreadyMember = roomMembers.some(member => member.id === user.id);
                      
                      if (isAlreadyMember) return null;
                      
                      return (
                        <label
                          key={user.id}
                          className="flex items-center gap-2 p-2 hover:bg-gray-700 cursor-pointer text-white"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleUser(user)}
                            className="mr-2"
                          />
                          <div>
                            <div className="font-medium">{user.username}</div>
                            {user.email && <div className="text-xs text-gray-400">{user.email}</div>}
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Current Members */}
            {roomMembers.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Current Members ({roomMembers.length})</h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {roomMembers.map((member) => (
                    <span
                      key={member.id}
                      className="bg-gray-700 px-2 py-1 rounded text-sm text-gray-200"
                    >
                      {member.username || member.email?.split('@')[0]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Users to Add */}
            {selectedUsers.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Users to Add ({selectedUsers.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <span
                      key={user.id}
                      className="bg-blue-600 px-2 py-1 rounded text-sm text-white flex items-center gap-1"
                    >
                      {user.username || user.name}
                      <button
                        onClick={() => toggleUser(user)}
                        className="hover:text-gray-300 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleAddMembers}
                disabled={selectedUsers.length === 0 || loading}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded text-white disabled:opacity-50"
              >
                {loading ? "Adding..." : `Add ${selectedUsers.length} Member${selectedUsers.length !== 1 ? 's' : ''}`}
              </button>
              <button
                onClick={() => {
                  setShowAddMembers(false);
                  setSelectedUsers([]);
                  setQuery("");
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Room Modal */}
      {showUpdateRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-96 max-w-md relative">
            {/* Close button */}
            <button
              onClick={() => {
                setShowUpdateRoom(false);
                setRoomName("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
            
            <h3 className="text-lg font-semibold mb-4 text-white pr-6">Update Room Name</h3>
            
            <input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter new room name"
              className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-700"
              autoFocus
            />

            <div className="flex gap-2">
              <button
                onClick={handleUpdateRoom}
                disabled={!roomName.trim() || loading}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 rounded text-white disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Room"}
              </button>
              <button
                onClick={() => {
                  setShowUpdateRoom(false);
                  setRoomName("");
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Room Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-96 max-w-md relative">
            {/* Close button */}
            <button
              onClick={handleCancelDelete}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
            
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">Delete Room</h3>
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete "<span className="font-semibold text-white">{currentRoomName}</span>"?
              </p>
              <p className="text-sm text-gray-400 mb-6">
                This action cannot be undone. All messages and data in this room will be permanently deleted.
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded text-white disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Yes, Delete Room"}
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomActionsNav;