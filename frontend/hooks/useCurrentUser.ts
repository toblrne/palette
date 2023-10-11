import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types/types'

function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get('http://localhost:3001/users/me', {
          withCredentials: true
        });

        if (res.data.user) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error("Error fetching current user", error);
      }
    };

    fetchCurrentUser();
  }, []);

  return { user, setUser }; // Return both user and setUser
}

export default useCurrentUser;