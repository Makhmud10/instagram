import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useStateValue } from "../StateProvider";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import db, { auth } from "../firebase";
import Navbar from "./Navbar";

function Profile() {
  const [{ user }] = useStateValue();
  const [allPost, setAllPost] = useState([]);
  const [editing, setEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(
        collection(db, "posts"),
        where("userName", "==", user?.userName)
      );

      const querySnapshot = await getDocs(q);

      setAllPost(querySnapshot.docs);
    };

    fetchPosts();
  }, [user?.userName]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const userDocRef = doc(db, "users", user.uid);

      if (newDisplayName) {
        await updateDoc(userDocRef, { displayName: newDisplayName });
      }

      if (newEmail) {
        await updateDoc(userDocRef, { email: newEmail });
        await auth.currentUser.updateEmail(newEmail);
      }

      if (newPassword) {
        await auth.currentUser.updatePassword(newPassword);
      }

      setEditing(false);
      alert("Profile updated successfully!"); // Display alert message
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating profile."); // Display error alert message
    }
  };

  return (
    <Container>
      <Navbar />
      <Main>
        <UserProfile>
          <div className="user-image">
            <img
              src={user?.photoURL === null ? "./user.png" : user?.photoURL}
              alt=""
            />
          </div>

          {editing ? (
            <EditProfileForm onSubmit={handleUpdateProfile}>
              <input
                type="text"
                placeholder="New Display Name"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
              />
              <input
                type="email"
                placeholder="New Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button type="submit">Save Changes</button>
            </EditProfileForm>
          ) : (
            <div>
              <h2>{user?.displayName}</h2>
              <p>{user?.email}</p>
            </div>
          )}

          <EditButton onClick={() => setEditing(!editing)}>
            {editing ? "Cancel" : "Edit Profile"}
          </EditButton>
        </UserProfile>
      </Main>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Main = styled.main``;


const UserProfile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-bottom: 1px solid lightgray;
  padding-bottom: 40px;

  .user-image {
    margin-right: 30px;
    z-index: -100;
    width: 155px;
    height: 155px;
    img {
      width: 100%;
      border-radius: 50%;
    }
  }
  h2 {
    font-size: 26px;
    font-weight: 500;
  }
`;

const EditProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  input,
  button {
    margin: 10px 0;
    padding: 8px;
    border: 1px solid lightgray;
    border-radius: 5px;
    outline: none;
  }

  button {
    background-color: #0095f6;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #007acc;
  }
`;

const EditButton = styled.button`
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #0095f6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #007acc;
  }
`;


export default Profile;