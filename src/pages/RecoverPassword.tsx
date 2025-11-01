import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const RecoverPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();
  const { forgotPassword } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
       const result = await forgotPassword(email, newPassword);
         if (result.success) {
            toast.success('Senha alterada com sucesso!');
            setTimeout(() => {
                navigate('/auth');
            }, 2000);
         } else {
            toast.error(result.error || 'Erro ao alterar senha.');
         }
    };

    return (
        <>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white border border-gray-300 rounded shadow-md">
                <h2 className="text-center text-2xl font-bold mb-6">Recuperação de Senha</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nova Senha:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
                        Recuperar Senha
                    </button>
                </form>
            </div>
        </div>
        </>
    );
};

export default RecoverPassword;