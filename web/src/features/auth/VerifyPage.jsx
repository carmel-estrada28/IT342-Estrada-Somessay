import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from '../../shared/api/axiosClient'

export default function VerifyPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState('loading') // loading | success | error

    useEffect(() => {
        const token = searchParams.get('token')
        if (!token) {
            setStatus('error')
            return
        }

        axios.get(`/auth/verify?token=${token}`)
            .then(() => setStatus('success'))
            .catch(() => setStatus('error'))
    }, [])

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f5f0e8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Georgia', serif"
        }}>
            <div style={{
                maxWidth: '480px',
                width: '90%',
                padding: '2rem',
                backgroundColor: '#EED59F',
                borderRadius: '16px',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '2rem', color: '#2c2c2c', marginBottom: '0.5rem' }}>
                    somessay.
                </h1>
                <p style={{ color: '#5C3D1E', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    a place to tell your written roots.
                </p>

                {status === 'loading' && (
                    <p style={{ color: '#2c2c2c' }}>verifying your email...</p>
                )}

                {status === 'success' && (
                    <>
                        <h2 style={{ color: '#2c2c2c', fontWeight: 'normal' }}>
                            you're in. 🌿
                        </h2>
                        <p style={{ color: '#2c2c2c', lineHeight: 1.7 }}>
                            your email has been verified. welcome to somessay.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                marginTop: '2rem',
                                padding: '1rem 2rem',
                                backgroundColor: '#59643A',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '1rem',
                                cursor: 'pointer',
                                width: '100%'
                            }}>
                            enter the seasons →
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <h2 style={{ color: '#9B4B42', fontWeight: 'normal' }}>
                            something went wrong.
                        </h2>
                        <p style={{ color: '#2c2c2c', lineHeight: 1.7 }}>
                            this verification link is invalid or has already been used.
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            style={{
                                marginTop: '2rem',
                                padding: '1rem 2rem',
                                backgroundColor: '#D37B27',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '1rem',
                                cursor: 'pointer',
                                width: '100%'
                            }}>
                            back to register →
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}