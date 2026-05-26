'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import hide from '../../../public/Image/hide.png';
import sw from '../../../public/Image/show.png';

export default function Page() {
  const [data, setData] = useState({ userID: '', password: '' });
  const [message, setMessage] = useState('');
  const [message1, setMessage1] = useState('');
  const [show, setShow] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setShow(!show);
  };

  const onLogin = async () => {
    if (!data.userID || !data.password) {
      setMessage('Please enter all fields');
      setMessage1('');
      return;
    }

    setMessage('');
    setMessage1('Please wait while Logging in...');

    try {
      let response = await fetch(window.location.origin + '/api/users/login', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      if (response.status === 202) {
        await response.json();
        router.push('./dashboard');
      } else {
        setMessage1('');
        setMessage('Invalid User ID or password');
      }
    } catch (error) {
      setMessage1('Login failed. Try again.');
    }
  };

  return (
    <div style={{
      height: '100dvh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f4f6f8',
      fontFamily: 'Arial, sans-serif',
  margin: 0,
    boxSizing: "border-box",
    overflow: "hidden",
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        width: '90%',
        maxWidth: '300px',
        maxHeight: '400px',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1A5D1A' }}>Login</h2>

        {/* User ID */}
        <label style={{ fontWeight: 'bold', marginBottom: '0px', display: 'block' }}>User ID</label>
        <input
          type="text"
          name="userID"
          placeholder="Enter User ID"
          onChange={handleInputChange}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '6px',
            border: '1px solid #ccc',
             height: "35px",
            padding: "5px",
          marginTop: "7px",
          fontSize: "16px",
          paddingLeft:"10px"

          }}
        />

        {/* Password */}
        <label style={{ fontWeight: 'bold', marginBottom: '0px', display: 'block' }}>Password</label>
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <input
            type={show ? 'text' : 'password'}
            name="password"
            placeholder="Enter Password"
            onChange={handleInputChange}
            style={{
              width: '100%',
              borderRadius: '6px',
              border: '1px solid #ccc',
             height: "35px",
            padding: "5px",
          marginTop: "7px",
          fontSize: "16px",
          paddingLeft:"10px"
            }}
          />
          <div
            onClick={togglePassword}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-25%)',
              cursor: 'pointer'
            }}
          >
            <Image src={show ? sw : hide} width={24} height={24} alt="Toggle visibility" />
          </div>
        </div>

        {/* Alerts */}
        {message && <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{message}</div>}
        {message1 && <div style={{ color: 'green', fontSize: '14px', marginBottom: '10px' }}>{message1}</div>}

        {/* Forgot Password */}
        <div style={{ textAlign: 'right', fontSize: '13px', marginBottom: '20px', color: '#007BFF', cursor: 'pointer' }}>
          Forgot password?
        </div>

        {/* Login Button */}
        <button
          onClick={onLogin}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#1A5D1A',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '20px',
          height: "40px",
     fontSize:'17px',
         
          }}
        >
          Login
        </button>
        

        {/* Sign Up */}
        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          Don't have an account? <Link href="/register" style={{ color: '#1A5D1A', fontWeight: 'bold' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
